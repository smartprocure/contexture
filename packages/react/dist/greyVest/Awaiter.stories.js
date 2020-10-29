"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.story = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxUtils = require("mobx-utils");

var _ = require(".");

var _decorator = _interopRequireDefault(require("./stories/decorator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'GreyVest Library|Awaiter',
  decorators: [_decorator["default"]],
  component: _.Awaiter
};
exports["default"] = _default;

var story = function story() {
  var resolve;
  var reject;
  var p = (0, _mobxUtils.fromPromise)(new Promise(function (_resolve, _reject) {
    resolve = _resolve;
    reject = _reject;
  }));
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_.Box, null, /*#__PURE__*/_react["default"].createElement(_.Awaiter, {
    promise: p
  }, function (x) {
    return /*#__PURE__*/_react["default"].createElement("div", null, x);
  })), /*#__PURE__*/_react["default"].createElement(_.Button, {
    onClick: function onClick() {
      return resolve('async value');
    },
    style: {
      marginRight: 8
    }
  }, "Resolve"), /*#__PURE__*/_react["default"].createElement(_.Button, {
    onClick: function onClick() {
      return reject('some error');
    }
  }, "Reject"));
};

exports.story = story;
//# sourceMappingURL=Awaiter.stories.js.map