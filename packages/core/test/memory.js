let _ = require('lodash/fp')
let { expect } = require('chai')
let Contexture = require('../src/index')
let provider = require('../src/provider-memory')
let movies = require('./imdb-data')

describe('Memory Provider', () => {
  let process = Contexture({
    schemas: {
      test: {
        memory: {
          records: [{ a: 1, b: 1 }, { a: 1, b: 3 }, { a: 2, b: 2 }],
        },
      },
      movies: {
        memory: {
          records: _.map(x => {
            x.released = new Date(x.released)
            return x
          }, movies),
        },
      },
    },
    providers: {
      memory: provider,
    },
  })
  describe('basic test cases', () => {
    it('should handle basic AND test case', async () => {
      let dsl = {
        key: 'root',
        type: 'group',
        schema: 'test',
        join: 'and',
        children: [
          {
            key: 'filter',
            type: 'facet',
            field: 'a',
            values: [1, 2],
          },
          {
            key: 'filter2',
            type: 'facet',
            field: 'a',
            values: [1],
          },
          {
            key: 'results',
            type: 'results',
            config: {
              page: 1,
            },
          },
        ],
      }
      let result = await process(dsl)
      expect(result.children[0].context).to.deep.equal({
        cardinality: 1,
        options: [{ name: '1', count: 2 }],
      })
      expect(result.children[1].context).to.deep.equal({
        cardinality: 2,
        options: [{ name: '1', count: 2 }, { name: '2', count: 1 }],
      })
      expect(result.children[2].context).to.deep.equal({
        results: [{ a: 1, b: 1 }, { a: 1, b: 3 }],
      })
    })
    it('should handle basic OR test case', async () => {
      let dsl = {
        key: 'root',
        type: 'group',
        schema: 'test',
        join: 'or',
        children: [
          {
            key: 'filter',
            type: 'facet',
            field: 'a',
            values: [1, 2],
          },
          {
            key: 'filter2',
            type: 'facet',
            field: 'a',
            values: [1],
          },
          {
            key: 'results',
            type: 'results',
            config: {
              page: 1,
            },
          },
        ],
      }
      let result = await process(dsl)
      expect(result.children[0].context).to.deep.equal({
        cardinality: 2,
        options: [{ name: '1', count: 2 }, { name: '2', count: 1 }],
      })
      expect(result.children[1].context).to.deep.equal({
        cardinality: 2,
        options: [{ name: '1', count: 2 }, { name: '2', count: 1 }],
      })
      expect(result.children[2].context).to.deep.equal({
        results: [{ a: 1, b: 1 }, { a: 1, b: 3 }, { a: 2, b: 2 }],
      })
    })
  })

  describe('imdb test cases', () => {
    it('should handle facets', async () => {
      let dsl = {
        key: 'root',
        type: 'group',
        schema: 'movies',
        join: 'and',
        children: [
          {
            key: 'ratings',
            type: 'facet',
            field: 'rated',
            values: ['R', 'PG-13'],
          },
          {
            key: 'results',
            type: 'results',
            page: 1,
          },
        ],
      }
      let result = await process(dsl)
      let ratings = _.find({ key: 'ratings' }, result.children).context
      expect(ratings.cardinality).to.equal(25)
      expect(ratings.options).to.deep.equal([
        { name: 'R', count: 1104 },
        { name: 'PG-13', count: 525 },
        { name: 'TV-14', count: 361 },
        { name: 'PG', count: 333 },
        { name: 'Not Rated', count: 217 },
        { name: 'TV-PG', count: 169 },
        { name: 'TV-MA', count: 152 },
        { name: 'Approved', count: 149 },
        { name: 'Unrated', count: 125 },
        { name: 'G', count: 87 },
      ])
      let results = _.find({ key: 'results' }, result.children).context.results
      let inspectedResults = results.map(_.pick(['title', 'year', 'rated']))
      expect(inspectedResults).to.deep.equal([
        { title: 'The Dark Knight Rises', year: 2012, rated: 'PG-13' },
        { title: 'The Usual Suspects', year: 1995, rated: 'R' },
        { title: 'American Beauty', year: 1999, rated: 'R' },
        { title: 'The Prestige', year: 2006, rated: 'PG-13' },
        { title: 'Braveheart', year: 1995, rated: 'R' },
        {
          title: 'Eternal Sunshine of the Spotless Mind',
          year: 2004,
          rated: 'R',
        },
        { title: 'The Sixth Sense', year: 1999, rated: 'PG-13' },
        { title: 'Life Is Beautiful', year: 1997, rated: 'PG-13' },
        { title: "Pan's Labyrinth", year: 2006, rated: 'R' },
        { title: 'Heat', year: 1995, rated: 'R' },
      ])
    })
    it('should handle text', async () => {
      let dsl = {
        key: 'root',
        type: 'group',
        schema: 'movies',
        join: 'and',
        children: [
          {
            key: 'filter',
            type: 'text',
            field: 'title',
            value: 'game',
            operator: 'startsWith',
          },
          {
            key: 'results',
            type: 'results',
            page: 1,
          },
        ],
      }
      let result = await process(dsl)
      let results = _.find({ key: 'results' }, result.children).context.results
      let inspectedResults = _.map('title', results)
      expect(inspectedResults).to.deep.equal([
        'Game of Thrones',
        'Gamer',
        'Game Night',
      ])
    })
    it('should handle date', async () => {
      let dsl = {
        key: 'root',
        type: 'group',
        schema: 'movies',
        join: 'and',
        children: [
          {
            key: 'datefilter',
            type: 'date',
            field: 'released',
            from: '2013-01-01',
          },
          {
            key: 'results',
            type: 'results',
            page: 1,
          },
        ],
      }
      let result = await process(dsl)
      let results = _.find({ key: 'results' }, result.children).context.results
      let inspectedResults = _.map('year', results)
      expect(inspectedResults).to.deep.equal([
        2012,
        2013,
        2009,
        2013,
        2012,
        2013,
        2013,
        2013,
        2012,
        2013,
      ])
    })
    it('should handle results sorting', async () => {
      let dsl = {
        key: 'root',
        type: 'group',
        schema: 'movies',
        join: 'and',
        children: [
          {
            key: 'results',
            type: 'results',
            page: 1,
            pageSize: 1,
            sortField: 'year',
          },
        ],
      }
      let result = await process(dsl)
      let results = _.find({ key: 'results' }, result.children).context.results
      let inspectedResults = _.map('year', results)
      expect(inspectedResults).to.deep.equal([2013])

      dsl.children[0].sortDir = 'asc'
      let ascResult = await process(dsl)
      let ascResults = _.find({ key: 'results' }, ascResult.children).context
        .results
      let ascInspectedResults = _.map('year', ascResults)
      expect(ascInspectedResults).to.deep.equal([1915])
    })
  })
})