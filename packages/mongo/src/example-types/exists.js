module.exports = {
  hasValue: () => true,
  filter: ({ field, value }) =>
    value
      ? {
          $and: [
            { [field]: { $exists: value, $ne: '' } },
            { [field]: { $ne: null } }
          ]
        }
      : {
          $or: [
            { [field]: { $exists: false } },
            { [field]: '' },
            { [field]: null }
          ]
        }
}
