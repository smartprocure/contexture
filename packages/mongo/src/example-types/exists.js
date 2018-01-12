module.exports = {
  hasValue: () => true,
  filter: context =>
    context.value
      ? {
          $and: [
            {
              [context.field]: {
                $exists: context.value,
                $ne: '',
              },
            },
            {
              [context.field]: {
                $ne: null,
              },
            },
          ],
        }
      : {
          $or: [
            {
              [context.field]: {
                $exists: false,
              },
            },
            {
              [context.field]: '',
            },
            {
              [context.field]: null,
            },
          ],
        },
}
