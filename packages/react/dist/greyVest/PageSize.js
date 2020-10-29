"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _PagerItem = _interopRequireDefault(require("./PagerItem"));

var _Flex = _interopRequireDefault(require("./Flex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var PageSize = function PageSize(_ref) {
  var value = _ref.value,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
      _ref$sizeOptions = _ref.sizeOptions,
      sizeOptions = _ref$sizeOptions === void 0 ? [10, 20, 50, 100, 250] : _ref$sizeOptions,
      _ref$PagerItem = _ref.PagerItem,
      PagerItem = _ref$PagerItem === void 0 ? _PagerItem["default"] : _ref$PagerItem,
      props = _objectWithoutProperties(_ref, ["value", "onChange", "sizeOptions", "PagerItem"]);

  return /*#__PURE__*/_react["default"].createElement(_Flex["default"], _extends({
    alignItems: "baseline"
  }, props), /*#__PURE__*/_react["default"].createElement("span", {
    css: {
      marginRight: 4,
      fontWeight: 'bold'
    }
  }, "View"), _fp["default"].map(function (size) {
    return /*#__PURE__*/_react["default"].createElement(PagerItem, {
      key: size,
      active: size === value,
      onClick: function onClick() {
        return onChange(size);
      },
      css: {
        margin: 2
      }
    }, size);
  }, _fp["default"].flow(_fp["default"].concat(value), _fp["default"].sortBy(_fp["default"].identity), _fp["default"].sortedUniq)(sizeOptions)));
};

var _default = PageSize;
exports["default"] = _default;
//# sourceMappingURL=PageSize.js.map