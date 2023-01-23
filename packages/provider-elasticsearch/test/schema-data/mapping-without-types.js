export default {
  movies: {
    mappings: {
      properties: {
        actors: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
        awards: {
          type: 'text',
          fields: {
            keyword: {
              type: 'keyword',
              ignore_above: 256,
            },
          },
        },
      },
    },
  },

  weirdEmptyIndexThatWeWillNowIgnore: {
    mappings: {},
  },
}
