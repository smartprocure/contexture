// src/types/exists/provider-mongo.js
import _ from "lodash/fp.js";
var provider_mongo_default = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter: ({ field, value }) => value ? {
    $and: [
      { [field]: { $exists: value, $ne: "" } },
      { [field]: { $ne: null } }
    ]
  } : {
    $or: [
      { [field]: { $exists: false } },
      { [field]: "" },
      { [field]: null }
    ]
  }
};
export {
  provider_mongo_default as default
};
