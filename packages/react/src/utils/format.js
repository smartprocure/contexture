import _ from 'lodash/fp'
import React from 'react'

export let toNumber = (number, ...params) => {
  if (_.isNumber(number)) {
    let formatter = Intl.NumberFormat(params)
    return formatter.format(number)
  }
  return NaN
}

// replacing every character with `█`
// preserving spaces and `|` for terms key as `name|id`
let blank = _.memoize(_.replace(/[^ |]+/g, ({ length }) => '█'.repeat(length)))

let toBlankText = (display, data, record) => {
  // running display to detect output type
  let rendered = display(data, record)
  if (typeof rendered === 'object') {
    // rendered is React child
    // skipping if has nested children (buttons, etc)
    if (_.isArray(_.get('props.children', rendered))) return null
    // rendering again, but with blank data
    else return display(blank(data), record)
  } else {
    // rendered is string or number
    // making it blank
    return blank(rendered)
  }
}

export let blankResult = display => (data, record) => (
  <span style={{ opacity: 0.2, fontFamily: 'monospace' }}>
    {toBlankText(display, data, record)}
  </span>
)
