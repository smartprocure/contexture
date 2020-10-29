"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.memoryService = void 0;

var _contexture = _interopRequireDefault(require("contexture"));

var _providerMemory = _interopRequireDefault(require("contexture/src/provider-memory"));

var _exampleTypes = _interopRequireDefault(require("contexture/src/provider-memory/exampleTypes"));

var _mobxReact = require("mobx-react");

var _react = _interopRequireDefault(require("react"));

var _contextureMobx = _interopRequireDefault(require("./utils/contexture-mobx"));

var _schema = require("./utils/schema");

var _exampleTypes2 = require("./exampleTypes");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var memoryService = function memoryService(records) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      schema = _ref.schema,
      debug = _ref.debug;

  return (0, _contexture["default"])({
    debug: debug,
    // Hack to effectively set a default schema: if our tree root doesn't have
    // a `schema` property, it will get the schema at key `undefined`.
    schemas: _defineProperty({}, schema, {
      memory: {
        records: records
      }
    }),
    providers: {
      memory: _objectSpread(_objectSpread({}, _providerMemory["default"]), {}, {
        types: (0, _exampleTypes["default"])()
      })
    }
  });
};

exports.memoryService = memoryService;

var MemoryTable = function MemoryTable(_ref2) {
  var data = _ref2.data,
      fields = _ref2.fields,
      debug = _ref2.debug,
      include = _ref2.include,
      props = _objectWithoutProperties(_ref2, ["data", "fields", "debug", "include"]);

  var service = memoryService(data, {
    schema: 'data',
    debug: debug
  });

  var _React$useState = _react["default"].useState((0, _contextureMobx["default"])({
    service: service
  })({
    key: 'root',
    schema: 'data',
    children: [{
      key: 'results',
      type: 'results',
      include: include
    }, {
      key: 'criteria',
      type: 'group',
      children: []
    }]
  })),
      _React$useState2 = _slicedToArray(_React$useState, 1),
      tree = _React$useState2[0];

  tree.refresh(['root']);
  return /*#__PURE__*/_react["default"].createElement(_exampleTypes2.ResultTable, _extends({
    path: ['root', 'results'],
    criteria: ['root', 'criteria'],
    mapNodeToProps: (0, _schema.componentForType)(_exampleTypes2.TypeMap)
  }, _objectSpread({
    fields: fields,
    tree: tree
  }, props)));
};

var _default = (0, _mobxReact.observer)(MemoryTable);

exports["default"] = _default;
//# sourceMappingURL=MemoryTable.js.map