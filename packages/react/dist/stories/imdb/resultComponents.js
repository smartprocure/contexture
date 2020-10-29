"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var F = _interopRequireWildcard(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _mobx = require("mobx");

var _mobxUtils = require("mobx-utils");

var _mobxReact = require("mobx-react");

var _contexture = _interopRequireWildcard(require("../utils/contexture"));

var _theme = require("../../../utils/theme");

var _2 = require("../..");

var _exampleTypes = require("../../exampleTypes");

var _IMDBCards = _interopRequireDefault(require("./components/IMDBCards"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
    type: 'results',
    include: ['_checkbox', 'poster', 'title', 'actors', 'genres', 'rated', 'released']
  }]
});
tree.disableAutoUpdate = true;
var state = (0, _mobx.observable)({
  showCards: true
});

var divs = _fp["default"].map(function (x) {
  return /*#__PURE__*/_react["default"].createElement("div", {
    key: x
  }, x);
});

var schemas = (0, _mobxUtils.fromPromise)((0, _contexture.updateSchemas)().then(_fp["default"].merge(_fp["default"], {
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
        display: function display(x) {
          return /*#__PURE__*/_react["default"].createElement("span", {
            dangerouslySetInnerHTML: {
              __html: x
            }
          });
        },
        order: 1
      },
      genres: {
        display: divs
      },
      actors: {
        display: divs
      }
    }
  }
})).then(_fp["default"].tap(function () {
  return tree.refresh(['root']);
})));
var CheckboxResultTable = (0, _mobxReact.observer)(function (props) {
  var selected = _react["default"].useState([]);

  return /*#__PURE__*/_react["default"].createElement("div", null, JSON.stringify(F.view(selected)), /*#__PURE__*/_react["default"].createElement(_exampleTypes.CheckableResultTable, _objectSpread({
    selected: selected
  }, props)));
});

var _default = function _default() {
  var theme = (0, _theme.useTheme)();
  return /*#__PURE__*/_react["default"].createElement(_2.Awaiter, {
    promise: schemas
  }, function (schemas) {
    return /*#__PURE__*/_react["default"].createElement(_2.Grid, {
      gap: "22px",
      columns: "1fr 4fr",
      style: {
        margin: '22px'
      }
    }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("h1", null, "Filters"), /*#__PURE__*/_react["default"].createElement(_2.SpacedList, null, /*#__PURE__*/_react["default"].createElement(_2.FilterList, {
      tree: tree,
      path: ['root', 'criteria'],
      fields: schemas.movies.fields,
      mapNodeToProps: F.mergeOverAll([(0, _2.componentForType)(_exampleTypes.TypeMap), function (field) {
        return field.key === 'searchNumber' ? {
          showBestRange: true
        } : {};
      }])
    }), /*#__PURE__*/_react["default"].createElement(_2.FilterAdder, {
      tree: tree,
      path: ['root', 'criteria'],
      fields: schemas.movies.fields,
      uniqueFields: true
    }))), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_2.Grid, {
      columns: "1fr auto",
      style: {
        alignItems: 'center'
      }
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.TagsQuery, {
      tree: tree,
      path: ['root', 'bar']
    }), tree.disableAutoUpdate && /*#__PURE__*/_react["default"].createElement(theme.Button, {
      onClick: tree.triggerUpdate,
      primary: true
    }, "Search")), /*#__PURE__*/_react["default"].createElement(_2.Flex, {
      style: {
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/_react["default"].createElement("h1", null, "Results (", /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultCount, {
      tree: tree,
      path: ['root', 'results']
    }), ")"), /*#__PURE__*/_react["default"].createElement(_2.Flex, null, /*#__PURE__*/_react["default"].createElement(theme.RadioList, {
      options: [{
        label: 'AutoSearch On',
        value: true
      }, {
        label: 'AutoSearch Off',
        value: false
      }],
      value: !tree.disableAutoUpdate,
      onChange: function onChange(val) {
        tree.disableAutoUpdate = !val;
      }
    }))), /*#__PURE__*/_react["default"].createElement(theme.Box, null, /*#__PURE__*/_react["default"].createElement(_2.Flex, null, /*#__PURE__*/_react["default"].createElement(theme.RadioList, {
      options: [{
        label: 'Title Cards',
        value: true
      }, {
        label: 'Checkable Table',
        value: false
      }],
      value: state.showCards,
      onChange: function onChange(val) {
        state.showCards = val;
      }
    })), state.showCards ? /*#__PURE__*/_react["default"].createElement(_IMDBCards["default"], {
      tree: tree,
      path: ['root', 'results']
    }) : /*#__PURE__*/_react["default"].createElement(CheckboxResultTable, {
      tree: tree,
      fields: schemas[tree.tree.schema].fields,
      path: ['root', 'results'],
      criteria: ['root', 'criteria'],
      mapNodeToProps: (0, _2.componentForType)(_exampleTypes.TypeMap),
      getValue: "title"
    }), /*#__PURE__*/_react["default"].createElement(_2.Flex, {
      style: {
        justifyContent: 'space-around',
        padding: '10px'
      }
    }, /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultPager, {
      tree: tree,
      path: ['root', 'results']
    })))));
  });
};

exports["default"] = _default;
//# sourceMappingURL=resultComponents.js.map