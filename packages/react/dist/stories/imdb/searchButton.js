"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _mobxUtils = require("mobx-utils");

var _contexture = _interopRequireWildcard(require("./utils/contexture"));

var _2 = require("../..");

var _DemoControls = _interopRequireWildcard(require("../DemoControls"));

var _exampleTypes = require("../../exampleTypes");

var _theme = require("../../utils/theme");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var formatYear = function formatYear(x) {
  return new Date(x).getUTCFullYear();
};

var tree = (0, _contexture["default"])({
  key: 'searchRoot',
  type: 'group',
  schema: 'movies',
  children: [{
    key: 'searchQuery',
    type: 'query',
    field: 'title'
  }, {
    key: 'criteria',
    type: 'group',
    children: [{
      key: 'searchNumber',
      type: 'number',
      field: 'metaScore',
      min: 0,
      max: 100
    }, {
      key: 'searchFacet',
      type: 'facet',
      field: 'genres'
    }, {
      key: 'searchActors',
      type: 'facet',
      field: 'actors'
    }]
  }, {
    key: 'results',
    type: 'results'
  }, {
    key: 'releases',
    type: 'dateHistogram',
    key_field: 'released',
    value_field: 'imdbVotes',
    interval: '3650d'
  }, {
    key: 'genreScores',
    type: 'terms_stats',
    key_field: 'genres',
    value_field: 'metaScore',
    order: 'sum'
  }]
});
tree.disableAutoUpdate = true;
var schemas = (0, _mobxUtils.fromPromise)((0, _contexture.updateSchemas)().then(_fp["default"].merge(_fp["default"], {
  movies: {
    fields: {
      poster: {
        display: function display(x) {
          return /*#__PURE__*/_react["default"].createElement("img", {
            src: x,
            width: "180",
            height: "270"
          });
        },
        order: 1
      },
      released: {
        label: 'Release Date'
      }
    }
  }
})));
var blueBar = {
  background: '#2a4466',
  boxShadow: '0 0 4px rgba(0,0,0,.14), 0 4px 8px rgba(0,0,0,.28)',
  padding: '10px'
};
var whiteBox = {
  boxShadow: '0 1px 3px 0 rgba(0,0,0,.08)',
  background: '#fff',
  padding: '15px',
  margin: '15px'
};

var Story = function Story() {
  return /*#__PURE__*/_react["default"].createElement(_2.Awaiter, {
    promise: schemas
  }, function (schemas) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        background: '#f4f4f4'
      }
    }, /*#__PURE__*/_react["default"].createElement(_2.SpacedList, null, /*#__PURE__*/_react["default"].createElement(_2.Flex, {
      style: _objectSpread({
        alignItems: 'center'
      }, blueBar)
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        flex: 4
      }
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.Query, {
      tree: tree,
      path: ['searchRoot', 'searchQuery']
    })), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        flex: 1,
        marginLeft: '5px',
        display: 'flex'
      }
    }, /*#__PURE__*/_react["default"].createElement("input", {
      type: "checkbox",
      checked: !tree.disableAutoUpdate,
      onChange: _futil["default"].flip('disableAutoUpdate', tree)
    }), tree.disableAutoUpdate && /*#__PURE__*/_react["default"].createElement(_DemoControls.Button, {
      onClick: tree.triggerUpdate
    }, "Search"))), /*#__PURE__*/_react["default"].createElement(_2.Flex, null, /*#__PURE__*/_react["default"].createElement("div", {
      style: _objectSpread({
        flex: 1
      }, whiteBox)
    }, /*#__PURE__*/_react["default"].createElement(_2.FilterList, {
      tree: tree,
      path: ['searchRoot', 'criteria'],
      fields: schemas.movies.fields,
      mapNodeToProps: (0, _2.componentForType)(_exampleTypes.TypeMap)
    }), /*#__PURE__*/_react["default"].createElement(_2.FilterAdder, {
      tree: tree,
      path: ['searchRoot', 'criteria'],
      fields: schemas.movies.fields,
      uniqueFields: true
    })), /*#__PURE__*/_react["default"].createElement("div", {
      style: _objectSpread({
        flex: 4,
        maxWidth: '80%'
      }, whiteBox)
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultCount, {
      tree: tree,
      path: ['searchRoot', 'results']
    }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.DateHistogram, {
      tree: tree,
      path: ['searchRoot', 'releases'],
      format: formatYear
    }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.TermsStats, {
      tree: tree,
      path: ['searchRoot', 'genreScores']
    }), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.PagedResultTable, {
      tree: tree,
      path: ['searchRoot', 'results'],
      fields: schemas.movies.fields
    }))))));
  });
};

var _default = function _default() {
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: _DemoControls["default"]
  }, /*#__PURE__*/_react["default"].createElement(Story, null));
};

exports["default"] = _default;
//# sourceMappingURL=searchButton.js.map