"use strict";

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _theme = require("../utils/theme");

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var makeStepTitle = function makeStepTitle(title) {
  return function (n) {
    return /*#__PURE__*/_react["default"].createElement("h1", null, /*#__PURE__*/_react["default"].createElement("span", {
      className: "step-number"
    }, n + 1, ") "), title);
  };
};

(0, _react2.storiesOf)('Search Components|Internals/StepsAccordion', module).addDecorator((0, _themePicker["default"])('greyVest')).add('Story', function () {
  var isClicked = _react["default"].useState(false);

  var theme = (0, _theme.useTheme)();
  return /*#__PURE__*/_react["default"].createElement(_.StepsAccordion, null, /*#__PURE__*/_react["default"].createElement(_.AccordionStep, {
    isRequired: true,
    title: makeStepTitle()
  }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", null, "A"), /*#__PURE__*/_react["default"].createElement("div", null, "B"), /*#__PURE__*/_react["default"].createElement("div", null, "C"))), /*#__PURE__*/_react["default"].createElement(_.AccordionStep, {
    isRequired: true,
    title: makeStepTitle('Click the button')
  }, /*#__PURE__*/_react["default"].createElement(theme.Button, {
    onClick: _futil["default"].on(isClicked)
  }, "Button ", _futil["default"].view(isClicked) && '(clicked)')), /*#__PURE__*/_react["default"].createElement(_.AccordionStep, {
    title: makeStepTitle('Type something')
  }, /*#__PURE__*/_react["default"].createElement(theme.TextInput, {
    type: "text"
  })));
});
//# sourceMappingURL=StepsAccordion.stories.js.map