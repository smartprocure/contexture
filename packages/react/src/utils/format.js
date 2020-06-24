import _ from 'lodash/fp'

export let toNumber = (number, ...params) => {
  if (_.isNumber(number)) {
    let formatter = Intl.NumberFormat(params)
    return formatter.format(number)
  }
  return NaN
}
