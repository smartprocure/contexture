"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _lodash = require("lodash");

var _greyVest = require("../greyVest");

var _hoc = require("../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var NumberComponent = function NumberComponent(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      _ref$showBestRange = _ref.showBestRange,
      showBestRange = _ref$showBestRange === void 0 ? false : _ref$showBestRange,
      _ref$formatter = _ref.formatter,
      formatter = _ref$formatter === void 0 ? _fp["default"].identity : _ref$formatter,
      significantDigits = _ref.significantDigits,
      _ref$theme = _ref.theme,
      NumberInput = _ref$theme.NumberInput,
      Button = _ref$theme.Button;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "contexture-number"
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react["default"].createElement(NumberInput, {
    value: formatter(node.min) || '',
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        min: _fp["default"].isNumber(significantDigits) ? _fp["default"].toString((0, _lodash.round)(e.target.value, significantDigits)) : e.target.value
      });
    }
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "contexture-number-separator"
  }, "-"), /*#__PURE__*/_react["default"].createElement(NumberInput, {
    value: formatter(node.max) || '',
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        max: _fp["default"].isNumber(significantDigits) ? _fp["default"].toString((0, _lodash.round)(e.target.value, significantDigits)) : e.target.value
      });
    }
  })), showBestRange && /*#__PURE__*/_react["default"].createElement("div", {
    className: "contexture-number-best-range"
  }, /*#__PURE__*/_react["default"].createElement(Button, {
    style: {
      width: '100%'
    },
    onClick: /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _$get, min, max;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return tree.mutate(node.path, {
                findBestRange: true
              });

            case 2:
              _$get = _fp["default"].get('context.bestRange', node), min = _$get.min, max = _$get.max;

              if (_fp["default"].isNumber(significantDigits)) {
                min = (0, _lodash.round)(min, significantDigits);
                max = (0, _lodash.round)(max, significantDigits);
              } // Disable best range so the calculation isn't run anymore


              tree.mutate(node.path, {
                findBestRange: false,
                min: min,
                max: max
              });

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))
  }, "Find best range")));
};

NumberComponent.displayName = 'Number';

var _default = (0, _hoc.contexturify)(NumberComponent);

exports["default"] = _default;
//# sourceMappingURL=Number.js.map