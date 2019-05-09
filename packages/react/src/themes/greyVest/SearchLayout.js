import React from 'react'
import { observer } from 'mobx-react'

let SearchLayout = ({ mode, ...props}) =>
  <div className={`gv-search-layout-${mode}`} {...props} />

export default observer(SearchLayout)