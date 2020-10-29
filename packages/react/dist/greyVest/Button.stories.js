"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.asDiv = exports.primaryDisabled = exports.primary = exports.active = exports.disabled = exports.basicUsage = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'GreyVest Library|Button',
  component: _.Button,
  decorators: [_decorator["default"]]
};
exports["default"] = _default;

var basicUsage = function basicUsage() {
  return /*#__PURE__*/_react["default"].createElement(_.Button, {
    onClick: function onClick() {
      return (0, _addonActions.action)('clicked')();
    }
  }, "Click");
};

exports.basicUsage = basicUsage;

var disabled = function disabled() {
  return /*#__PURE__*/_react["default"].createElement(_.Button, {
    disabled: true,
    onClick: function onClick() {
      return (0, _addonActions.action)('clicked')();
    }
  }, "Don't click");
};

exports.disabled = disabled;

var active = function active() {
  return /*#__PURE__*/_react["default"].createElement(_.Button, {
    isActive: true,
    onClick: function onClick() {
      return (0, _addonActions.action)('clicked')();
    }
  }, "Click");
};

exports.active = active;

var primary = function primary() {
  return /*#__PURE__*/_react["default"].createElement(_.Button, {
    primary: true,
    onClick: function onClick() {
      return (0, _addonActions.action)('clicked')();
    }
  }, "Click");
};

exports.primary = primary;

var primaryDisabled = function primaryDisabled() {
  return /*#__PURE__*/_react["default"].createElement(_.Button, {
    primary: true,
    disabled: true,
    onClick: function onClick() {
      return (0, _addonActions.action)('clicked')();
    }
  }, "Can't touch this");
};

exports.primaryDisabled = primaryDisabled;

var asDiv = function asDiv() {
  return /*#__PURE__*/_react["default"].createElement(_.Button, {
    as: "div",
    onClick: function onClick() {
      return (0, _addonActions.action)('clicked')();
    }
  }, "Click");
};

exports.asDiv = asDiv;
//# sourceMappingURL=Button.stories.js.map