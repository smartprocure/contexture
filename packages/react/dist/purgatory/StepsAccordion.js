"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.AccordionStep = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _mobxReact = require("mobx-react");

var _react = _interopRequireDefault(require("react"));

var _recompose = require("recompose");

var _greyVest = require("../greyVest");

var _theme = require("../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// Observes node, so we can activate the Continue button if it (or any child) has a value.
// We don't observe on Step because then it would rerender its children when `node`
// changes, which unfocuses query inputs as soon as the first character is entered.
var Buttons = _fp["default"].flow((0, _recompose.setDisplayName)('Buttons'), _mobxReact.observer, _theme.withTheme)(function (_ref) {
  var step = _ref.step,
      totalSteps = _ref.totalSteps,
      currentStep = _ref.currentStep,
      onSubmit = _ref.onSubmit,
      _ref$theme = _ref.theme,
      Button = _ref$theme.Button,
      Icon = _ref$theme.Icon;
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, step > 0 && /*#__PURE__*/_react["default"].createElement(Button, {
    onClick: _futil["default"].sets(step - 1, currentStep),
    className: "back-button"
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "PreviousPage"
  }), "Back"), step < totalSteps - 1 ? /*#__PURE__*/_react["default"].createElement(Button, {
    primary: true,
    onClick: _futil["default"].sets(step + 1, currentStep),
    disabled: false
  }, "Continue") : /*#__PURE__*/_react["default"].createElement(Button, {
    primary: true,
    onClick: onSubmit
  }, "View Results"));
});

var AccordionStep = _fp["default"].flow((0, _recompose.setDisplayName)('AccordionStep'), _theme.withTheme)(function (_ref2) {
  var style = _ref2.style,
      className = _ref2.className,
      step = _ref2.step,
      totalSteps = _ref2.totalSteps,
      currentStep = _ref2.currentStep,
      title = _ref2.title,
      _ref2$isRequired = _ref2.isRequired,
      isRequired = _ref2$isRequired === void 0 ? false : _ref2$isRequired,
      onSubmit = _ref2.onSubmit,
      children = _ref2.children,
      Icon = _ref2.theme.Icon;
  var open = _futil["default"].view(currentStep) === step;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "accordion-step ".concat(className || ''),
    style: style
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    alignItems: "center",
    justifyContent: "space-between",
    onClick: _futil["default"].sets(open ? -1 : step, currentStep),
    style: {
      cursor: 'pointer'
    }
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    alignItems: "center"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "accordion-step-title"
  }, _futil["default"].callOrReturn(title, step)), !isRequired && /*#__PURE__*/_react["default"].createElement("em", {
    style: {
      marginLeft: 6
    }
  }, "(Optional)")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "filter-field-label-icon"
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: open ? 'FilterListCollapse' : 'FilterListExpand'
  }))), open && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "step-contents"
  }, children), /*#__PURE__*/_react["default"].createElement(Buttons, {
    step: step,
    totalSteps: totalSteps,
    currentStep: currentStep,
    onSubmit: onSubmit
  })));
});

exports.AccordionStep = AccordionStep;

var StepsAccordion = function StepsAccordion(_ref3) {
  var _ref3$onSubmit = _ref3.onSubmit,
      onSubmit = _ref3$onSubmit === void 0 ? _fp["default"].noop : _ref3$onSubmit,
      children = _ref3.children,
      className = _ref3.className,
      props = _objectWithoutProperties(_ref3, ["onSubmit", "children", "className"]);

  var currentStep = _react["default"].useState(0);

  return /*#__PURE__*/_react["default"].createElement("div", _extends({
    className: "steps-accordion ".concat(className || '')
  }, props), _react["default"].Children.map(children, function (child, i) {
    return /*#__PURE__*/_react["default"].createElement(child.type, _extends({
      currentStep: currentStep,
      onSubmit: onSubmit
    }, {
      key: i,
      step: i,
      totalSteps: _fp["default"].size(children)
    }, child.props));
  }));
};

var _default = StepsAccordion;
exports["default"] = _default;
//# sourceMappingURL=StepsAccordion.js.map