"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _schema = require("./utils/schema");

var _theme = require("./utils/theme");

var _themePicker = _interopRequireDefault(require("./stories/themePicker"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mockTree = {
  add: (0, _addonActions.action)('add'),
  // if falsey, withNode assumes an error
  getNode: function getNode() {
    return true;
  }
};
(0, _react2.storiesOf)('Search Components|FilterAdder', module).addDecorator((0, _themePicker["default"])('greyVest')).add('With ModalPicker', function () {
  return /*#__PURE__*/_react["default"].createElement(_.FilterAdder, {
    tree: mockTree,
    path: ['path'],
    fields: (0, _schema.applyDefaults)({
      directors: {
        typeDefault: 'facet'
      },
      runtimeMinutes: {
        typeDefault: 'number'
      }
    })
  });
}).add('With Select', function () {
  var theme = (0, _theme.useTheme)();
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_.FilterAdder, {
    Picker: theme.Select,
    tree: mockTree,
    path: ['path'],
    fields: (0, _schema.applyDefaults)({
      directors: {
        typeDefault: 'facet'
      },
      runtimeMinutes: {
        typeDefault: 'number'
      }
    })
  }), /*#__PURE__*/_react["default"].createElement("div", null, "Check action log to see adding being dispatched"));
}).add('With NestedPicker', function () {
  var theme = (0, _theme.useTheme)();
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_.FilterAdder, {
    Picker: theme.NestedPicker,
    tree: mockTree,
    path: ['path'],
    fields: (0, _schema.applyDefaults)({
      directors: {
        typeDefault: 'facet'
      },
      runtimeMinutes: {
        typeDefault: 'number'
      }
    })
  }), /*#__PURE__*/_react["default"].createElement("div", null, "Check action log to see adding being dispatched"));
});
//# sourceMappingURL=FilterAdder.stories.js.map