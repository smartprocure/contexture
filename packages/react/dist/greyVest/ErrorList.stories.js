"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.block = exports.text = exports.formDemo = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'GreyVest Library|ErrorList',
  decorators: [_decorator["default"]],
  component: _.ErrorList
};
exports["default"] = _default;

var formDemo = function formDemo() {
  return /*#__PURE__*/_react["default"].createElement(_.Box, null, /*#__PURE__*/_react["default"].createElement("h1", {
    style: {
      margin: '15px 0'
    }
  }, "Header"), /*#__PURE__*/_react["default"].createElement(_.ErrorList, {
    block: true
  }, "Block error"), /*#__PURE__*/_react["default"].createElement(_.Flex, {
    column: true,
    style: {
      marginBottom: 25
    }
  }, /*#__PURE__*/_react["default"].createElement(_.Flex, {
    as: "label",
    column: true,
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "filter-field-label",
    style: {
      marginBottom: 14
    }
  }, "Label"), /*#__PURE__*/_react["default"].createElement(_.TextInput, {
    style: {
      borderColor: '#D75050'
    }
  })), /*#__PURE__*/_react["default"].createElement(_.ErrorList, null, "Text error")));
};

exports.formDemo = formDemo;

var text = function text() {
  return /*#__PURE__*/_react["default"].createElement(_.ErrorList, null, "I am an error");
};

exports.text = text;

var block = function block() {
  return /*#__PURE__*/_react["default"].createElement(_.ErrorList, {
    block: true
  }, ['Error 1', 'Error 2', ['Error 3A', 'Error 3B']]);
};

exports.block = block;
//# sourceMappingURL=ErrorList.stories.js.map