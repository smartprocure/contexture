// src/types/bool/provider-mongo.js
import _ from "lodash/fp.js";
var provider_mongo_default = {
  hasValue: ({ value }) => _.isBoolean(value),
  filter: ({ field, value }) => ({
    [field]: value || { $ne: true }
  })
};
export {
  provider_mongo_default as default
};
