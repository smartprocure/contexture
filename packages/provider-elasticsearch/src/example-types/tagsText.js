let text = require('./text')

// `tagsText` is just text with only values and not value
module.exports = {
  hasValue: _.get('values.length'),
  filter: text.fiter,
}
