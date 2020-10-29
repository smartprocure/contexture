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

var _contexture = _interopRequireWildcard(require("../utils/contexture"));

var _2 = require("../..");

var _greyVest = require("../../greyVest");

var _exampleTypes = require("../../exampleTypes");

var _ExpandableTable = require("../../greyVest/ExpandableTable");

var _theme = require("../../utils/theme");

var _futil2 = require("../../utils/futil");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var tree = (0, _contexture["default"])({
  key: 'root',
  type: 'group',
  schema: 'movies',
  children: [{
    key: 'bar',
    type: 'tagsQuery',
    field: 'title'
  }, {
    key: 'criteria',
    type: 'group',
    join: 'and',
    children: [{
      key: 'status',
      field: 'released',
      type: 'date',
      useDateMath: true
    }, {
      key: 'titleGroup',
      type: 'group',
      join: 'or',
      children: [{
        key: 'titleContains',
        type: 'tagsQuery',
        field: 'title'
      }, {
        key: 'titleDoesNotContain',
        type: 'tagsQuery',
        field: 'title',
        join: 'none'
      }]
    }, {
      key: 'titleText',
      type: 'tagsText',
      field: 'title'
    }, {
      key: 'searchNumber',
      type: 'number',
      field: 'metaScore',
      min: 0,
      max: 100
    }, {
      key: 'searchFacet',
      type: 'facet',
      field: 'genres',
      paused: true
    }, {
      key: 'searchActors',
      type: 'facet',
      field: 'actors'
    }, {
      key: 'date',
      type: 'date',
      field: 'released',
      from: '2011-01-01T05:00:00.000Z',
      to: '2018-01-01T05:00:00.000Z'
    }, {
      key: 'IntentionallyBrokenNode',
      type: 'IntentionallyMissingType',
      field: 'missingField'
    }, {
      key: 'ExistsAndBoolDemo',
      type: 'group',
      join: 'or',
      children: [{
        key: 'missingField',
        type: 'exists',
        field: 'Missing Field',
        value: false
      }, {
        // The IMDB index doesn't have a bool type, but that's ok because this is in an OR
        key: 'missingBool',
        type: 'bool',
        field: 'Missing Bool',
        value: false
      }]
    }]
  }, {
    key: 'results',
    type: 'results',
    include: ['imdbId', 'runtimeMinutes', 'poster', 'title', 'actors', 'genres', 'metaScore', 'rated', 'released', 'plot'],
    sortField: ''
  }, {
    key: 'genreScores',
    type: 'terms_stats',
    key_field: 'genres',
    value_field: 'metaScore',
    order: 'sum',
    size: 25
  }]
});
tree.disableAutoUpdate = true;
var state = (0, _mobx.observable)({
  mode: 'basic'
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
      pageSize: 5
    }]
  });
  termTree.mutate(['detailRoot', 'detailFacet'], {
    values: [term]
  });
  return termTree;
});

var divs = _fp["default"].map(function (x) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    key: x
  }, x);
});

var overrides = {
  movies: {
    fields: {
      released: {
        label: 'Release Date'
      },
      poster: {
        display: function display(x) {
          return /*#__PURE__*/_react["default"].createElement("img", {
            src: x,
            width: "180",
            height: "270"
          });
        },
        order: 2
      },
      title: {
        order: 1,
        display: function display(x) {
          return /*#__PURE__*/_react["default"].createElement("span", {
            dangerouslySetInnerHTML: {
              __html: x
            }
          });
        }
      },
      genres: {
        display: divs
      },
      actors: {
        display: divs
      },
      imdbId: {
        path: ['Imdb', 'imdbId']
      },
      imdbRating: {
        path: ['Imdb', 'imdbRating']
      },
      imdbVotes: {
        path: ['Imdb', 'imdbVotes']
      },
      year: {
        defaultNodeProps: {
          number: {
            min: 2005
          }
        }
      },
      metaScore: {
        significantDigits: 2
      }
    }
  }
};
var schemas = (0, _mobxUtils.fromPromise)((0, _contexture.updateSchemas)().then(_fp["default"].merge(overrides)).then(_fp["default"].tap(function () {
  return tree.refresh(['root']);
})));

var mapNodeToProps = _futil["default"].mergeOverAll([(0, _2.componentForType)(_exampleTypes.TypeMap), (0, _2.schemaFieldProps)('signicantDigits'), function (_ref) {
  var key = _ref.key;
  return key === 'status' && {
    component: _exampleTypes.DateRangePicker,
    ranges: [{
      label: 'All Time',
      from: '',
      to: ''
    }, {
      label: 'This Year',
      from: 'now/y',
      to: ''
    }, {
      label: 'Last Year',
      from: 'now-1y/y',
      to: 'now/y'
    }]
  };
}]);

var GreyVestSearchBarStory = function GreyVestSearchBarStory(theme) {
  return /*#__PURE__*/_react["default"].createElement(_2.Awaiter, {
    promise: schemas
  }, function (schemas) {
    return /*#__PURE__*/_react["default"].createElement(_2.SearchLayout, {
      mode: state.mode
    }, /*#__PURE__*/_react["default"].createElement(_2.SearchFilters, {
      mode: state.mode,
      setMode: function setMode(x) {
        return state.mode = x;
      }
    }, /*#__PURE__*/_react["default"].createElement(_2.SearchTree, {
      tree: tree,
      path: ['root', 'criteria'],
      fields: schemas.movies.fields,
      mapNodeToLabel: function mapNodeToLabel(_ref2) {
        var key = _ref2.key;
        return {
          titleContains: 'Title Contains',
          titleDoesNotContain: 'Title Does Not Contain'
        }[key];
      },
      mapNodeToProps: mapNodeToProps
    })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_2.ToggleFiltersHeader, {
      mode: state.mode,
      setMode: function setMode(x) {
        return state.mode = x;
      }
    }, "Search Movies"), /*#__PURE__*/_react["default"].createElement(Grid, {
      columns: "1fr auto",
      gap: 10,
      placeItems: "center stretch"
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.TagsQuerySearchBar, {
      tree: tree,
      path: ['root', 'bar'],
      resultsPath: ['root', 'results'],
      autoFocus: true,
      actionWrapper: _futil2.aspectWrapper,
      searchButtonProps: _defineProperty({}, 'data-attribute', 'attribute1')
    }), /*#__PURE__*/_react["default"].createElement(theme.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(theme.AlternateButton, {
      title: "Auto Update",
      primary: !tree.disableAutoUpdate,
      onClick: _futil["default"].flip('disableAutoUpdate', tree)
    }, /*#__PURE__*/_react["default"].createElement(theme.Icon, {
      icon: "AutoUpdate"
    })), /*#__PURE__*/_react["default"].createElement(theme.AlternateButton, {
      onClick: function onClick() {
        window.location.reload();
      },
      title: "New Search"
    }, /*#__PURE__*/_react["default"].createElement(theme.Icon, {
      icon: "New"
    })))), /*#__PURE__*/_react["default"].createElement("h1", null, "Search Results"), /*#__PURE__*/_react["default"].createElement(_greyVest.Tabs, {
      defaultValue: "results",
      TabPanel: theme.Box
    }, /*#__PURE__*/_react["default"].createElement(_greyVest.TabLabel, {
      value: "results"
    }, "Movies (", /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultCount, {
      tree: tree,
      path: ['root', 'results']
    }), ")"), /*#__PURE__*/_react["default"].createElement(_greyVest.TabContent, {
      value: "results"
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.PagedResultTable, {
      tree: tree,
      path: ['root', 'results'],
      fields: _fp["default"].omit(['imdbId', 'runtimeMinutes'], schemas[tree.tree.schema].fields),
      criteria: ['root', 'criteria'],
      mapNodeToProps: (0, _2.componentForType)(_exampleTypes.TypeMap)
    })), /*#__PURE__*/_react["default"].createElement(_greyVest.Tab, {
      value: "analytics",
      label: "Analytics"
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.TermsStatsTable, {
      tree: tree,
      criteria: ['root', 'criteria'],
      criteriaField: "genres",
      path: ['root', 'genreScores'],
      tableAttrs: {
        className: 'gv-table'
      },
      sizeOptions: [10, 25, 50],
      getValue: "key"
    }, /*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      field: "key",
      label: "Genre"
    }), /*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      field: "count",
      label: "Found"
    }), /*#__PURE__*/_react["default"].createElement(_ExpandableTable.Column, {
      field: "key",
      label: "",
      expand: {
        display: function display(x) {
          return "Show results for ".concat(x, " +");
        }
      },
      collapse: {
        display: function display(x) {
          return "Hide results for ".concat(x, " -");
        }
      }
    }, function (x) {
      return /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          marginBottom: 25
        }
      }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.PagedResultTable, {
        tree: termDetailsTree(x),
        path: ['detailRoot', 'results'],
        fields: _fp["default"].pick(['title', 'year', 'genres'], schemas.movies.fields)
      }));
    }))))));
  });
};

var _default = function _default() {
  return /*#__PURE__*/_react["default"].createElement(_theme.ThemeConsumer, null, GreyVestSearchBarStory);
};

exports["default"] = _default;
//# sourceMappingURL=searchLayout.js.map