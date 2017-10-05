let ObjectID = require('mongodb').ObjectID

module.exports = {
  hasValue: context => context.data.value,
  filter: context => ({
    [context.field]: new ObjectID(context.data.value),
  }),
}
