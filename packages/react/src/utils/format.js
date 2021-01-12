import _ from 'lodash/fp'
import React from 'react'

export let toNumber = (number, ...params) => {
  if (_.isNumber(number)) {
    let formatter = Intl.NumberFormat(params)
    return formatter.format(number)
  }
  return NaN
}

let blank = _.memoize(
  text =>
    // replacing every character with `█`
    // preserving spaces and `|` for terms key as `name|id`
    text &&
    text.toString().replace(/[^ |]+/g, ({ length }) => '█'.repeat(length))
)

let toBlankText = (display, data, record) => {
  let formatted = display(data, record)
  if (typeof formatted === 'object') {
    if (_.isArray(_.get('props.children', formatted))) return null
    else return display(blank(data), record)
  } else {
    return blank(formatted)
  }
}

export let blankResult = display => (data, record) => (
  <span style={{ opacity: 0.2, fontFamily: 'monospace' }}>
    {toBlankText(display, data, record)}
  </span>
)
