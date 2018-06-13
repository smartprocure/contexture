module.exports = {
  result: ({ field }, search) =>
    search([
      {
        $group: {
          _id: {},
          count: { $sum: 1 },
          max: {
            $max: `$${field}`,
          },
          min: {
            $min: `$${field}`,
          },
          avg: {
            $avg: `$${field}`,
          },
          sum: {
            $sum: `$${field}`,
          },
        },
      },
    ]),
}
