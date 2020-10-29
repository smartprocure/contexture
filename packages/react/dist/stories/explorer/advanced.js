"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

var _mobx = require("mobx");

var _mobxUtils = require("mobx-utils");

var _mobxReact = require("mobx-react");

var _2 = require("../../");

var _DemoControls = require("../DemoControls");

var _exampleTypes = require("../../exampleTypes");

var _contexture = _interopRequireWildcard(require("./contexture"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var state = (0, _mobx.observable)({
  url: '',
  schemas: null,
  tree: {},
  savedSearch: '',
  showDebug: false
});

var save = function save() {
  state.savedSearch = JSON.stringify(state.tree.serialize(), null, 2);
};

var load = function load() {
  state.tree = (0, _contexture["default"])(JSON.parse(state.savedSearch));
  state.tree.refresh();
};

var changeSchema = function changeSchema(schema) {
  state.tree = (0, _contexture["default"])({
    key: 'root',
    type: 'group',
    join: 'and',
    schema: schema,
    children: [{
      key: 'criteria',
      type: 'group',
      join: 'and',
      children: [{
        key: 'firstFilter'
      }]
    }, {
      key: 'results',
      type: 'results',
      page: 1
    }]
  });
};

var updateEs = function updateEs(host) {
  state.url = host;
  state.schemas = (0, _mobxUtils.fromPromise)((0, _contexture.updateClient)({
    host: host
  }).then(function (x) {
    changeSchema(_fp["default"].keys(x)[0]);
    return x;
  }));
};

updateEs('https://public-es-demo.smartprocure.us/');

var Debug = function Debug(_ref) {
  var value = _ref.value;
  return /*#__PURE__*/_react["default"].createElement("pre", null, JSON.stringify(value, null, 2));
};

var Story = (0, _mobxReact.observer)(function () {
  var tree = state.tree,
      schemas = state.schemas;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_DemoControls.TextInput, {
    value: state.url,
    onChange: function onChange(e) {
      return updateEs(e.target.value);
    }
  }), schemas && /*#__PURE__*/_react["default"].createElement(_2.Awaiter, {
    promise: schemas
  }, function (schemas) {
    return _fp["default"].get('tree.schema', tree) && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("select", {
      value: tree.schema,
      onChange: function onChange(e) {
        return changeSchema(e.target.value);
      }
    }, _fp["default"].map(function (x) {
      return /*#__PURE__*/_react["default"].createElement("option", {
        key: x
      }, x);
    }, _fp["default"].sortBy(_fp["default"].identity, _fp["default"].keys(schemas)))), /*#__PURE__*/_react["default"].createElement("button", {
      onClick: save
    }, "Save"), /*#__PURE__*/_react["default"].createElement("button", {
      onClick: load
    }, "Load"), /*#__PURE__*/_react["default"].createElement("button", {
      onClick: F.flip(F.lensProp('showDebug', state))
    }, state.showDebug ? 'Hide' : 'Show', " Dev Panel"), state.showDebug && /*#__PURE__*/_react["default"].createElement(_2.Flex, null, /*#__PURE__*/_react["default"].createElement("textarea", {
      style: {
        width: '50%'
      },
      value: state.savedSearch,
      onChange: function onChange(e) {
        state.savedSearch = e.target.value;
      }
    }), /*#__PURE__*/_react["default"].createElement(Debug, {
      style: {
        width: '50%'
      },
      value: tree
    })), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_2.QueryBuilder, {
      tree: tree,
      mapNodeToProps: (0, _2.componentForType)(_exampleTypes.TypeMap),
      fields: schemas[tree.tree.schema].fields,
      path: ['root', 'criteria']
    }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultCount, {
      tree: tree,
      path: ['root', 'results']
    }), /*#__PURE__*/_react["default"].createElement(_exampleTypes.ResultTable, {
      tree: tree,
      path: ['root', 'results'],
      fields: schemas[tree.tree.schema].fields
    })));
  }));
});

var _default = function _default() {
  return /*#__PURE__*/_react["default"].createElement(Story, null);
};

exports["default"] = _default;
//# sourceMappingURL=advanced.js.map