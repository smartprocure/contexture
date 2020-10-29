"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('GreyVest Library|NestedPicker', module).addDecorator(_decorator["default"]).add('story', function () {
  return /*#__PURE__*/_react["default"].createElement(_.NestedPicker, {
    options: ['abcd', 'bcde', 'cdef'].map(function (x) {
      return {
        label: x,
        value: x
      };
    }),
    onChange: (0, _addonActions.action)("picked")
  });
});
//# sourceMappingURL=NestedPicker.stories.js.map