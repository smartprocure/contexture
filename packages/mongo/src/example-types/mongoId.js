let ObjectID = require('mongodb').ObjectID

module.exports = {
  hasValue: context => context.data.values || context.data.value,
  filter: context => ({
    [context.field]: context.data.values
      ? { $in: _.map(x => new ObjectID(x), context.data.values) }
      : new ObjectID(context.data.value),
  }),
}
