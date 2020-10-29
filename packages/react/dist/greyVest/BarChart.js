"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

var _Flex = _interopRequireDefault(require("./Flex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var YAxis = function YAxis(_ref) {
  var height = _ref.height,
      borderColor = _ref.borderColor,
      min = _ref.min,
      max = _ref.max;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
    key: "legend",
    style: {
      height: height,
      margin: '0 5px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRight: "solid 1px ".concat(borderColor()),
      padding: '5px'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      borderTop: "solid 1px ".concat(borderColor()),
      textAlign: 'right'
    }
  }, max), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      borderBottom: "solid 1px ".concat(borderColor()),
      textAlign: 'right'
    }
  }, min)), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      padding: '5px'
    }
  }, "\xA0"));
};

var BarChart = function BarChart(_ref2) {
  var data = _ref2.data,
      valueField = _ref2.valueField,
      categoryField = _ref2.categoryField,
      _ref2$background = _ref2.background,
      background = _ref2$background === void 0 ? function () {
    return '#ccc';
  } : _ref2$background,
      _ref2$height = _ref2.height,
      height = _ref2$height === void 0 ? 100 : _ref2$height,
      _ref2$format = _ref2.format,
      format = _ref2$format === void 0 ? _fp["default"].identity : _ref2$format,
      _ref2$gutter = _ref2.gutter,
      gutter = _ref2$gutter === void 0 ? 5 : _ref2$gutter,
      _ref2$yAxis = _ref2.yAxis,
      yAxis = _ref2$yAxis === void 0 ? false : _ref2$yAxis;

  var values = _fp["default"].map(valueField, data);

  var max = _fp["default"].max(values);

  var min = _fp["default"].min(values);

  return /*#__PURE__*/_react["default"].createElement(_Flex["default"], {
    style: {
      alignItems: 'flex-end',
      justifyContent: 'center'
    }
  }, yAxis && !!data.length && /*#__PURE__*/_react["default"].createElement(YAxis, {
    min: min,
    max: max,
    height: height,
    borderColor: background
  }), _fp["default"].map(function (x) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      key: x.key
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        height: x[valueField] / max * height,
        background: background(x, max),
        margin: "0 ".concat(gutter, "px")
      },
      title: x[valueField]
    }, "\xA0"), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        padding: '5px'
      }
    }, format(x[categoryField])));
  }, data));
};

var _default = (0, _mobxReact.observer)(BarChart);

exports["default"] = _default;
//# sourceMappingURL=BarChart.js.map