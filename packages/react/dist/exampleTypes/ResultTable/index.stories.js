"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pagination = exports.displayFieldOptional = exports.customizations = exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _testTree = _interopRequireDefault(require("../stories/testTree"));

var _themePicker = _interopRequireDefault(require("../../stories/themePicker"));

var _2 = _interopRequireDefault(require("."));

var _mobxReact = require("mobx-react");

var _greyVest = require("../../greyVest");

var _contexture = _interopRequireDefault(require("contexture"));

var _contextureMobx = _interopRequireDefault(require("../../utils/contexture-mobx"));

var _providerMemory = _interopRequireDefault(require("contexture/src/provider-memory"));

var _exampleTypes = _interopRequireDefault(require("contexture/src/provider-memory/exampleTypes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var _default = {
  title: 'ExampleTypes | ResultTable',
  component: _2["default"],
  decorators: [(0, _themePicker["default"])('greyVest')]
};
exports["default"] = _default;

var style = /*#__PURE__*/_react["default"].createElement("style", null, "\n    .example-table tr:nth-child(even) {\n      background-color: rgba(0, 0, 0, 0.5)\n    }\n    .example-table {\n      background: white;\n      color: #444;\n      border-collapse: collapse;\n    }\n    .example-table td, .example-table th {\n      padding: 5px\n    }\n    .example-table thead {\n      border-bottom: solid 2px #ccc\n    }\n  ");

var customizations = function customizations() {
  return /*#__PURE__*/_react["default"].createElement("div", null, style, /*#__PURE__*/_react["default"].createElement(_2["default"], {
    tree: (0, _testTree["default"])(),
    path: ['results'],
    theme: {
      Table: function Table(x) {
        return /*#__PURE__*/_react["default"].createElement("table", _extends({
          className: "example-table"
        }, x));
      }
    },
    infer: true,
    fields: {
      a: {
        label: 'Colored Header',
        order: -2,
        HeaderCell: function HeaderCell(_ref) {
          var style = _ref.style,
              props = _objectWithoutProperties(_ref, ["style"]);

          return /*#__PURE__*/_react["default"].createElement("th", _extends({
            style: _objectSpread({
              color: 'green'
            }, style)
          }, _fp["default"].omit('activeFilter', props)));
        }
      },
      b: {
        label: 'Hidden Remove Column',
        order: -3,
        hideRemoveColumn: true,
        HeaderCell: function HeaderCell(_ref2) {
          var style = _ref2.style,
              props = _objectWithoutProperties(_ref2, ["style"]);

          return /*#__PURE__*/_react["default"].createElement("th", _extends({
            style: _objectSpread({
              color: 'gray'
            }, style)
          }, _fp["default"].omit('activeFilter', props)));
        }
      },
      c: {
        label: 'Hidden Menu',
        order: -4,
        hideMenu: true,
        HeaderCell: function HeaderCell(_ref3) {
          var style = _ref3.style,
              props = _objectWithoutProperties(_ref3, ["style"]);

          return /*#__PURE__*/_react["default"].createElement("th", _extends({
            style: _objectSpread({
              color: 'gray'
            }, style)
          }, _fp["default"].omit('activeFilter', props)));
        }
      },
      title: {
        order: 1,
        Cell: function Cell(x) {
          return /*#__PURE__*/_react["default"].createElement("td", _extends({
            style: {
              color: 'red'
            }
          }, x));
        }
      }
    },
    getRowKey: _fp["default"].flow(_fp["default"].get('_id'), function (x) {
      return "key-".concat(x);
    })
  }));
};

exports.customizations = customizations;

var displayFieldOptional = function displayFieldOptional() {
  var tree = (0, _testTree["default"])(function (testTree) {
    testTree.getNode(['results']).include = ['title', 'a', 'b'];
    return testTree;
  });
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_2["default"], {
    tree: tree,
    path: ['results'],
    Table: function Table(x) {
      return /*#__PURE__*/_react["default"].createElement("table", _extends({
        className: "example-table"
      }, x));
    },
    fields: {
      title: {
        Cell: function Cell(x) {
          return /*#__PURE__*/_react["default"].createElement("td", _extends({
            style: {
              color: 'red'
            }
          }, x));
        }
      }
    }
  }));
};

exports.displayFieldOptional = displayFieldOptional;

var pagination = function pagination() {
  var data = _fp["default"].times(function (x) {
    return {
      _id: x,
      value: _fp["default"].random(0, 20000)
    };
  }, 221);

  var tree = {
    key: 'root',
    schema: 'test',
    children: [{
      key: 'results',
      type: 'results',
      pageSize: 5
    }]
  };
  var service = (0, _contexture["default"])({
    debug: true,
    schemas: {
      test: {
        memory: {
          records: data
        }
      }
    },
    providers: {
      memory: _objectSpread(_objectSpread({}, _providerMemory["default"]), {}, {
        types: (0, _exampleTypes["default"])()
      })
    }
  });
  var search = (0, _contextureMobx["default"])({
    service: service
  })(tree);
  search.refresh(['root']);
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Box, null, /*#__PURE__*/_react["default"].createElement(_mobxReact.Observer, null, function () {
    return /*#__PURE__*/_react["default"].createElement(_2["default"], {
      fields: {
        _id: {
          label: 'id'
        },
        value: {
          label: 'val'
        }
      },
      tree: search,
      path: ['root', 'results']
    });
  }));
};

exports.pagination = pagination;
//# sourceMappingURL=index.stories.js.map