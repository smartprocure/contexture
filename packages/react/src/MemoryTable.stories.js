import _ from 'lodash/fp'
import React from 'react'
import EmojiIcon from './stories/EmojiIcon'
import ThemePicker from './stories/themePicker'
import MemoryTable from './MemoryTable'
import { schema } from './exampleTypes/stories/emojiData'

export default {
  title: 'MemoryTable',
  component: MemoryTable,
  decorators: [ThemePicker('greyVest')],
  parameters: {
    componentSubtitle:
      "A ResultTable from arbitrary data using contexture's memory provider",
    info: `
MemoryTable is built on top of ResultTable and supports several of the same props: most notably \`fields\`, which takes a schema object that specifies which fields from the data are visible in the table and how they are ordered, and \`infer\`, which enables MemoryTable to infer field information from the given data without having to explicitly specify it in \`fields\`.

However, in place of ResultTable's contexture-relevant \`tree\`/\`node\`/\`path\` props, MemoryTable simply accepts a \`data\` prop, which should be an array of obects. This is fed into a contexture instance running on the \`memory\` provider, which allows contexture to work against data in the form of plain Javascript objects (in contrast to, for example, a MongoDB database). The result is a dynamically-generated table with built-in support for sorting and filtering operations on the given data.
`,
  },
}

export let story = () => (
  <MemoryTable
    data={_.times(x => ({ id: x, value: _.random(0, 20000) }), 221)}
    fields={{ id: { label: '#' }, value: { label: 'Count' } }}
  />
)

export let withInfer = () => (
  <MemoryTable
    infer
    data={_.times(x => ({ id: x, value: _.random(0, 20000) }), 221)}
  />
)

export let resultTableProps = () => (
  <MemoryTable
    data={_.times(x => ({ id: x, value: _.random(0, 20000) }), 221)}
    fields={{ id: { label: '#' }, value: { label: 'Count' } }}
    pageSize={12}
    pageSizeOptions={[12, 24, 48, 96]}
  />
)

export let emojiDataset = () => (
  <MemoryTable
    infer
    data={require('emoji-datasource')}
    fields={{
      ...schema,
      image: {
        order: 1,
        display: (x, record) => <EmojiIcon set="facebook" record={record} />,
      },
    }}
  />
)
