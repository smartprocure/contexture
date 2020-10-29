"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fieldsFromSchema = exports.componentForType = exports.schemaFieldProps = exports.defaultNodeProps = exports.inferSchema = exports.getResults = exports.getRecord = exports.applyDefaults = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

var _futil2 = require("./futil");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var applyDefaults = F.mapValuesIndexed(function (val, field) {
  return _objectSpread({
    field: field,
    label: F.autoLabel(field),
    order: 0,
    // `_.get('push') is used instead of `_.isArray` to match mobx4 arrays
    display: function display(x) {
      return F.when(_fp["default"].get('push'), _fp["default"].join(', '))(x);
    }
  }, val);
});
exports.applyDefaults = applyDefaults;
var getRecord = F.when('_source', function (x) {
  return _objectSpread({
    _id: x._id
  }, x._source);
});
exports.getRecord = getRecord;
var getResults = F.cascade(['context.response.results', 'context.results']);
exports.getResults = getResults;

var inferSchema = _fp["default"].flow(getResults, _fp["default"].head, getRecord, _futil2.flattenPlainObject);

exports.inferSchema = inferSchema;

var defaultNodeProps = function defaultNodeProps(field, fields, type) {
  return _fp["default"].get([field, 'defaultNodeProps', type], fields);
};

exports.defaultNodeProps = defaultNodeProps;

var schemaFieldProps = _fp["default"].curry(function (props, _ref, fields) {
  var field = _ref.field;
  return _fp["default"].pick(props, fields[field]);
});

exports.schemaFieldProps = schemaFieldProps;

var componentForType = function componentForType(TypeMap) {
  return function (_ref2) {
    var type = _ref2.type;
    return F.whenExists(F.singleObject('component'))(TypeMap[type]);
  };
};

exports.componentForType = componentForType;

var fieldsFromSchema = _fp["default"].curry(function (schemas, search) {
  return schemas[search.tree.schema].fields;
});

exports.fieldsFromSchema = fieldsFromSchema;
//# sourceMappingURL=schema.js.map