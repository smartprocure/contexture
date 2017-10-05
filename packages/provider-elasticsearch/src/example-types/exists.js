module.exports = {
  hasValue: () => true,
  filter: context => {
    let result = {
      exists: {
        field: context.field
      }
    }

    if (!context.data.value) {
      result = {
        bool: {
          must_not: result
        }
      }
    }

    return result
  }
}
