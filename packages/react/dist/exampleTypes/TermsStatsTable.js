"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _hoc = require("../utils/hoc");

var _theme = require("../utils/theme");

var _greyVest = require("../greyVest/");

var _recompose = require("recompose");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var toolBarStyle = {
  justifyContent: 'space-between',
  alignItems: 'center'
};

var SimpleLabel = function SimpleLabel(_ref) {
  var text = _ref.text;
  return /*#__PURE__*/_react["default"].createElement("label", {
    style: {
      paddingRight: '5px'
    }
  }, text);
};

var SimpleFilter = _fp["default"].flow((0, _recompose.setDisplayName)('SimpleFilter'), _mobxReact.observer, _theme.withTheme)(function (_ref2) {
  var TextInput = _ref2.theme.TextInput,
      props = _objectWithoutProperties(_ref2, ["theme"]);

  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: _objectSpread(_objectSpread({}, toolBarStyle), {}, {
      width: '75%'
    })
  }, /*#__PURE__*/_react["default"].createElement(SimpleLabel, {
    text: "Filter:"
  }), /*#__PURE__*/_react["default"].createElement(TextInput, props));
});

var SelectSize = _fp["default"].flow((0, _recompose.setDisplayName)('SelectSize'), _mobxReact.observer, _theme.withTheme)(function (_ref3) {
  var node = _ref3.node,
      tree = _ref3.tree,
      _ref3$options = _ref3.options,
      options = _ref3$options === void 0 ? [10, 25, 50, 100, 500, 1000] : _ref3$options,
      Select = _ref3.theme.Select;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: _objectSpread({
      marginLeft: 12
    }, toolBarStyle)
  }, /*#__PURE__*/_react["default"].createElement(SimpleLabel, {
    text: "Size:"
  }), /*#__PURE__*/_react["default"].createElement(Select, {
    onChange: function onChange(e) {
      tree.mutate(node.path, {
        size: e.target.value
      });
    },
    value: _fp["default"].getOr(25, 'size', node),
    placeholder: null,
    style: {
      width: '100px'
    },
    options: _fp["default"].map(function (x) {
      return {
        value: x,
        label: x
      };
    }, options)
  }));
});

var TermsStatsTable = function TermsStatsTable(_ref4) {
  var node = _ref4.node,
      criteria = _ref4.criteria,
      criteriaField = _ref4.criteriaField,
      _ref4$criteriaFieldLa = _ref4.criteriaFieldLabel,
      criteriaFieldLabel = _ref4$criteriaFieldLa === void 0 ? '' : _ref4$criteriaFieldLa,
      _ref4$criteriaGetValu = _ref4.criteriaGetValue,
      criteriaGetValue = _ref4$criteriaGetValu === void 0 ? _fp["default"].identity : _ref4$criteriaGetValu,
      tree = _ref4.tree,
      children = _ref4.children,
      sizeOptions = _ref4.sizeOptions,
      Button = _ref4.theme.Button,
      props = _objectWithoutProperties(_ref4, ["node", "criteria", "criteriaField", "criteriaFieldLabel", "criteriaGetValue", "tree", "children", "sizeOptions", "theme"]);

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: _objectSpread(_objectSpread({}, toolBarStyle), {}, {
      margin: '0 8px'
    })
  }, /*#__PURE__*/_react["default"].createElement(SimpleFilter, _futil["default"].domLens.value(tree.lens(node.path, 'filter'))), /*#__PURE__*/_react["default"].createElement(SelectSize, {
    node: node,
    tree: tree,
    options: sizeOptions
  })), /*#__PURE__*/_react["default"].createElement(_greyVest.ExpandableTable, _extends({}, _objectSpread(_objectSpread({}, props), {}, {
    children: criteria ? [].concat(_toConsumableArray(_fp["default"].compact(children)), [/*#__PURE__*/_react["default"].createElement(_greyVest.Column, {
      label: criteriaFieldLabel,
      expand: {
        display: function display(value, record) {
          return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(Button, {
            onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
              var field, filter;
              return regeneratorRuntime.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      field = criteriaField || node.key_field;
                      filter = criteria && _fp["default"].find({
                        field: field
                      }, tree.getNode(criteria).children);

                      if (!(!filter || _fp["default"].get('mode', filter) === 'exclude')) {
                        _context.next = 6;
                        break;
                      }

                      _context.next = 5;
                      return tree.add(criteria, {
                        field: field,
                        type: 'facet'
                      });

                    case 5:
                      filter = _fp["default"].findLast({
                        field: field
                      }, tree.getNode(criteria).children);

                    case 6:
                      _context.next = 8;
                      return tree.mutate(filter.path, {
                        mode: 'include',
                        values: _fp["default"].uniq([].concat(_toConsumableArray(_fp["default"].getOr([], 'values', filter)), [criteriaGetValue(record.key)]))
                      });

                    case 8:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            }))
          }, "Add as Filter"));
        }
      }
    })]) : _fp["default"].compact(children)
  }), {
    data: node.context.terms,
    sortField: node.order,
    sortDir: node.sortDir,
    columnSort: function columnSort(column) {
      if (column.field !== 'key' && column.enableSort) {
        tree.mutate(node.path, {
          order: column.field,
          sortDir: column.sortDir
        });
      }
    }
  })));
};

var _default = (0, _hoc.contexturify)(TermsStatsTable);

exports["default"] = _default;
//# sourceMappingURL=TermsStatsTable.js.map