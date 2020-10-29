"use strict";

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react2 = require("@storybook/react");

var _testTree = _interopRequireDefault(require("./stories/testTree"));

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _2 = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('ExampleTypes|Bool', module).addDecorator((0, _themePicker["default"])('greyVest')).add('Bool', function () {
  return /*#__PURE__*/_react["default"].createElement(_2.Bool, {
    tree: (0, _testTree["default"])(),
    path: ['bool']
  });
}).add('Bool Custom Options', function () {
  return /*#__PURE__*/_react["default"].createElement(_2.Bool, {
    tree: (0, _testTree["default"])(),
    path: ['bool'],
    display: function display(value) {
      return _fp["default"].isNil(value) ? 'Both' : value ? 'Agree' : 'Disagree';
    }
  });
});
//# sourceMappingURL=Bool.stories.js.map