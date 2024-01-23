export default {
  movies: {
    elasticsearch: {
      index: 'movies',
    },
    fields: {
      actors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          mapping: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256,
              },
            },
          },
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
          mapping: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256,
              },
            },
          },
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
    },
    fields: {
      actors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          mapping: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256,
              },
            },
          },
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
          mapping: {
            type: 'text',
            fields: {
              keyword: {
                type: 'keyword',
                ignore_above: 256,
              },
            },
          },
        },
        field: 'awards',
        label: 'Awards',
      },
    },
  },
}
