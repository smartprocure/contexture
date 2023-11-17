import _ from 'lodash/fp.js'

export const validateValueExistence = _.flow(_.get('value'), _.negate(_.isNil))
