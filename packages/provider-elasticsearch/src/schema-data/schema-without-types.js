export default {
  movies: {
    elasticsearch: {
      index: 'movies',
      subFields: [
        {
          name: 'exact',
          shouldHighlight: true,
        },
      ],
    },
    fields: {
      actors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'actors',
        label: 'Actors',
      },
      awards: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'awards',
        label: 'Awards',
      },
    },
  },

  imdb: {
    elasticsearch: {
      index: 'imdb',
      aliasOf: 'movies',
      subFields: [
        {
          name: 'exact',
          shouldHighlight: true,
        },
      ],
    },
    fields: {
      actors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'actors',
        label: 'Actors',
      },
      awards: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'awards',
        label: 'Awards',
      },
    },
  },
}
