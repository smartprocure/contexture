"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _DDContext = _interopRequireDefault(require("./DragDrop/DDContext"));

var _Group = _interopRequireDefault(require("./Group"));

var _styles = _interopRequireDefault(require("../styles"));

var _hoc = require("../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var background = _styles["default"].background;

var QueryBuilder = function QueryBuilder(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      fields = _ref.fields,
      mapNodeToProps = _ref.mapNodeToProps,
      Button = _ref.theme.Button;

  var adding = _react["default"].useState(false);

  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      background: background
    }
  }, node && /*#__PURE__*/_react["default"].createElement(_Group["default"], _extends({
    isRoot: true
  }, {
    node: node,
    tree: tree,
    adding: adding,
    fields: fields,
    mapNodeToProps: mapNodeToProps
  })), /*#__PURE__*/_react["default"].createElement(Button, {
    onClick: _futil["default"].flip(adding)
  }, _futil["default"].view(adding) ? 'Cancel' : 'Add Filter'));
};

var _default = (0, _DDContext["default"])((0, _hoc.contexturifyWithoutLoader)(QueryBuilder), {
  allowEmptyNode: true
});

exports["default"] = _default;
//# sourceMappingURL=QueryBuilder.js.map