import _ from 'lodash/fp.js'
import * as text from './text.js'

// `tagsText` is just text with only values and not value
export let hasValue = _.get('values.length')

export let filter = text.filter
