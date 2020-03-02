import _ from 'lodash/fp'
import React from 'react'
import ThemePicker from './stories/themePicker'
import MemoryTable from './MemoryTable'

export default {
  title: 'MemoryTable',
  component: MemoryTable,
  decorators: [ThemePicker('greyVest')],
}

export let story = () => {
  let fields = { _id: { label: 'id' }, value: { label: 'val' } }
  let data = _.times(x => ({ _id: x, value: _.random(0, 20000) }), 221)
  return <MemoryTable {...{ data, fields }} />
}

export let resultTableProps = () => {
  let fields = { _id: { label: 'id' }, value: { label: 'val' } }
  let data = _.times(x => ({ _id: x, value: _.random(0, 20000) }), 221)
  return (
    <MemoryTable
      {...{ data, fields }}
      pageSize={12}
      pageSizeOptions={[12, 24, 48, 96]}
    />
  )
}
