import React from 'react'
import _ from 'lodash/fp'
import BooleanType from '../purgatory/BooleanType'

export default ({
  display = value => _.isNil(value) ? 'Either' : value ? 'Exists' : 'Does Not Exist',
  ...props
  }) => <BooleanType className='contexture-exists' display={display} {...props} />