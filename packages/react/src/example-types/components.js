import React from 'react'
import * as F from 'futil-js'

import facet from './Facet'
import range from './Range'
import query from './Query'
import resultCount from './ResultCount'
import dateHistogram from './DateHistogram'
import styles from './Styles'

export let Facet = facet
export let Range = range
export let Query = query
export let ResultCount = resultCount
export let DateHistogram = dateHistogram
export let Styles = styles

export let TypeMap = {
  facet: Facet,
  number: range
}

