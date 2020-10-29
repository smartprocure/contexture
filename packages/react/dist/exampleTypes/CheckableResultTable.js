"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _recompose = require("recompose");

var _mobxReact = require("mobx-react");

var _schema = require("../utils/schema");

var _hoc = require("../utils/hoc");

var _theme = require("../utils/theme");

var _ResultTable = require("./ResultTable");

var _utils = require("./utils");

var _react2 = require("../utils/react");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Label = _fp["default"].flow((0, _recompose.setDisplayName)('Label'), _mobxReact.observer, _theme.withTheme)(function (_ref) {
  var node = _ref.node,
      selected = _ref.selected,
      getValue = _ref.getValue,
      Checkbox = _ref.theme.Checkbox;

  var results = _fp["default"].toArray((0, _schema.getResults)(node));

  var allChecked = _fp["default"].size(results) === _fp["default"].size(_futil["default"].view(selected));

  var checkAll = _futil["default"].sets(allChecked ? [] : _fp["default"].map(_fp["default"].flow(_schema.getRecord, _fp["default"].iteratee(getValue)), results), selected);

  return /*#__PURE__*/_react["default"].createElement(Checkbox, {
    checked: allChecked,
    onChange: checkAll
  });
}); // Extends ResultTable with a checkbox column
// Writes to a lens called `selected`, using getValue to map the selected record to a value.
// getValues uses _.iteratee, so it defaults to identity and supports things like strings to get props


var CheckableResultTable = function CheckableResultTable(_ref2) {
  var node = _ref2.node,
      fields = _ref2.fields,
      selectedValues = _ref2.selectedValues,
      onChange = _ref2.onChange,
      getValue = _ref2.getValue,
      Checkbox = _ref2.theme.Checkbox,
      props = _objectWithoutProperties(_ref2, ["node", "fields", "selectedValues", "onChange", "getValue", "theme"]);

  return /*#__PURE__*/_react["default"].createElement(_ResultTable.PagedResultTable, _extends({
    fields: _objectSpread({
      _checkbox: {
        hideMenu: true,
        label: function label() {
          return /*#__PURE__*/_react["default"].createElement(Label, {
            node: node,
            selected: [selectedValues, onChange],
            getValue: getValue
          });
        },
        display: function display(x, y) {
          return /*#__PURE__*/_react["default"].createElement(Checkbox, _futil["default"].domLens.checkboxValues(_fp["default"].iteratee(getValue)(y), [selectedValues, onChange]));
        }
      }
    }, fields)
  }, props));
};

var _default = _fp["default"].flow((0, _react2.expandProp)('selected', _utils.selectedBinding), _hoc.contexturify)(CheckableResultTable);

exports["default"] = _default;
//# sourceMappingURL=CheckableResultTable.js.map