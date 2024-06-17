import _ from 'lodash/fp.js'
import F from 'futil'
import moment from 'moment-timezone'
import { rollingRangeToDates } from 'contexture-util/dateUtil.js'

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
  filter({ field, range, dateType = 'date', timezone = 'UTC', ...context }) {
    let { from, to } = _.includes(range, ['exact', 'allDates'])
      ? context
      : rollingRangeToDates(range, timezone)

    let format = dateTypeToFormatFn[dateType]

    return {
      [field]: F.compactObject({
        $gte: format(from),
        $lte: format(to),
      }),
    }
  },
}
