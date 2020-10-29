"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _ExpandableTable = require("../greyVest/ExpandableTable");

var _hoc = require("../utils/hoc");

var _TermsStatsTable = _interopRequireDefault(require("./TermsStatsTable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var CheckableTermsStatsTable = function CheckableTermsStatsTable(_ref) {
  var node = _ref.node,
      children = _ref.children,
      getValue = _ref.getValue,
      selected = _ref.selected,
      Checkbox = _ref.theme.Checkbox,
      props = _objectWithoutProperties(_ref, ["node", "children", "getValue", "selected", "theme"]);

  var results = _fp["default"].result('context.terms.slice', node);

  var allChecked = _fp["default"].size(results) === _fp["default"].size(_futil["default"].view(selected));

  var checkAll = _futil["default"].sets(allChecked ? [] : _fp["default"].map(_fp["default"].iteratee(getValue), results), selected);

  return /*#__PURE__*/_react["default"].createElement(_TermsStatsTable["default"], _objectSpread(_objectSpread({}, props), {}, {
    children: [/*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      label: /*#__PURE__*/_react["default"].createElement(Checkbox, {
        checked: allChecked,
        onChange: checkAll
      }),
      display: function display(x, y) {
        return /*#__PURE__*/_react["default"].createElement(Checkbox, _futil["default"].domLens.checkboxValues(_fp["default"].iteratee(getValue)(y), selected));
      }
    })].concat(_toConsumableArray(children))
  }));
};

var _default = (0, _hoc.contexturify)(CheckableTermsStatsTable);

exports["default"] = _default;
//# sourceMappingURL=CheckableTermsStatsTable.js.map