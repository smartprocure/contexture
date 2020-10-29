"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _Button = _interopRequireDefault(require("./Button"));

var _greyVest = require("../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ButtonRadio = function ButtonRadio(_ref) {
  var value = _ref.value,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
      options = _ref.options,
      _ref$style = _ref.style,
      style = _ref$style === void 0 ? {} : _ref$style;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    className: "gv-button-radio",
    style: {
      alignItems: 'baseline'
    }
  }, _fp["default"].map(function (x) {
    return /*#__PURE__*/_react["default"].createElement(_Button["default"], {
      key: x.value,
      isActive: x.value === value,
      onClick: function onClick() {
        return onChange(x.value);
      },
      style: style
    }, x.label);
  }, options));
};

var _default = ButtonRadio;
exports["default"] = _default;
//# sourceMappingURL=ButtonRadio.js.map