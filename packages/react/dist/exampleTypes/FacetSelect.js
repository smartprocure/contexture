"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _Async = _interopRequireDefault(require("react-select/lib/Async"));

var _reactSelect = require("react-select");

var _greyVest = require("../greyVest");

var _hoc = require("../utils/hoc");

var _facet = require("../utils/facet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getOptions = function getOptions(node) {
  return _fp["default"].map(function (_ref) {
    var name = _ref.name,
        count = _ref.count;
    return _objectSpread(_objectSpread({}, _futil["default"].autoLabelOption(name)), {}, {
      count: count
    });
  }, _fp["default"].get('context.options', node));
};

var FacetSelect = function FacetSelect(_ref2) {
  var tree = _ref2.tree,
      node = _ref2.node,
      _ref2$hide = _ref2.hide,
      hide = _ref2$hide === void 0 ? {
    counts: false // Hide the facet counts so only the labels are displayed

  } : _ref2$hide,
      _ref2$singleValue = _ref2.singleValue,
      singleValue = _ref2$singleValue === void 0 ? false : _ref2$singleValue,
      _ref2$display = _ref2.display,
      display = _ref2$display === void 0 ? function (x) {
    return x;
  } : _ref2$display,
      _ref2$formatCount = _ref2.formatCount,
      formatCount = _ref2$formatCount === void 0 ? function (x) {
    return x;
  } : _ref2$formatCount,
      _ref2$displayBlank = _ref2.displayBlank,
      displayBlank = _ref2$displayBlank === void 0 ? function () {
    return /*#__PURE__*/_react["default"].createElement("i", null, "Not Specified");
  } : _ref2$displayBlank,
      RadioList = _ref2.theme.RadioList;

  var MenuList = function MenuList(props) {
    return /*#__PURE__*/_react["default"].createElement(_reactSelect.components.MenuList, props, !!node.context.cardinality && /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        boxShadow: '0 2px 2px -2px #CCC',
        fontSize: '0.9em',
        padding: '0 10px 1px',
        marginBottom: 4,
        opacity: 0.8
      }
    }, /*#__PURE__*/_react["default"].createElement(_facet.Cardinality, {
      node: node,
      tree: tree
    })), props.children);
  };

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "contexture-facet-select"
  }, /*#__PURE__*/_react["default"].createElement(RadioList, {
    value: node.mode || 'include',
    onChange: function onChange(mode) {
      return tree.mutate(node.path, {
        mode: mode
      });
    },
    options: _futil["default"].autoLabelOptions(['include', 'exclude'])
  }), /*#__PURE__*/_react["default"].createElement(_Async["default"], {
    placeholder: "Search...",
    isMulti: !singleValue,
    cacheOptions: true,
    defaultOptions: getOptions(node),
    loadOptions: /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(val) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return tree.mutate(node.path, {
                  optionsFilter: val
                });

              case 2:
                return _context.abrupt("return", getOptions(node));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }(),
    formatOptionLabel: function formatOptionLabel(_ref4, _ref5) {
      var label = _ref4.label,
          count = _ref4.count;
      var context = _ref5.context;
      return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
        justifyContent: "space-between"
      }, /*#__PURE__*/_react["default"].createElement("span", null, display(label) || displayBlank()), context === 'menu' && !hide.counts && /*#__PURE__*/_react["default"].createElement("span", null, formatCount(count)));
    },
    onChange: function onChange(x) {
      return tree.mutate(node.path, {
        values: _fp["default"].map('value', x)
      });
    },
    components: {
      MenuList: MenuList
    }
  }));
};

var _default = (0, _hoc.contexturify)(FacetSelect);

exports["default"] = _default;
//# sourceMappingURL=FacetSelect.js.map