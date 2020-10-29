"use strict";

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _react2 = require("@storybook/react");

var _mobxReact = require("mobx-react");

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var lipsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
var HighlightDemo = (0, _mobxReact.observer)(function () {
  var filter = _react["default"].useState('');

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("input", _futil["default"].domLens.value(filter))), /*#__PURE__*/_react["default"].createElement(_.TextHighlight, {
    text: lipsum,
    pattern: _futil["default"].view(filter)
  }));
});
(0, _react2.storiesOf)('GreyVest Library|TextHighlight', module).addDecorator(_decorator["default"]).add('story', function () {
  return /*#__PURE__*/_react["default"].createElement(HighlightDemo, null);
});
//# sourceMappingURL=TextHighlight.stories.js.map