import F from 'futil'
import _ from 'lodash/fp'
import React from 'react'
import EmojiIcon from './stories/EmojiIcon'
import ThemePicker from './stories/themePicker'
import { Select } from './greyVest'
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

export let withInfer = () => {
  let data = _.times(x => ({ _id: x, value: _.random(0, 20000) }), 221)
  return <MemoryTable infer {...{ data }} />
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

export let emojis = () => (
  <MemoryTable
    infer
    data={require('emoji-datasource')}
    fields={{
      image: {
        order: 1,
        display: (x, record) => <EmojiIcon set={record.set} record={record} />,
      },
      test: {
        order: 2,
        display: (x, record) => (
          <>
            <Select
              options={F.autoLabelOptions([
                'twitter',
                'google',
                'facebook',
                'apple',
              ])}
              onChange={value => {
                record.set = value
              }}
              value={record.set}
            />
          </>
        ),
      },
    }}
  />
)
