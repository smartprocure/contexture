import React from 'react'
import * as F from 'futil-js'

export default ({ pattern, text, Wrap = 'i' }) =>
  pattern
    ? F.highlight('<>', '<>', pattern, text)
        .split('<>')
        .map((x, i) => (i % 2 ? <Wrap key={i}>{x}</Wrap> : x))
    : text
