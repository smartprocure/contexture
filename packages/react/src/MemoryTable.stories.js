//import emoji from 'emoji-datasource'
import _ from 'lodash/fp'
import React from 'react'
import EmojiIcon from './stories/EmojiIcon'
import ThemePicker from './stories/themePicker'
import MemoryTable from './MemoryTable'

export default {
  title: 'MemoryTable',
  component: MemoryTable,
  decorators: [ThemePicker('greyVest')],
}

export let story = () => {
  let fields = { id: { label: '#' }, value: { label: 'Count' } }
  let data = _.times(x => ({ id: x, value: _.random(0, 20000) }), 221)
  return <MemoryTable {...{ data, fields }} />
}

export let withInfer = () => {
  let data = _.times(x => ({ id: x, value: _.random(0, 20000) }), 221)
  return <MemoryTable infer {...{ data }} />
}

export let resultTableProps = () => {
  let fields = { id: { label: '#' }, value: { label: 'Count' } }
  let data = _.times(x => ({ id: x, value: _.random(0, 20000) }), 221)
  return (
    <MemoryTable
      {...{ data, fields }}
      pageSize={12}
      pageSizeOptions={[12, 24, 48, 96]}
    />
  )
}

export let emojiDataset = () => (
  <MemoryTable
    infer
    data={require('emoji-datasource')}
    fields={{
      image: {
        order: 1,
        display: (x, record) => <EmojiIcon set="facebook" record={record} />,
      },
    }}
  />
)
