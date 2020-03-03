import React from 'react'
import _ from 'lodash/fp'
import F from 'futil'
import MemoryTable from '../../MemoryTable'
import EmojiIcon from '../../stories/EmojiIcon'

let typeDefaults = {
  name: 'text',
  unified: 'text',
  non_qualified: 'text',
  docomo: null,
  au: 'text',
  softbank: 'text',
  google: 'text',
  image: 'text',
  sheet_x: 'number',
  sheet_y: 'number',
  short_name: 'text',
  short_names: 'text',
  text: null,
  texts: null,
  category: 'facet',
  sort_order: 'number',
  added_in: 'facet',
  has_img_apple: 'bool',
  has_img_google: 'bool',
  has_img_twitter: 'bool',
  has_img_facebook: 'bool',
  skin_variations: 'facet',
  obsoletes: 'facet',
  obsoleted_by: 'facet',
}

let overrides = {
  skin_variations: {
    display: x => x && <MemoryTable infer data={F.unkeyBy('foo', x)} />,
  },
  image: {
    order: 1,
    display: (x, record) => <EmojiIcon set="facebook" record={record} />,
  },
}

let schema = _.flow(
  _.mapValues(typeDefault => ({ typeDefault })),
  _.merge(overrides)
)(typeDefaults)

export default schema
