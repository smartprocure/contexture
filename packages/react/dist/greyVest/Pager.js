"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _PagerItem = _interopRequireDefault(require("./PagerItem"));

var _Icon = _interopRequireDefault(require("./Icon"));

var _Flex = _interopRequireDefault(require("./Flex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Pager = function Pager(_ref) {
  var value = _ref.value,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? function () {} : _ref$onChange,
      pageCount = _ref.pageCount,
      _ref$PagerItem = _ref.PagerItem,
      PagerItem = _ref$PagerItem === void 0 ? _PagerItem["default"] : _ref$PagerItem,
      _ref$Icon = _ref.Icon,
      Icon = _ref$Icon === void 0 ? _Icon["default"] : _ref$Icon;
  return pageCount > 1 && /*#__PURE__*/_react["default"].createElement(_Flex["default"], {
    justifyContent: "center",
    alignItems: "center"
  }, /*#__PURE__*/_react["default"].createElement(PagerItem, {
    disabled: !(value > 1),
    onClick: function onClick() {
      return onChange(value - 1);
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "PreviousPage"
  })), value > 3 && /*#__PURE__*/_react["default"].createElement(PagerItem, {
    onClick: function onClick() {
      return onChange(_fp["default"].max([0, value - 5]));
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "Previous5Pages"
  })), _fp["default"].reverse(_fp["default"].times(function (n) {
    return value > n + 1 && /*#__PURE__*/_react["default"].createElement(PagerItem, {
      key: "prev".concat(n),
      onClick: function onClick() {
        return onChange(value - (n + 1));
      }
    }, value - (n + 1));
  }, 2)), /*#__PURE__*/_react["default"].createElement(PagerItem, {
    active: true
  }, value), _fp["default"].times(function (n) {
    return value + (n + 1) <= pageCount && /*#__PURE__*/_react["default"].createElement(PagerItem, {
      key: "next".concat(n),
      onClick: function onClick() {
        return onChange(value + (n + 1));
      }
    }, value + (n + 1));
  }, 2), value + 2 < pageCount && /*#__PURE__*/_react["default"].createElement(PagerItem, {
    onClick: function onClick() {
      return onChange(_fp["default"].min([pageCount, value + 5]));
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "Next5Pages"
  })), /*#__PURE__*/_react["default"].createElement(PagerItem, {
    disabled: !(value < pageCount),
    onClick: function onClick() {
      return onChange(value + 1);
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "NextPage"
  })));
};

var _default = Pager;
exports["default"] = _default;
//# sourceMappingURL=Pager.js.map