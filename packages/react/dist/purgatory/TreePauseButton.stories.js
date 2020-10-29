"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _addonActions = require("@storybook/addon-actions");

var _mobx = require("mobx");

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _ = require(".");

var _2 = require("..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var pauseWith = (0, _addonActions.action)('set paused');
var state = (0, _mobx.observable)({
  paused: true
});
var tree = {
  pauseNested: function pauseNested() {
    pauseWith(state.paused = true);
  },
  unpauseNested: function unpauseNested() {
    pauseWith(state.paused = false);
  },
  isPausedNested: function isPausedNested() {
    return state.paused;
  }
};
(0, _react2.storiesOf)('Search Components|Internals/TreePauseButton', module).addDecorator((0, _themePicker["default"])('greyVest')).add('One Tree', function () {
  return /*#__PURE__*/_react["default"].createElement(_.TreePauseButton, null, /*#__PURE__*/_react["default"].createElement(_2.SearchTree, {
    tree: tree,
    path: ['root']
  }));
}).add('Multiple Trees', function () {
  return /*#__PURE__*/_react["default"].createElement(_.TreePauseButton, null, /*#__PURE__*/_react["default"].createElement(_2.SearchTree, {
    tree: tree,
    path: ['root']
  }), /*#__PURE__*/_react["default"].createElement(_2.SearchTree, {
    tree: tree,
    path: ['root']
  }));
}).add('Falsey Trees', function () {
  return /*#__PURE__*/_react["default"].createElement(_.TreePauseButton, null, /*#__PURE__*/_react["default"].createElement(_2.SearchTree, {
    tree: tree,
    path: ['root']
  }), false && /*#__PURE__*/_react["default"].createElement(_2.SearchTree, {
    tree: tree,
    path: ['root']
  }));
});
//# sourceMappingURL=TreePauseButton.stories.js.map