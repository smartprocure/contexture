import _ from 'lodash/fp'
import React from 'react'
import ThemePicker from './stories/themePicker'
import MemoryTable from './MemoryTable'
import emoji from 'emoji-datasource'
import sheet from 'emoji-datasource/img/twitter/sheets/32.png'

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

export let withInfer = () => {
  let data = _.times(x => ({ _id: x, value: _.random(0, 20000) }), 221)
  return <MemoryTable infer {...{ data }} />
}

export let emojis = () => (
  <MemoryTable
    infer
    data={emoji}
    fields={{
      image: {
        order: 1,
        display: (x, { sheet_x, sheet_y }) => (
          <div
            style={{
              backgroundImage: `url(${sheet})`,
              backgroundPosition: `-${sheet_x * 34}px -${sheet_y * 34}px`,
              width: 33,
              height: 33,
              transform: 'scale(0.75)',
            }}
          />
        ),
      },
    }}
  />
)

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
