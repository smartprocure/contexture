import _ from 'lodash/fp.js'
import moment from 'moment-timezone'
import { rollingRangeToDates } from 'contexture-util/dateUtil.js'

let dateMin = -8640000000000000
let dateMax = 8640000000000000

let dateTypeToFormatFn = {
  date: (x) => x && moment.utc(x).toDate(),
  unix: (x) => x && moment.utc(x).unix(),
  timestamp: (x) => x && new Date(x).getTime(),
}

let hasValue = ({ from, to, range }) =>
  range &&
  range !== 'allDates' &&
  ((range === 'exact' && (from || to)) || range !== 'exact')

export default {
  hasValue,
  // NOTE: timezone is only used for rolling dates
  filter({
    field,
    range,
    dateType = 'timestamp',
    timezone = 'UTC',
    ...context
  }) {
    let { from, to } =
      range === 'exact' ? context : rollingRangeToDates(range, timezone)

    let format = dateTypeToFormatFn[dateType]

    if (!from) {
      from = dateMin
    }
    if (!to) {
      to = dateMax
    }

    return _.flow(_.get(field), format, _.inRange(format(from), format(to)))
  },
}
