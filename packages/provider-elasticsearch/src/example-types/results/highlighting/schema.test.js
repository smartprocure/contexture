export const schema = {
  fields: {
    'library.name': {
      elasticsearch: {
        dataType: 'text',
        fields: {
          subfield: {
            dataType: 'text',
          },
        },
      },
    },
    'library.about': {
      elasticsearch: {
        dataType: 'text',
        meta: { subType: 'blob' },
        fields: {
          subfield: {
            dataType: 'text',
          },
        },
      },
    },
    'library.categories': {
      elasticsearch: {
        dataType: 'text',
        meta: { subType: 'array' },
        fields: {
          subfield: {
            dataType: 'text',
          },
        },
      },
    },
    'library.books': {
      elasticsearch: {
        meta: { subType: 'array' },
      },
    },
    'library.books.cover.title': {
      elasticsearch: {
        dataType: 'text',
        fields: {
          subfield: {
            dataType: 'text',
          },
        },
      },
    },
    'library.books.cover.author': {
      elasticsearch: {
        dataType: 'text',
        fields: {
          subfield: {
            dataType: 'text',
          },
        },
      },
    },
  },
}

// Bogus test
it.skip('', () => {})
