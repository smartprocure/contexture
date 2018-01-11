module.exports = {
  hasValue: () => true,
  filter: context => ({
    term: {
      [context.field]: context.value,
    },
  }),
}
