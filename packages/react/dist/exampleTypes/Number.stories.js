"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _testTree = _interopRequireDefault(require("./stories/testTree"));

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('ExampleTypes|Number', module).addDecorator((0, _themePicker["default"])('greyVest')).add('Number', function () {
  return /*#__PURE__*/_react["default"].createElement(_.Number, {
    tree: (0, _testTree["default"])(),
    path: ['number']
  });
});
//# sourceMappingURL=Number.stories.js.map