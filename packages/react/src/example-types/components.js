import React from 'react'
import * as F from 'futil-js'

import Facet from './Facet'
import Range from './Range'
import Query from './Query'
import ResultCount from './ResultCount'
import DateHistogram from './DateHistogram'
import Styles from './Styles'
export {Facet, Range, Query, ResultCount, DateHistogram, Styles}

export let TypeMap = {
  facet: Facet,
  query: Query,
  number: Range,
}

