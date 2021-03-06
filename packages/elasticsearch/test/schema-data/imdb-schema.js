module.exports = {
  movies: {
    elasticsearch: {
      index: 'movies',
      type: 'movie',
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
      countries: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
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
        },
        field: 'imdbId',
        label: 'Imdb Id',
      },
      imdbRating: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'float',
        },
        field: 'imdbRating',
        label: 'Imdb Rating',
      },
      imdbVotes: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
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
        },
        field: 'languages',
        label: 'Languages',
      },
      metaScore: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
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
        },
        field: 'rated',
        label: 'Rated',
      },
      released: {
        typeDefault: 'date',
        typeOptions: ['date', 'exists'],
        elasticsearch: {
          dataType: 'date',
        },
        field: 'released',
        label: 'Released',
      },
      runtimeMinutes: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
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
        },
        field: 'writers',
        label: 'Writers',
      },
      year: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'year',
        label: 'Year',
      },
      yearEnded: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
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
      countries: {
        typeDefault: 'facet',
        typeOptions: ['facet', 'tagsQuery', 'tagsText', 'exists'],
        elasticsearch: {
          dataType: 'text',
          notAnalyzedField: 'keyword',
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
        },
        field: 'imdbId',
        label: 'Imdb Id',
      },
      imdbRating: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'float',
        },
        field: 'imdbRating',
        label: 'Imdb Rating',
      },
      imdbVotes: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
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
        },
        field: 'languages',
        label: 'Languages',
      },
      metaScore: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
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
        },
        field: 'rated',
        label: 'Rated',
      },
      released: {
        typeDefault: 'date',
        typeOptions: ['date', 'exists'],
        elasticsearch: {
          dataType: 'date',
        },
        field: 'released',
        label: 'Released',
      },
      runtimeMinutes: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
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
        },
        field: 'writers',
        label: 'Writers',
      },
      year: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'year',
        label: 'Year',
      },
      yearEnded: {
        typeDefault: 'number',
        typeOptions: ['number', 'exists'],
        elasticsearch: {
          dataType: 'long',
        },
        field: 'yearEnded',
        label: 'Year Ended',
      },
    },
  },
}
