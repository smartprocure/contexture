"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTypeLabelOptions = exports.getTypeLabel = exports.indent = exports.transformNodeFromField = exports.newNodeFromField = exports.newNodeFromType = exports.blankNode = exports.randomString = exports.oppositeJoin = void 0;

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _schema = require("./schema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var oppositeJoin = function oppositeJoin(node) {
  return _futil["default"].getOrReturn('join', node) === 'and' ? 'or' : 'and';
};

exports.oppositeJoin = oppositeJoin;

var randomString = function randomString() {
  return Math.random().toString(36).substring(7);
};

exports.randomString = randomString;

var blankNode = function blankNode() {
  return {
    key: randomString()
  };
};

exports.blankNode = blankNode;

var newNodeFromType = _fp["default"].curry(function (type, fields, node) {
  return _objectSpread(_objectSpread({
    type: type
  }, _fp["default"].pick(['key', 'field'], node)), (0, _schema.defaultNodeProps)(node.field, fields, type));
});

exports.newNodeFromType = newNodeFromType;

var newNodeFromField = function newNodeFromField(_ref) {
  var field = _ref.field,
      fields = _ref.fields,
      optionalNodeProps = _objectWithoutProperties(_ref, ["field", "fields"]);

  var type = _fp["default"].get([field, 'typeDefault'], fields);

  return _objectSpread(_objectSpread({
    type: type,
    field: field
  }, (0, _schema.defaultNodeProps)(field, fields, type)), optionalNodeProps);
};

exports.newNodeFromField = newNodeFromField;

var transformNodeFromField = function transformNodeFromField(args) {
  return function (node) {
    return _objectSpread(_objectSpread({}, _fp["default"].pick('key', node)), newNodeFromField(args));
  };
};

exports.transformNodeFromField = transformNodeFromField;

var indent = function indent(Tree, parent, node, skipDefaultNode) {
  // Reactors:
  //   OR -> And, nothing
  //   AND -> OR, others if has value
  //   to/from NOT, others if has value
  var key = randomString();
  Tree.wrapInGroup(_fp["default"].toArray(node.path), {
    key: key,
    join: oppositeJoin((parent || node).join)
  });
  if (!skipDefaultNode) Tree.add(parent ? [].concat(_toConsumableArray(parent.path), [key]) : [key], blankNode());
  return Tree.getNode([].concat(_toConsumableArray(parent.path), [key]));
};

exports.indent = indent;

var getTypeLabel = function getTypeLabel(tree, type) {
  return _fp["default"].getOr(_futil["default"].autoLabel(type), ['types', type, 'label'], tree);
};

exports.getTypeLabel = getTypeLabel;

var getTypeLabelOptions = _fp["default"].curry(function (tree, types) {
  return _fp["default"].map(function (type) {
    return {
      label: getTypeLabel(tree, type),
      value: type
    };
  }, types);
});

exports.getTypeLabelOptions = getTypeLabelOptions;
//# sourceMappingURL=search.js.map