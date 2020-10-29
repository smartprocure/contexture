"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _mobx = require("mobx");

var _mobxUtils = require("mobx-utils");

var _mobxReact = require("mobx-react");

var _contexture = _interopRequireWildcard(require("./utils/contexture"));

var _2 = require("../..");

var _DemoControls = _interopRequireWildcard(require("../DemoControls"));

var _exampleTypes = require("../../exampleTypes");

var _theme = require("../../utils/theme");

var _ExpandableTable = require("../../greyVest/ExpandableTable");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

var termDetailsTree = _fp["default"].memoize(function (term) {
  var termTree = (0, _contexture["default"])({
    key: 'detailRoot',
    type: 'group',
    schema: 'movies',
    children: [{
      key: 'detailFacet',
      type: 'facet',
      field: 'genres'
    }, {
      key: 'results',
      type: 'results',
      sortField: 'metaScore',
      order: 'desc',
      pageSize: 50
    }]
  });
  termTree.mutate(['detailRoot', 'detailFacet'], {
    values: [term]
  });
  return termTree;
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
var Story = (0, _mobxReact.inject)(function () {
  var state = (0, _mobx.observable)({
    selected: []
  });

  state.getValue = function (x) {
    return x.key;
  };

  (0, _mobx.autorun)(function () {
    return console.info(state.selected.slice());
  });
  return {
    state: state
  };
})((0, _mobxReact.observer)(function (_ref) {
  var state = _ref.state;
  return /*#__PURE__*/_react["default"].createElement(_DemoControls.DarkBox, null, /*#__PURE__*/_react["default"].createElement(_2.Awaiter, {
    promise: schemas
  }, function (schemas) {
    return /*#__PURE__*/_react["default"].createElement(_2.SpacedList, null, /*#__PURE__*/_react["default"].createElement(_exampleTypes.Query, {
      tree: tree,
      path: ['searchRoot', 'searchQuery']
    }), /*#__PURE__*/_react["default"].createElement(_2.Flex, null, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        flex: 1
      }
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
      style: {
        flex: 4,
        maxWidth: '80%'
      }
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultCount, {
      tree: tree,
      path: ['searchRoot', 'results']
    }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.DateHistogram, {
      tree: tree,
      path: ['searchRoot', 'releases'],
      format: formatYear
    }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.CheckableTermsStatsTable, {
      tree: tree,
      criteria: ['searchRoot', 'criteria'],
      path: ['searchRoot', 'genreScores'],
      tableAttrs: {
        style: {
          margin: 'auto'
        }
      },
      Checkbox: function Checkbox(props) {
        return /*#__PURE__*/_react["default"].createElement("input", _extends({
          type: "checkbox"
        }, props));
      },
      selected: _futil["default"].lensProp('selected', state),
      getValue: state.getValue
    }, /*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      field: "key",
      label: "Genre"
    }), /*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      field: "count",
      label: "Found",
      enableSort: true
    }), /*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      field: "avg",
      label: "Average",
      enableSort: true
    }), /*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      field: "key",
      label: "",
      expand: {
        display: function display(x) {
          return "Show top 50 based on meta score for ".concat(x, " \u25BC");
        }
      },
      collapse: {
        display: function display(x) {
          return "Hide top 50 based on meta score for ".concat(x, " \u25B2");
        }
      }
    }, function (x) {
      return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_exampleTypes.PagedResultTable, {
        tree: termDetailsTree(x),
        path: ['detailRoot', 'results'],
        fields: _fp["default"].pick(['title', 'year', 'genres'], schemas.movies.fields)
      }));
    }), /*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      field: "key",
      label: function label() {
        return /*#__PURE__*/_react["default"].createElement("strong", null, "Custom Header");
      },
      expand: {
        display: function display() {
          return 'Expand me ▼';
        }
      },
      collapse: {
        display: function display() {
          return 'Hide me ▲';
        }
      }
    }, function (x) {
      return /*#__PURE__*/_react["default"].createElement("div", null, "I just expand and show my parent value, which is", ' ', /*#__PURE__*/_react["default"].createElement("strong", null, x));
    })), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        overflowX: 'auto'
      }
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.PagedResultTable, {
      tree: tree,
      path: ['searchRoot', 'results'],
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
        }
      },
      infer: true
    })))));
  }));
}));

var _default = function _default() {
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeProvider, {
    theme: _DemoControls["default"]
  }, /*#__PURE__*/_react["default"].createElement(Story, null));
};

exports["default"] = _default;
//# sourceMappingURL=filterList.js.map