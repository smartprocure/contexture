"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checked = exports.unchecked = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'GreyVest Library|Checkbox',
  decorators: [_decorator["default"]],
  component: _.Checkbox,
  parameters: {
    componentSubtitle: 'Handy status label',
    notes: 'test'
  }
};
exports["default"] = _default;

var unchecked = function unchecked() {
  return /*#__PURE__*/_react["default"].createElement(_.Checkbox, null);
};

exports.unchecked = unchecked;

var checked = function checked() {
  return /*#__PURE__*/_react["default"].createElement(_.Checkbox, {
    checked: true
  });
};

exports.checked = checked;
//# sourceMappingURL=Checkbox.stories.js.map