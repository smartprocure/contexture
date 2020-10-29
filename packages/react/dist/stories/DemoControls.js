"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.ClampedHTML = exports.DarkBox = exports.PagerItem = exports.DropdownItem = exports.Highlight = exports.NumberInput = exports.TextInput = exports.Button = void 0;

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _recompose = require("recompose");

var _ = require("..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Button = function Button(x) {
  return /*#__PURE__*/_react["default"].createElement("button", _extends({
    style: {
      width: '100%',
      padding: '5px',
      margin: '5px 0',
      borderRadius: '5px'
    }
  }, x));
};

exports.Button = Button;
var Input = (0, _mobxReact.observer)(function (props) {
  var focusing = _react["default"].useState(false);

  return /*#__PURE__*/_react["default"].createElement("input", _extends({
    style: {
      width: '100%',
      padding: '5px',
      textIndent: '5px',
      border: 'solid 1px #efefef',
      borderRadius: '30px',
      boxSizing: 'border-box',
      outline: 'none',
      margin: '0 auto',
      display: 'block',
      transition: 'background 0.3s',
      background: "rgba(255, 255, 255, ".concat(_futil["default"].view(focusing) ? 1 : 0.7, ")")
    }
  }, _futil["default"].domLens.focus(focusing), props));
});
var TextInput = (0, _recompose.defaultProps)({
  type: 'text'
})(Input);
exports.TextInput = TextInput;
var NumberInput = (0, _recompose.defaultProps)({
  type: 'number'
})(Input);
exports.NumberInput = NumberInput;

var Highlight = function Highlight(x) {
  return /*#__PURE__*/_react["default"].createElement(_.TextHighlight, _extends({
    Wrap: function Wrap(x) {
      return /*#__PURE__*/_react["default"].createElement("b", _extends({
        style: {
          backgroundColor: 'yellow'
        }
      }, x));
    }
  }, x));
};

exports.Highlight = Highlight;
var DropdownItem = (0, _mobxReact.observer)(function (props) {
  var hovering = _react["default"].useState(false);

  return /*#__PURE__*/_react["default"].createElement("div", _extends({
    style: _objectSpread({
      cursor: 'pointer',
      padding: '10px 15px',
      borderRadius: '4px'
    }, _futil["default"].view(hovering) && {
      backgroundColor: '#f5f5f5'
    })
  }, _futil["default"].domLens.hover(hovering), props));
});
exports.DropdownItem = DropdownItem;
var PagerItem = (0, _mobxReact.observer)(function (_ref) {
  var active = _ref.active,
      props = _objectWithoutProperties(_ref, ["active"]);

  var hovering = _react["default"].useState(false);

  return /*#__PURE__*/_react["default"].createElement("span", _extends({
    style: _objectSpread(_objectSpread({
      padding: '5px',
      border: 'solid 1px #ccc',
      background: _futil["default"].view(hovering) ? '#f5f5f5' : 'white',
      color: '#444'
    }, active && {
      fontWeight: 'bold'
    }), {}, {
      cursor: 'pointer'
    })
  }, _futil["default"].domLens.hover(hovering), props));
});
exports.PagerItem = PagerItem;

var DarkBox = function DarkBox(props) {
  return /*#__PURE__*/_react["default"].createElement("div", _extends({}, props, {
    style: {
      backgroundColor: '#333',
      color: '#AAA',
      padding: '20px',
      borderRadius: '10px'
    }
  }));
};

exports.DarkBox = DarkBox;
var textTruncate = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  // WebkitLineClamp: '4',
  // WebkitBoxOrient: 'vertical',
  maxHeight: '100px'
};

var ClampedHTML = function ClampedHTML(x) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: textTruncate,
    dangerouslySetInnerHTML: {
      __html: x
    }
  });
};

exports.ClampedHTML = ClampedHTML;
var _default = {
  Button: Button,
  TextInput: TextInput,
  NumberInput: NumberInput,
  TextHighlight: Highlight,
  DropdownItem: DropdownItem,
  PagerItem: PagerItem
};
exports["default"] = _default;
//# sourceMappingURL=DemoControls.js.map