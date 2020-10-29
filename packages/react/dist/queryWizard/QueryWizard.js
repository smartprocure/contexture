"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _recompose = require("recompose");

var _FilterButtonList = _interopRequireDefault(require("../FilterButtonList"));

var _purgatory = require("../purgatory");

var _hoc = require("../utils/hoc");

var _theme = require("../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var generateStepTitle = function generateStepTitle(node, title) {
  return function (i) {
    return /*#__PURE__*/_react["default"].createElement("h1", null, /*#__PURE__*/_react["default"].createElement("span", {
      className: "step-number"
    }, "Step ", i + 1, " - "), i === 0 ? "Search for ".concat(title || 'Results', " by...") : i < _fp["default"].size(node.children) - 1 ? "And..." : "Narrow Your Results");
  };
};

var QueryWizard = _fp["default"].flow((0, _recompose.setDisplayName)('QueryWizard'), _hoc.withNode, _theme.withTheme)(function (_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      _ref$fields = _ref.fields,
      fields = _ref$fields === void 0 ? {} : _ref$fields,
      title = _ref.title,
      _ref$onSubmit = _ref.onSubmit,
      onSubmit = _ref$onSubmit === void 0 ? _fp["default"].noop : _ref$onSubmit,
      _ref$mapNodeToProps = _ref.mapNodeToProps,
      mapNodeToProps = _ref$mapNodeToProps === void 0 ? _fp["default"].noop : _ref$mapNodeToProps,
      style = _ref.style;
  return /*#__PURE__*/_react["default"].createElement(_purgatory.StepsAccordion, {
    style: style,
    onSubmit: onSubmit
  }, _futil["default"].mapIndexed(function (child, i) {
    return /*#__PURE__*/_react["default"].createElement(_purgatory.AccordionStep, {
      key: i,
      isRequired: i === 0,
      title: generateStepTitle(node, title)
    }, /*#__PURE__*/_react["default"].createElement(_FilterButtonList["default"], _extends({
      node: child,
      tree: tree,
      fields: fields,
      mapNodeToProps: mapNodeToProps
    }, {
      key: node.key
    })));
  }, _fp["default"].get('children', node)));
});

var _default = QueryWizard;
exports["default"] = _default;
//# sourceMappingURL=QueryWizard.js.map