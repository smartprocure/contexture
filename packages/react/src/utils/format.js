import _ from 'lodash/fp.js'
import React from 'react'

export let toNumber = (number, ...params) => {
  if (_.isNumber(number)) {
    let formatter = Intl.NumberFormat(params)
    return formatter.format(number)
  }
  return NaN
}

export let addBlankRows = (rows, pageSize, key) => {
  if (rows.length === 0) return rows
  let blankRows = [...Array(pageSize - rows.length)].map((_, i) => ({
    ...rows[i % rows.length],
    // unique deterministic IDs
    [key]: `${rows[i % rows.length][key]}${i}`,
    isBlank: true,
  }))
  return [...rows, ...blankRows]
}

// replacing every character with `█`
// preserving spaces and `|` for fields with data concatenation
let blank = _.memoize(_.replace(/[^ |]/gi, '█'))

let toBlankText = (display, data, record, props) => {
  // running display to detect output type
  let rendered = display(data, record, props)
  if (typeof rendered === 'object') {
    // rendered is React child
    try {
      // rendering again, but with blank data
      return display(blank(data), record, props)
    } catch {
      // fall back to plain text if blank data broke React component
      return blank(_.toString(data).slice(40))
    }
  } else {
    // rendered is string or number
    // making it blank
    return blank(rendered)
  }
}

export let blankResult = (display) => (data, record, props) =>
  (
    <span
      style={{
        fontFamily: 'monospace',
        display: 'inline-block',
        opacity: 0.2,
      }}
    >
      {toBlankText(display, data, record, props)}
    </span>
  )
