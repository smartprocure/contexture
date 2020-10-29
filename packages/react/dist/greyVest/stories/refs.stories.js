"use strict";

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _ = require("..");

var _decorator = _interopRequireDefault(require("./decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var input;
var select;
var textArea;
(0, _react.storiesOf)('GreyVest Library|Refs', module).addDecorator(_decorator["default"]).add('story', function () {
  return /*#__PURE__*/_react2["default"].createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/_react2["default"].createElement(_.TextInput, {
    ref: function ref(e) {
      return input = e;
    }
  }), /*#__PURE__*/_react2["default"].createElement(_.Textarea, {
    ref: function ref(e) {
      return textArea = e;
    }
  }), /*#__PURE__*/_react2["default"].createElement(_.Select, {
    ref: function ref(e) {
      return select = e;
    }
  }), /*#__PURE__*/_react2["default"].createElement(_.Button, {
    onClick: function onClick() {
      return input.focus();
    }
  }, "Focus Input"), /*#__PURE__*/_react2["default"].createElement(_.Button, {
    onClick: function onClick() {
      return textArea.focus();
    }
  }, "Focus Text Area"), /*#__PURE__*/_react2["default"].createElement(_.Button, {
    onClick: function onClick() {
      return select.focus();
    }
  }, "Focus Select"));
});
//# sourceMappingURL=refs.stories.js.map