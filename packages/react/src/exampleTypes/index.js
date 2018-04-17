import React from 'react'
import * as F from 'futil-js'

import Facet from './Facet'
import Number from './Number'
import Query from './Query'
import ResultCount from './ResultCount'
import ResultTable from './ResultTable'
import DateHistogram from './DateHistogram'
import Styles from './Styles'

export {Facet, Number, Query, ResultCount, ResultTable, DateHistogram, Styles}

export let TypeMap = {
  facet: Facet,
  query: Query,
  number: Number,
  date: Number, // FIX
}

