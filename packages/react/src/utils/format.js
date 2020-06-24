export let toNumber = (number, ...params) => {
  let formatter = Intl.NumberFormat(params)
  return formatter.format(number)
}
