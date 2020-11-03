"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.fieldsToOptions = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _hoc = require("./utils/hoc");

var _search = require("./utils/search");

var _purgatory = require("./purgatory");

var _greyVest = require("./greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var fieldsToOptions = _fp["default"].map(function (x) {
  return _objectSpread({
    value: x.field
  }, x);
});

exports.fieldsToOptions = fieldsToOptions;

var getGroupFields = function getGroupFields(node) {
  return _fp["default"].map('field', _fp["default"].getOr([], 'children', node));
};

var FilterAdder = function FilterAdder(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      path = _ref.path,
      fields = _ref.fields,
      uniqueFields = _ref.uniqueFields,
      _ref$Picker = _ref.Picker,
      Picker = _ref$Picker === void 0 ? _purgatory.ModalPicker : _ref$Picker,
      Icon = _ref.theme.Icon;
  var options = fieldsToOptions(fields);

  if (uniqueFields) {
    options = _fp["default"].reject(function (x) {
      return _fp["default"].includes(x.field, getGroupFields(node));
    }, options);
  }

  var Label = /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    justifyContent: "center",
    alignItems: "center"
  }, "Add Custom Filter", /*#__PURE__*/_react["default"].createElement(Icon, {
    style: {
      paddingLeft: 5
    },
    icon: "FilterAdd"
  }));

  return /*#__PURE__*/_react["default"].createElement(Picker, {
    options: options,
    onChange: function onChange(field) {
      return tree.add(path, (0, _search.newNodeFromField)({
        field: field,
        fields: fields
      }));
    },
    label: Label,
    blockButton: true
  });
};

var _default = (0, _hoc.contexturifyWithoutLoader)(FilterAdder);

exports["default"] = _default;
//# sourceMappingURL=FilterAdder.js.map