module.exports = {
  result: (context, search) =>
    search([
      {
        $group: {
          _id: {},
          count: { $sum: 1 },
          max: {
            $max: `$${context.field}`,
          },
          min: {
            $min: `$${context.field}`,
          },
          avg: {
            $avg: `$${context.field}`,
          },
          sum: {
            $sum: `$${context.field}`,
          },
        },
      },
    ]),
}
