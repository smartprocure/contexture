var mongoose = require('mongoose')

module.exports = {
  hasValue: context => context.data.value,
  filter: context => ({
    [context.field]: mongoose.Types.ObjectId(context.data.value)
  })
}