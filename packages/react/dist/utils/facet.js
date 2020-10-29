"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FacetCheckboxList = exports.FacetOptionsFilter = exports.SelectAll = exports.Cardinality = exports.displayBlankFn = exports.displayFn = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _theme = require("../utils/theme");

var _format = require("../utils/format");

var _recompose = require("recompose");

var _mobxReact = require("mobx-react");

var _greyVest = require("../greyVest");

var _hoc = require("../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var commonStyle = {
  justifyContent: 'space-between',
  alignItems: 'center',
  display: 'flex',
  cursor: 'pointer'
};

var displayFn = function displayFn(name, label) {
  return _fp["default"].isString(label) ? label : name;
};

exports.displayFn = displayFn;

var displayBlankFn = function displayBlankFn() {
  return /*#__PURE__*/_react["default"].createElement("i", null, "Not Specified");
};

exports.displayBlankFn = displayBlankFn;

var Cardinality = _fp["default"].flow((0, _recompose.setDisplayName)('Cardinality'), _mobxReact.observer)(function (_ref) {
  var node = _ref.node,
      tree = _ref.tree;
  return _fp["default"].get('context.cardinality', node) ? /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    className: "contexture-facet-cardinality",
    justifyContent: "space-between"
  }, /*#__PURE__*/_react["default"].createElement("div", null, "Showing", ' ', (0, _format.toNumber)(_fp["default"].min([node.size || 10, _fp["default"].size(node.context.options)])), " of", ' ', (0, _format.toNumber)(node.context.cardinality)), node.context.cardinality > (node.size || 10) && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("a", {
    onClick: function onClick() {
      return tree.mutate(node.path, {
        size: (node.size || 10) + 10
      });
    },
    style: {
      cursor: 'pointer'
    }
  }, "View More"))) : null;
});

exports.Cardinality = Cardinality;

var SelectAll = _fp["default"].flow((0, _recompose.setDisplayName)('SelectAll'), _mobxReact.observer, _theme.withTheme)(function (_ref2) {
  var node = _ref2.node,
      tree = _ref2.tree,
      Checkbox = _ref2.theme.Checkbox;

  var missingOptions = _fp["default"].difference(_fp["default"].map('name', _fp["default"].get('context.options', node)), node.values);

  var allSelected = _fp["default"].isEmpty(missingOptions);

  return /*#__PURE__*/_react["default"].createElement("label", {
    style: commonStyle
  }, /*#__PURE__*/_react["default"].createElement(Checkbox, {
    checked: allSelected,
    onChange: function onChange() {
      if (allSelected) tree.mutate(node.path, {
        values: []
      });else tree.mutate(node.path, {
        values: node.values.concat(missingOptions)
      });
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: 2,
      padding: '0 5px'
    }
  }, "Select All Visible"));
});

exports.SelectAll = SelectAll;

var FacetOptionsFilter = _fp["default"].flow((0, _recompose.setDisplayName)('FacetOptionsFilter'), _mobxReact.observer, _theme.withTheme)(function (_ref3) {
  var tree = _ref3.tree,
      node = _ref3.node,
      _ref3$theme = _ref3.theme,
      TextInput = _ref3$theme.TextInput,
      Button = _ref3$theme.Button,
      ButtonGroup = _ref3$theme.ButtonGroup;

  var _useState = (0, _react.useState)(node.optionsFilter),
      _useState2 = _slicedToArray(_useState, 2),
      val = _useState2[0],
      setVal = _useState2[1];

  var buttonEnabled = val !== node.optionsFilter;

  var submit = function submit() {
    return buttonEnabled && tree.mutate(node.path, {
      optionsFilter: val
    });
  };

  return /*#__PURE__*/_react["default"].createElement(ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(TextInput, {
    value: val,
    onChange: function onChange(e) {
      setVal(e.target.value);
    },
    onKeyPress: function onKeyPress(e) {
      return e.key === 'Enter' && submit();
    },
    onBlur: submit,
    placeholder: "Search..."
  }), /*#__PURE__*/_react["default"].createElement(Button, {
    primary: node.optionsFilter !== val,
    onClick: submit
  }, "Find"));
});

exports.FacetOptionsFilter = FacetOptionsFilter;
var FacetCheckboxList = (0, _hoc.contexturifyWithoutLoader)(function (_ref4) {
  var tree = _ref4.tree,
      node = _ref4.node,
      hide = _ref4.hide,
      _ref4$display = _ref4.display,
      display = _ref4$display === void 0 ? displayFn : _ref4$display,
      _ref4$displayBlank = _ref4.displayBlank,
      displayBlank = _ref4$displayBlank === void 0 ? displayBlankFn : _ref4$displayBlank,
      formatCount = _ref4.formatCount,
      Checkbox = _ref4.theme.Checkbox;
  return _fp["default"].flow(_fp["default"].partition(function (x) {
    return _fp["default"].includes(x.name, node.values);
  }), _fp["default"].flatten, _fp["default"].map(function (_ref5) {
    var name = _ref5.name,
        label = _ref5.label,
        count = _ref5.count;
    var lens = tree.lens(node.path, 'values');
    return /*#__PURE__*/_react["default"].createElement("label", {
      key: name,
      style: commonStyle,
      title: "".concat(display(name, label), " : ").concat(formatCount(count))
    }, /*#__PURE__*/_react["default"].createElement(Checkbox, _futil["default"].domLens.checkboxValues(name, lens)), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        flex: 2,
        padding: '0 5px'
      }
    }, display(name, label) || displayBlank()), !hide.counts && /*#__PURE__*/_react["default"].createElement("div", null, formatCount(count)));
  }))(_fp["default"].get('context.options', node));
});
exports.FacetCheckboxList = FacetCheckboxList;
//# sourceMappingURL=facet.js.map