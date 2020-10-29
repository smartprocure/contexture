"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.customTabListAndTabPanel = exports.controlled = exports.uncontrolledWithDefaultValue = exports.tabRenderFunction = exports.tabLabelAndTabContent = exports.anonymousValues = exports.baseUsage = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

var _tabs = _interopRequireDefault(require("./docs/tabs.mdx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = (0, _mobx.observable)({
  tab: 'results'
});
var _default = {
  title: 'GreyVest Library|Tabs',
  component: _.Tabs,
  parameters: {
    docs: {
      page: _tabs["default"]
    }
  },
  decorators: [_decorator["default"]]
};
exports["default"] = _default;

var baseUsage = function baseUsage() {
  return /*#__PURE__*/_react["default"].createElement(_.Tabs, null, /*#__PURE__*/_react["default"].createElement(_.Tab, {
    label: "Tab One"
  }, "Tab One Contents"), /*#__PURE__*/_react["default"].createElement(_.Tab, {
    label: "Tab Two"
  }, "Tab Two Contents"));
};

exports.baseUsage = baseUsage;

var anonymousValues = function anonymousValues() {
  return /*#__PURE__*/_react["default"].createElement(_.Tabs, {
    defaultValue: 0
  }, /*#__PURE__*/_react["default"].createElement(_.Tab, {
    label: "First Tab"
  }, "First Tab Contents"), /*#__PURE__*/_react["default"].createElement(_.Tab, {
    label: "Second Tab"
  }, "Second Tab Contents"));
};

exports.anonymousValues = anonymousValues;

var tabLabelAndTabContent = function tabLabelAndTabContent() {
  return /*#__PURE__*/_react["default"].createElement(_.Tabs, null, /*#__PURE__*/_react["default"].createElement(_.TabLabel, {
    value: "results"
  }, "Results"), /*#__PURE__*/_react["default"].createElement(_.TabContent, {
    value: "results"
  }, "Results Tables"), /*#__PURE__*/_react["default"].createElement(_.Tab, {
    value: "analytics",
    label: "Analytics"
  }, "Charts and Stuff"));
};

exports.tabLabelAndTabContent = tabLabelAndTabContent;
tabLabelAndTabContent.story = {
  name: 'TabLabel and TabContent'
};

var tabRenderFunction = function tabRenderFunction() {
  return /*#__PURE__*/_react["default"].createElement(_.Tabs, null, /*#__PURE__*/_react["default"].createElement(_.Tab, {
    label: "Analytics"
  }, "Charts and Stuff"), /*#__PURE__*/_react["default"].createElement(_.Tab, {
    label: "Analytics2",
    value: "tab 2"
  }, function (tab) {
    return "Current tab is ".concat(tab);
  }));
};

exports.tabRenderFunction = tabRenderFunction;

var uncontrolledWithDefaultValue = function uncontrolledWithDefaultValue() {
  return /*#__PURE__*/_react["default"].createElement(_.Tabs, {
    defaultValue: "analytics"
  }, /*#__PURE__*/_react["default"].createElement(_.Tab, {
    value: "results",
    label: "Results"
  }, "Results Tables"), /*#__PURE__*/_react["default"].createElement(_.Tab, {
    value: "analytics",
    label: "Analytics"
  }, "Charts and Stuff"));
};

exports.uncontrolledWithDefaultValue = uncontrolledWithDefaultValue;
uncontrolledWithDefaultValue.story = {
  name: 'Uncontrolled with defaultValue'
};

var controlled = function controlled() {
  return /*#__PURE__*/_react["default"].createElement(_mobxReact.Observer, null, function () {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_.Button, {
      onClick: function onClick() {
        return state.tab = 'analytics';
      }
    }, "Change from ", state.tab, " to analytics"), /*#__PURE__*/_react["default"].createElement(_.Tabs, {
      onChange: function onChange(x, y) {
        state.tab = x;
        (0, _addonActions.action)('change tab')(x, y);
      },
      value: state.tab
    }, /*#__PURE__*/_react["default"].createElement(_.Tab, {
      value: "results",
      label: "Results"
    }, "Results Tables"), /*#__PURE__*/_react["default"].createElement(_.Tab, {
      value: "analytics",
      label: "Analytics"
    }, "Charts and Stuff")));
  });
};

exports.controlled = controlled;

var customTabListAndTabPanel = function customTabListAndTabPanel() {
  return /*#__PURE__*/_react["default"].createElement(_.Tabs, {
    TabsList: _.ButtonRadio,
    TabPanel: _react["default"].Fragment
  }, /*#__PURE__*/_react["default"].createElement(_.Tab, {
    value: "results",
    label: "Results"
  }, "Results Tables"), /*#__PURE__*/_react["default"].createElement(_.Tab, {
    value: "analytics",
    label: "Analytics"
  }, "Charts and Stuff"));
};

exports.customTabListAndTabPanel = customTabListAndTabPanel;
customTabListAndTabPanel.story = {
  name: 'Custom TabList and TabPanel'
};
//# sourceMappingURL=Tabs.stories.js.map