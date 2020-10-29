"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _hoc = require("../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getValue = function getValue(value) {
  return _fp["default"].isNil(value) ? null : !!value;
};

var BooleanType = function BooleanType(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      _ref$display = _ref.display,
      display = _ref$display === void 0 ? function (value) {
    return _fp["default"].isNil(value) ? 'Either' : value ? 'Yes' : 'No';
  } : _ref$display,
      _ref$className = _ref.className,
      className = _ref$className === void 0 ? 'contexture-bool' : _ref$className,
      RadioList = _ref.theme.RadioList;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: className
  }, /*#__PURE__*/_react["default"].createElement(RadioList, {
    value: getValue(node.value),
    onChange: function onChange(value) {
      tree.mutate(node.path, {
        value: getValue(value)
      });
    },
    options: [{
      label: display(true),
      value: true
    }, {
      label: display(false),
      value: false
    }, {
      label: display(null),
      value: null
    }]
  }));
};

var _default = (0, _hoc.contexturify)(BooleanType);

exports["default"] = _default;
//# sourceMappingURL=BooleanType.js.map