import React from 'react'

let getSheet = set => require(`emoji-datasource/img/${set}/sheets/32.png`)

let EmojiIcon = ({ set = 'twitter', record: { sheet_x, sheet_y } }) => (
  <div
    style={{
      backgroundImage: `url(${getSheet(set)})`,
      backgroundPosition: `-${sheet_x * 34}px -${sheet_y * 34}px`,
      width: 33,
      height: 33,
      transform: 'scale(0.75)',
    }}
  />
)
export default EmojiIcon
