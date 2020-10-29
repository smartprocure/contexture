"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var F = _interopRequireWildcard(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _Async = _interopRequireDefault(require("react-select/lib/Async"));

var _geo = require("../utils/geo");

var _theme = require("../utils/theme");

var _DemoControls = _interopRequireDefault(require("../stories/DemoControls"));

var _testTree = _interopRequireDefault(require("./stories/testTree"));

var _greyVest = require("../../src/greyVest");

var _exampleTypes = require("../../src/exampleTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var formatYear = function formatYear(x) {
  return new Date(x).getUTCFullYear();
};

(0, _react2.storiesOf)('ExampleTypes|Full Demo', module).add('Full Demo', function () {
  var tree = (0, _testTree["default"])();
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: _DemoControls["default"]
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      backgroundColor: '#333',
      color: '#AAA',
      padding: '20px',
      borderRadius: '10px'
    }
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.SpacedList, null, /*#__PURE__*/_react["default"].createElement(_exampleTypes.Query, {
    tree: tree,
    path: ['query']
  }), /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.SpacedList, null, /*#__PURE__*/_react["default"].createElement(_exampleTypes.TagsQuery, {
    tree: tree,
    path: ['tagsQuery']
  }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.Text, {
    tree: tree,
    path: ['titleText']
  }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.Facet, {
    tree: tree,
    path: ['facet'],
    formatCount: function formatCount(x) {
      return "(".concat(x, ")");
    }
  }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.Facet, {
    tree: tree,
    path: ['facet'],
    display: F.autoLabel
  }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.Number, {
    tree: tree,
    path: ['number']
  }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.Number, {
    tree: tree,
    path: ['number']
  }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.Geo, {
    tree: tree,
    loadOptions: _geo.loadHereOptions,
    path: ['geo'],
    AutoComplete: _Async["default"],
    GeoCodeLocation: _geo.geoCodeLocation
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: 4
    }
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.SpacedList, null, /*#__PURE__*/_react["default"].createElement(_exampleTypes.DateHistogram, {
    tree: tree,
    path: ['dateHistogram'],
    format: formatYear
  }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultCount, {
    tree: tree,
    path: ['results']
  }), /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      alignItems: 'baseline',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultTable, {
    tree: tree,
    path: ['results'],
    infer: true
  }))))))));
});
//# sourceMappingURL=index.stories.js.map