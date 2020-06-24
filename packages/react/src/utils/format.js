export let toNumber = number => {
  let formatter = Intl.NumberFormat()
  return formatter.format(number)
}