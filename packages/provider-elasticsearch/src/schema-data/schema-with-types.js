export default {
  movies: {
    elasticsearch: {
      index: 'movies',
      type: 'movie',
      subFields: {
        keyword: { shouldHighlight: false },
        exact: { shouldHighlight: true },
      },
    },
    fields: {
      actors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
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
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'awards',
        label: 'Awards',
      },
      countries: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'countries',
        label: 'Countries',
      },
      directors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'directors',
        label: 'Directors',
      },
      genres: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'genres',
        label: 'Genres',
      },
      imdbId: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'imdbId',
        label: 'Imdb Id',
      },
      imdbRating: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'float',
          type: 'float',
        },
        field: 'imdbRating',
        label: 'Imdb Rating',
      },
      imdbVotes: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'imdbVotes',
        label: 'Imdb Votes',
      },
      languages: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'languages',
        label: 'Languages',
      },
      metaScore: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'metaScore',
        label: 'Meta Score',
      },
      plot: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'plot',
        label: 'Plot',
      },
      poster: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'poster',
        label: 'Poster',
      },
      rated: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'rated',
        label: 'Rated',
      },
      released: {
        typeDefault: 'date',
        typeOptions: ['date', 'exists'],
        elasticsearch: {
          dataType: 'date',
          type: 'date',
        },
        field: 'released',
        label: 'Released',
      },
      runtimeMinutes: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'runtimeMinutes',
        label: 'Runtime Minutes',
      },
      title: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'title',
        label: 'Title',
      },
      type: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'type',
        label: 'Type',
      },
      writers: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'writers',
        label: 'Writers',
      },
      year: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'year',
        label: 'Year',
      },
      yearEnded: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'yearEnded',
        label: 'Year Ended',
      },
    },
  },
  imdb: {
    elasticsearch: {
      index: 'imdb',
      type: 'movie',
      aliasOf: 'movies',
      subFields: {
        keyword: { shouldHighlight: false },
        exact: { shouldHighlight: true },
      },
    },
    fields: {
      actors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
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
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'awards',
        label: 'Awards',
      },
      countries: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'countries',
        label: 'Countries',
      },
      directors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'directors',
        label: 'Directors',
      },
      genres: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'genres',
        label: 'Genres',
      },
      imdbId: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'imdbId',
        label: 'Imdb Id',
      },
      imdbRating: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'float',
          type: 'float',
        },
        field: 'imdbRating',
        label: 'Imdb Rating',
      },
      imdbVotes: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'imdbVotes',
        label: 'Imdb Votes',
      },
      languages: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'languages',
        label: 'Languages',
      },
      metaScore: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'metaScore',
        label: 'Meta Score',
      },
      plot: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'plot',
        label: 'Plot',
      },
      poster: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'poster',
        label: 'Poster',
      },
      rated: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'rated',
        label: 'Rated',
      },
      released: {
        typeDefault: 'date',
        typeOptions: ['date', 'exists'],
        elasticsearch: {
          dataType: 'date',
          type: 'date',
        },
        field: 'released',
        label: 'Released',
      },
      runtimeMinutes: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'runtimeMinutes',
        label: 'Runtime Minutes',
      },
      title: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'title',
        label: 'Title',
      },
      type: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'type',
        label: 'Type',
      },
      writers: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        field: 'writers',
        label: 'Writers',
      },
      year: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'year',
        label: 'Year',
      },
      yearEnded: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
          type: 'long',
        },
        field: 'yearEnded',
        label: 'Year Ended',
      },
    },
  },
}
