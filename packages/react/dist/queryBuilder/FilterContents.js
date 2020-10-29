"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var F = _interopRequireWildcard(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _greyVest = require("../greyVest/");

var _purgatory = require("../purgatory");

var _FilterAdder = require("../FilterAdder");

var _mobxUtils = require("../utils/mobx-utils");

var _search = require("../utils/search");

var _theme = require("../utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var FilterContents = function FilterContents(_ref) {
  var node = _ref.node,
      tree = _ref.tree,
      fields = _ref.fields,
      _ref$mapNodeToProps = _ref.mapNodeToProps,
      mapNodeToProps = _ref$mapNodeToProps === void 0 ? _fp["default"].noop : _ref$mapNodeToProps,
      _ref$theme = _ref.theme,
      Select = _ref$theme.Select,
      UnmappedNodeComponent = _ref$theme.UnmappedNodeComponent;
  // `get` allows us to create a mobx dependency on field before we know it
  // exists (because the client will only add it if it's a type that uses it
  // as it wouldn't make sense for something like `results`)
  var nodeField = (0, _mobxUtils.get)(node, 'field');
  var typeOptions = _fp["default"].get([nodeField, 'typeOptions'], fields) || [];
  if (node.type && !_fp["default"].includes(node.type, typeOptions)) typeOptions = [].concat(_toConsumableArray(typeOptions), [node.type]);
  var nodeLabel = _fp["default"].get([nodeField, 'label'], fields) || nodeField;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Grid, {
    columns: "auto auto minmax(0, 1fr)",
    style: {
      width: '100%'
    }
  }, /*#__PURE__*/_react["default"].createElement(_purgatory.ModalPicker, {
    label: nodeField ? nodeLabel : 'Pick a Field',
    options: (0, _FilterAdder.fieldsToOptions)(fields),
    onChange: function onChange(field) {
      return tree.replace(node.path, (0, _search.transformNodeFromField)({
        field: field,
        fields: fields
      }));
    }
  }), nodeField && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      margin: '0 5px'
    }
  }, /*#__PURE__*/_react["default"].createElement(Select, {
    onChange: function onChange(_ref2) {
      var type = _ref2.target.value;
      tree.replace(node.path, (0, _search.newNodeFromType)(type, fields, node));
    },
    placeholder: "Select Type",
    value: F.when(_fp["default"].isNil, undefined)(node.type) // fix null value issue...
    ,
    options: (0, _search.getTypeLabelOptions)(tree, typeOptions)
  })), node.type && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '100%',
      marginRight: '5px'
    }
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Dynamic, _objectSpread({
    component: UnmappedNodeComponent,
    tree: tree,
    node: node
  }, mapNodeToProps(node, fields)))));
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(FilterContents);

exports["default"] = _default;
//# sourceMappingURL=FilterContents.js.map