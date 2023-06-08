import React from 'react'
import _ from 'lodash/fp.js'
import F from 'futil'
import emojiDataSource from 'emoji-datasource'
import sheet from 'emoji-datasource/img/facebook/sheets/32.png'
import Component from './MemoryTable.js'

export default {
  component: Component,
  tags: ['autodocs'],
  args: {
    data: _.times((x) => ({ id: x, value: _.random(0, 20000) }), 221),
  },
}

export const Default = {
  args: {
    fields: { id: { label: '#' }, value: { label: 'Count' } },
  },
}

export const WithInfer = {
  args: {
    infer: true,
  },
}

export const ResultTableProps = {
  args: {
    fields: { id: { label: '#' }, value: { label: 'Count' } },
    pageSizeOptions: [12, 24, 48, 96],
  },
}

let bool = { typeDefault: 'bool', display: (x) => (x ? 'Yes' : 'No') }

let codePoint = {
  typeDefault: 'text',
  display: F.whenExists(
    _.flow(
      _.split('-'),
      _.map((x) => parseInt(x, 16)),
      _.spread(String.fromCodePoint)
    )
  ),
}

export const EmojiDataset = {
  args: {
    data: emojiDataSource,
    fields: {
      image: {
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
      skin_variations: { typeDefault: 'facet' },
    },
  },
}
