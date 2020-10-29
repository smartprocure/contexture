"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var React = _interopRequireWildcard(require("react"));

var _react2 = require("@storybook/react");

var _greyVest = require("./greyVest");

var _themePicker = _interopRequireDefault(require("./stories/themePicker"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

(0, _react2.storiesOf)('Search Components|SearchLayout', module).addDecorator((0, _themePicker["default"])('greyVest')).add('Basic', function () {
  return /*#__PURE__*/React.createElement(_.SearchLayout, {
    mode: "basic"
  }, /*#__PURE__*/React.createElement(_greyVest.Box, null, "Filters"), /*#__PURE__*/React.createElement(_greyVest.Box, null, "Results"));
}).add('Builder', function () {
  return /*#__PURE__*/React.createElement(_.SearchLayout, {
    mode: "builder"
  }, /*#__PURE__*/React.createElement(_greyVest.Box, null, "Filters"), /*#__PURE__*/React.createElement(_greyVest.Box, null, "Results"));
}).add('Results Only', function () {
  return /*#__PURE__*/React.createElement(_.SearchLayout, {
    mode: "resultsOnly"
  }, /*#__PURE__*/React.createElement(_greyVest.Box, null, "Results"));
});
//# sourceMappingURL=SearchLayout.stories.js.map