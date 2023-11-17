// src/util/client.js
import _ from "lodash/fp.js";
var validateValueExistence = _.flow(_.get("value"), _.negate(_.isNil));

export {
  validateValueExistence
};
