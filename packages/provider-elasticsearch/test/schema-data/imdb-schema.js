module.exports = {
  movies: {
    elasticsearch: {
      index: 'movies',
      type: 'movie',
    },
    modeMap: {
      word: '',
      autocomplete: '.keyword',
    },
    fields: {
      actors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'actors',
        label: 'Actors',
        order: 0,
      },
      awards: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'awards',
        label: 'Awards',
        order: 0,
      },
      countries: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'countries',
        label: 'Countries',
        order: 0,
      },
      directors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'directors',
        label: 'Directors',
        order: 0,
      },
      genres: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'genres',
        label: 'Genres',
        order: 0,
      },
      imdbId: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'imdbId',
        label: 'Imdb Id',
        order: 0,
      },
      imdbRating: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'float',
        },
        field: 'imdbRating',
        label: 'Imdb Rating',
        order: 0,
      },
      imdbVotes: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'imdbVotes',
        label: 'Imdb Votes',
        order: 0,
      },
      languages: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'languages',
        label: 'Languages',
        order: 0,
      },
      metaScore: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'metaScore',
        label: 'Meta Score',
        order: 0,
      },
      plot: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'plot',
        label: 'Plot',
        order: 0,
      },
      poster: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'poster',
        label: 'Poster',
        order: 0,
      },
      rated: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'rated',
        label: 'Rated',
        order: 0,
      },
      released: {
        typeDefault: 'date',
        typeOptions: ['date'],
        elasticsearch: {
          dataType: 'date',
        },
        field: 'released',
        label: 'Released',
        order: 0,
      },
      runtimeMinutes: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'runtimeMinutes',
        label: 'Runtime Minutes',
        order: 0,
      },
      title: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'title',
        label: 'Title',
        order: 0,
      },
      type: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'type',
        label: 'Type',
        order: 0,
      },
      writers: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'writers',
        label: 'Writers',
        order: 0,
      },
      year: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'year',
        label: 'Year',
        order: 0,
      },
      yearEnded: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'yearEnded',
        label: 'Year Ended',
        order: 0,
      },
    },
  },
  imdb: {
    elasticsearch: {
      index: 'imdb',
      type: 'movie',
    },
    modeMap: {
      word: '',
      autocomplete: '.keyword',
    },
    fields: {
      actors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'actors',
        label: 'Actors',
        order: 0,
      },
      awards: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'awards',
        label: 'Awards',
        order: 0,
      },
      countries: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'countries',
        label: 'Countries',
        order: 0,
      },
      directors: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'directors',
        label: 'Directors',
        order: 0,
      },
      genres: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'genres',
        label: 'Genres',
        order: 0,
      },
      imdbId: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'imdbId',
        label: 'Imdb Id',
        order: 0,
      },
      imdbRating: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'float',
        },
        field: 'imdbRating',
        label: 'Imdb Rating',
        order: 0,
      },
      imdbVotes: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'imdbVotes',
        label: 'Imdb Votes',
        order: 0,
      },
      languages: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'languages',
        label: 'Languages',
        order: 0,
      },
      metaScore: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'metaScore',
        label: 'Meta Score',
        order: 0,
      },
      plot: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'plot',
        label: 'Plot',
        order: 0,
      },
      poster: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'poster',
        label: 'Poster',
        order: 0,
      },
      rated: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'rated',
        label: 'Rated',
        order: 0,
      },
      released: {
        typeDefault: 'date',
        typeOptions: ['date'],
        elasticsearch: {
          dataType: 'date',
        },
        field: 'released',
        label: 'Released',
        order: 0,
      },
      runtimeMinutes: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'runtimeMinutes',
        label: 'Runtime Minutes',
        order: 0,
      },
      title: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'title',
        label: 'Title',
        order: 0,
      },
      type: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'type',
        label: 'Type',
        order: 0,
      },
      writers: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
        },
        field: 'writers',
        label: 'Writers',
        order: 0,
      },
      year: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'year',
        label: 'Year',
        order: 0,
      },
      yearEnded: {
        typeDefault: 'number',
        typeOptions: ['number'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'yearEnded',
        label: 'Year Ended',
        order: 0,
      },
    },
  },
}
