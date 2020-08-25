module.exports = {
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/number.html#number
  elasticsearchIntegerMax: 2 ** 31 - 1,
  negate: filter => ({ bool: { must_not: filter } }),
  buildFilter: ({ type, field, ...rest }) => ({ [type]: { [field]: rest } }),
}
