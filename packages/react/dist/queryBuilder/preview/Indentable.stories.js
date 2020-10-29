"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _Indentable = _interopRequireDefault(require("./Indentable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('Search Components|QueryBuilder/Internals/Indentable', module).add('and', function () {
  return /*#__PURE__*/_react["default"].createElement(_Indentable["default"], {
    indent: function indent() {
      return true;
    },
    node: {
      join: 'and'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: '100px'
    }
  }, "Contents"));
}).add('or', function () {
  return /*#__PURE__*/_react["default"].createElement(_Indentable["default"], {
    indent: function indent() {
      return true;
    },
    node: {
      join: 'or'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: '100px'
    }
  }, "Contents"));
}).add('not', function () {
  return /*#__PURE__*/_react["default"].createElement(_Indentable["default"], {
    indent: function indent() {
      return true;
    },
    node: {
      join: 'not'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      height: '100px'
    }
  }, "Contents"));
});
//# sourceMappingURL=Indentable.stories.js.map