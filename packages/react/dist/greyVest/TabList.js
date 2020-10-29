"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TabList = function TabList(_ref) {
  var value = _ref.value,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
      options = _ref.options;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "gv-tab-container"
  }, _fp["default"].map(function (x) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: x.value,
      className: "gv-tab ".concat(x.value === value ? 'active' : ''),
      onClick: function onClick() {
        return onChange(x.value, value);
      }
    }, x.label);
  }, options));
};

var _default = (0, _mobxReact.observer)(TabList);

exports["default"] = _default;
//# sourceMappingURL=TabList.js.map