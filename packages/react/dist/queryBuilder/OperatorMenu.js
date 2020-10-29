"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _styles = _interopRequireDefault(require("../styles"));

var _search = require("../utils/search");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var btn = _styles["default"].btn,
    joinColor = _styles["default"].joinColor,
    bgJoin = _styles["default"].bgJoin;

var OperatorMenu = function OperatorMenu(_ref) {
  var node = _ref.node,
      hover = _ref.hover,
      tree = _ref.tree,
      parent = _ref.parent;
  return /*#__PURE__*/_react["default"].createElement("div", null, _fp["default"].map(function (join) {
    return node.join !== join && /*#__PURE__*/_react["default"].createElement("div", _extends({
      key: join
    }, _futil["default"].domLens.hover(function (x) {
      return _futil["default"].set(x && join, hover.join);
    }), {
      style: _objectSpread(_objectSpread({}, btn), bgJoin(join)),
      onClick: function onClick() {
        return tree.mutate(node.path, {
          join: join
        });
      }
    }), "To ", join.toUpperCase());
  }, ['and', 'or', 'not']), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", _extends({
    style: _objectSpread(_objectSpread({}, btn), {}, {
      color: joinColor((0, _search.oppositeJoin)(parent)),
      marginTop: 5
    })
  }, _futil["default"].domLens.hover(hover.wrap), {
    onClick: function onClick() {
      (0, _search.indent)(tree, parent, node);

      _futil["default"].off(hover.wrap)();
    }
  }), "Wrap in ", (0, _search.oppositeJoin)(parent).toUpperCase())), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", _extends({}, _futil["default"].domLens.hover(hover.remove), {
    style: _objectSpread(_objectSpread({}, btn), {}, {
      marginTop: 5
    }),
    onClick: function onClick() {
      return tree.remove(node.path);
    }
  }), "Remove")));
};

var _default = (0, _mobxReact.observer)(OperatorMenu);

exports["default"] = _default;
//# sourceMappingURL=OperatorMenu.js.map