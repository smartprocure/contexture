import React from 'react'
import F from 'futil'
import { observer } from 'mobx-react'

let Tag = ({ value, removeTag, tagStyle, onClick }) => (
  <div
    className="tags-input-tag"
    style={{ display: 'inline-block', ...F.callOrReturn(tagStyle, value) }}
    onClick={onClick}
  >
    {value}
    <span
      className="tags-input-tag-remove fa fa-times"
      onClick={() => removeTag(value)}
    />
  </div>
)

export default observer(Tag)
