import React from 'react'
import * as F from 'futil-js'

// Since start and end are the same token, splitting on it means every even element was a match
let TextHighlight = ({ pattern, text, Wrap = 'i' }) =>
  pattern
    ? F.highlight('<>', '<>', pattern, text)
        .split('<>')
        .map((x, i) => (i % 2 ? <Wrap key={i}>{x}</Wrap> : x))
    : text
export default TextHighlight
