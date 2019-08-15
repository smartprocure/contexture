import React from 'react'
import * as F from 'futil-js'
import { withTheme } from '../utils/theme'

// Since start and end are the same token, splitting on it means every even element was a match
let TextHighlight = ({ pattern, text, theme: { HighlightWrap }, style }) =>
  pattern
    ? F.highlight('<>', '<>', pattern, text)
        .split('<>')
        .map((x, i) => (i % 2 ? <HighlightWrap key={i} style={style}>{x}</HighlightWrap> : x))
    : text
TextHighlight.displayName = 'TextHighlight'

export default withTheme(TextHighlight)
