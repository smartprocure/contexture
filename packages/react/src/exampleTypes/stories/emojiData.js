import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import MemoryTable from '../../MemoryTable'
import EmojiIcon from '../../stories/EmojiIcon'

// types
let number = { typeDefault: number }
let bool = { typeDefault: 'bool', display: x => (x ? 'Yes' : 'No') }
let codePoint = {
  typeDefault: 'text',
  display: F.whenExists(
    _.flow(
      _.split('-'),
      _.map(x => parseInt(x, 16)),
      _.spread(String.fromCodePoint)
    )
  ),
}

let schema = {
  image: {
    display: (x, record) => <EmojiIcon set="facebook" record={record} />,
  },
  name: { typeDefault: 'text' },
  unified: codePoint,
  non_qualified: codePoint,
  sheet_x: { typeDefault: 'number' },
  sheet_y: { typeDefault: 'number' },
  short_name: { typeDefault: 'facet' },
  short_names: { typeDefault: 'facet' },
  category: { typeDefault: 'facet' },
  sort_order: { typeDefault: 'number' },
  added_in: { typeDefault: 'facet' },
  has_img_apple: bool,
  has_img_google: bool,
  has_img_twitter: bool,
  has_img_facebook: bool,
  text: { typeDefault: 'facet' },
  texts: { typeDefault: 'facet' },
  obsoletes: codePoint,
  obsoleted_by: codePoint,
}
schema.skin_variations = {
  typeDefault: 'facet',
  display: x =>
    x && (
      <MemoryTable
        data={F.unkeyBy('skin_tone', x)}
        fields={{
          skin_tone: codePoint,
          ..._.pick(['image', 'unified'], schema),
        }}
      />
    ),
}

export default schema
