"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _mobxUtils = require("mobx-utils");

var _2 = require("../..");

var _contexture = _interopRequireWildcard(require("./utils/contexture"));

var _exampleTypes = require("../../exampleTypes");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tree = (0, _contexture["default"])({
  key: 'root',
  type: 'group',
  join: 'and',
  schema: 'movies',
  children: [{
    key: 'searchRoot',
    type: 'group',
    join: 'and',
    children: [{
      key: 'searchQuery',
      type: 'query',
      field: 'title'
    }, {
      key: 'searchFacet',
      type: 'facet',
      field: 'genres'
    }]
  }, {
    key: 'results',
    type: 'results',
    pageSize: 10,
    page: 1
  }]
});
var schemas = (0, _mobxUtils.fromPromise)((0, _contexture.updateSchemas)().then(_fp["default"].merge(_fp["default"], {
  movies: {
    fields: {
      released: {
        label: 'Release Date'
      }
    }
  }
})));

var advanced = function advanced() {
  return /*#__PURE__*/_react["default"].createElement(_2.Awaiter, {
    promise: schemas
  }, function (schemas) {
    return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_2.QueryBuilder, {
      tree: tree,
      mapNodeToProps: (0, _2.componentForType)(_exampleTypes.TypeMap),
      fields: schemas.movies.fields,
      path: ['root', 'searchRoot']
    }), /*#__PURE__*/_react["default"].createElement("h1", null, /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultCount, {
      tree: tree,
      path: ['root', 'results']
    })), /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultTable, {
      tree: tree,
      path: ['root', 'results'],
      fields: schemas.movies.fields
    }), /*#__PURE__*/_react["default"].createElement("pre", null, JSON.stringify(tree, null, 2)));
  });
};

(0, _react2.storiesOf)('Live Demos|Advanced Search', module).add('Advanced', advanced);
//# sourceMappingURL=advanced.stories.js.map