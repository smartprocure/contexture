let moment = require('moment-timezone')
let datemath = require('@elastic/datemath')

let parseAndShift = (exp, timezone) => {
  let computed = datemath.parse(exp)
  // Replace the server timezone with the user's timezone if the expression
  // is relative to the start of a day, month, year, etc.
  return /\//.test(exp) ? moment(computed).tz(timezone, true) : computed
}

module.exports = {
  parseAndShift
}