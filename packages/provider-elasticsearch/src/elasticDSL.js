module.exports = {
  negate: filter => ({ bool: { must_not: filter } })
}