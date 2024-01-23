export let schema = {
  elasticsearch: {
    subFields: {
      keyword: { highlight: false },
      subfield: { highlight: true },
    },
  },
  fields: {
    groupField: {
      elasticsearch: {
        dataType: 'text',
        mapping: {
          fields: {
            subfield: {
              type: 'text',
            },
          },
        },
      },
    },
    'library.name': {
      elasticsearch: {
        dataType: 'text',
        mapping: {
          fields: {
            subfield: {
              type: 'text',
            },
          },
        },
      },
    },
    'library.about': {
      subType: 'blob',
      elasticsearch: {
        dataType: 'text',
        mapping: {
          copy_to: ['groupField'],
          fields: {
            subfield: {
              type: 'text',
              copy_to: ['groupField.subfield'],
            },
          },
        },
      },
    },
    'library.categories': {
      subType: 'array',
      elasticsearch: {
        dataType: 'text',
        mapping: {
          fields: {
            subfield: {
              type: 'text',
            },
          },
        },
      },
    },
    'library.books': {
      subType: 'array',
      elasticsearch: {},
    },
    'library.books.cover.title': {
      elasticsearch: {
        dataType: 'text',
        mapping: {
          fields: {
            subfield: {
              type: 'text',
            },
          },
        },
      },
    },
    'library.books.cover.author': {
      elasticsearch: {
        dataType: 'text',
        mapping: {
          fields: {
            subfield: {
              type: 'text',
            },
          },
        },
      },
    },
  },
}
