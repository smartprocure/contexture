"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _greyVest = require("../greyVest");

var _hoc = require("../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var customStyles = {
  valueContainer: function valueContainer(styles) {
    return _objectSpread(_objectSpread({}, styles), {
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    });
  }
};
var elementStyle = {
  flex: 1,
  marginBottom: '5px'
};
var operatorOptions = ['within', 'not within'];

var GeoComponent = function GeoComponent(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      loadOptions = _ref.loadOptions,
      _ref$GeoCodeLocation = _ref.GeoCodeLocation,
      GeoCodeLocation = _ref$GeoCodeLocation === void 0 ? _fp["default"].noop : _ref$GeoCodeLocation,
      _ref$AutoComplete = _ref.AutoComplete,
      AutoComplete = _ref$AutoComplete === void 0 ? null : _ref$AutoComplete,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? 'Address ...' : _ref$placeholder,
      _ref$theme = _ref.theme,
      Select = _ref$theme.Select,
      NumberInput = _ref$theme.NumberInput;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      flexFlow: 'column'
    }
  }, /*#__PURE__*/_react["default"].createElement(Select, {
    style: elementStyle,
    value: node.operator,
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        operator: e.target.value
      });
    },
    options: _futil["default"].autoLabelOptions(operatorOptions)
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: elementStyle
  }, /*#__PURE__*/_react["default"].createElement(NumberInput, {
    min: "1",
    value: node.radius,
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        radius: e.target.value
      });
    },
    placeholder: "Enter number of miles ..."
  }), ' ', "from"), /*#__PURE__*/_react["default"].createElement("div", {
    style: elementStyle
  }, AutoComplete && /*#__PURE__*/_react["default"].createElement(AutoComplete, {
    cacheOptions: true,
    escapeClearsValue: true,
    defaultInputValue: node.location,
    placeholder: placeholder,
    noOptionsMessage: function noOptionsMessage() {
      return '';
    },
    menuPortalTarget: document.body,
    menuShouldScrollIntoView: true,
    styles: customStyles,
    loadOptions: loadOptions,
    onInputChange: function onInputChange(newValue) {
      return newValue.replace(/[^a-zA-Z0-9\s]+/g, '');
    },
    onChange: /*#__PURE__*/function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(_ref2) {
        var label, value, data;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                label = _ref2.label, value = _ref2.value;
                _context.next = 3;
                return GeoCodeLocation(value);

              case 3:
                data = _context.sent;

                if (data && data.latitude && data.longitude) {
                  tree.mutate(node.path, {
                    latitude: data.latitude,
                    longitude: data.longitude,
                    location: label
                  });
                }

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref3.apply(this, arguments);
      };
    }()
  }), !AutoComplete && /*#__PURE__*/_react["default"].createElement("div", null, "Autocomplete component is required!")));
};

var _default = (0, _hoc.contexturify)(GeoComponent);

exports["default"] = _default;
//# sourceMappingURL=Geo.js.map