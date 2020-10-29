"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

var _theme = require("../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var setPausedNested = function setPausedNested(tree, path, value) {
  return tree["".concat(value ? '' : 'un', "pauseNested")](path);
};

var TreePauseButton = function TreePauseButton(_ref) {
  var children = _ref.children,
      AlternateButton = _ref.theme.AlternateButton,
      _ref$Component = _ref.Component,
      Component = _ref$Component === void 0 ? AlternateButton : _ref$Component;

  var trees = _fp["default"].flow(_react["default"].Children.toArray, _fp["default"].map('props'))(children);

  var allPaused = _fp["default"].every(function (_ref2) {
    var tree = _ref2.tree,
        path = _ref2.path;
    return tree.isPausedNested(path);
  }, trees);

  var flip = function flip() {
    return _fp["default"].each(function (_ref3) {
      var tree = _ref3.tree,
          path = _ref3.path;
      return setPausedNested(tree, path, !allPaused);
    }, trees);
  };

  return /*#__PURE__*/_react["default"].createElement(Component, {
    onClick: flip
  }, "".concat(allPaused ? 'Expand' : 'Collapse', " Filters"));
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(TreePauseButton);

exports["default"] = _default;
//# sourceMappingURL=TreePauseButton.js.map