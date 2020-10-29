"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.story = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'GreyVest Library|Box',
  decorators: [_decorator["default"]],
  component: _.Box,
  descriptionSlot: function descriptionSlot() {
    return 'box description';
  }
};
exports["default"] = _default;

var story = function story() {
  return /*#__PURE__*/_react["default"].createElement(_.Box, null, "Box Contents");
};

exports.story = story;
//# sourceMappingURL=Box.stories.js.map