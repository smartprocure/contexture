module.exports = {
  hasValue: x => true,
  filter: context => context.data.value ? {
    $and: [{
      [context.field]: {
        $exists: context.data.value,
        $ne: ''
      }
    }, {
      [context.field]: {
        $ne: null
      }
    }]
  } : {
    $or: [{
      [context.field]: {
        $exists: false
      }
    }, {
      [context.field]: ''
    }, {
      [context.field]: null
    }]
  }
}
