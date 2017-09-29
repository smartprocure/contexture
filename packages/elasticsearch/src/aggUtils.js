let _ = require('lodash/fp')
module.exports = {
  buildAgg: agg => ({
    [agg.key || agg.type]: {
      [agg.type]: _.extend(
        agg.data,
        {
          field: agg.field
        }
      )
    }
  }),
  buildFilter: agg => ({
    [agg.type]: {
      [agg.field]: agg.data
    }
  })
}
