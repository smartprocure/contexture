export default {
  movies: {
    mappings: {
      dynamic: false,

      dynamic_templates: [
        {
          fieldgroup_all_fields: {
            match: 'FieldGroup.*',
            mapping: {
              fields: {
                exact: {
                  analyzer: 'exact',
                  type: 'text',
                },
              },
              type: 'text',
            },
          },
        },
      ],

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
