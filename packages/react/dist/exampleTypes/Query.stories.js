"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _testTree = _interopRequireDefault(require("./stories/testTree"));

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('ExampleTypes|Query', module).addDecorator((0, _themePicker["default"])('greyVest')).add('Query', function () {
  return /*#__PURE__*/_react["default"].createElement(_.Query, {
    tree: (0, _testTree["default"])(),
    path: ['query']
  });
});
//# sourceMappingURL=Query.stories.js.map