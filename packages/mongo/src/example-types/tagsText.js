import _ from 'lodash/fp.js'
import text from './text.js'

// `tagsText` is just text with only values and not value
export default {
  hasValue: _.get('values.length'),
  filter: text.filter,
}
