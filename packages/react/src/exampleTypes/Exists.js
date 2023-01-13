import React from 'react'
import _ from 'lodash/fp.js'
import BooleanType from '../purgatory/BooleanType.js'

export default ({
  display = value =>
    _.isNil(value) ? 'Either' : value ? 'Exists' : 'Does Not Exist',
  ...props
}) => <BooleanType className="contexture-exists" display={display} {...props} />
