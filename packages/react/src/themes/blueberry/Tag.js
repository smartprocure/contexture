import React from 'react'
import F from 'futil-js'
import { observer } from 'mobx-react'

let Tag = ({ value, removeTag, tagStyle, onClick }) => (
  <div
    className="tags-input-tag"
    style={F.callOrReturn(tagStyle, value)}
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
