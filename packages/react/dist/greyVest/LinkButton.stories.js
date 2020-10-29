"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.story = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var click = (0, _addonActions.action)('clicked');
var _default = {
  title: 'GreyVest Library|LinkButton',
  component: _.LinkButton,
  decorators: [_decorator["default"]]
};
exports["default"] = _default;

var story = function story() {
  return /*#__PURE__*/_react["default"].createElement(_.LinkButton, {
    onClick: function onClick() {
      return click();
    }
  }, "Click");
};

exports.story = story;
//# sourceMappingURL=LinkButton.stories.js.map