"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _ = require(".");

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('Search Components|Internals/Checkbutton', module).addDecorator((0, _themePicker["default"])('greyVest')).add('Unchecked', function () {
  return /*#__PURE__*/_react["default"].createElement(_.CheckButton, null, "Your refrigerator is running");
}).add('Checked', function () {
  return /*#__PURE__*/_react["default"].createElement(_.CheckButton, {
    checked: true
  }, "Your refrigerator is running");
});
//# sourceMappingURL=CheckButton.stories.js.map