"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _greyVest = require("../greyVest");

var _hoc = require("../utils/hoc");

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var allRollingOpts = [{
  type: 'all',
  range: 'allDates'
}, {
  type: 'all',
  range: 'allPastDates'
}, {
  type: 'all',
  range: 'allFutureDates'
}, {
  type: 'past',
  range: 'last3Days'
}, {
  type: 'past',
  range: 'last7Days'
}, {
  type: 'past',
  range: 'last30Days'
}, {
  type: 'past',
  range: 'last90Days'
}, {
  type: 'past',
  range: 'last180Days'
}, {
  type: 'past',
  range: 'last12Months'
}, {
  type: 'past',
  range: 'last15Months'
}, {
  type: 'past',
  range: 'last18Months'
}, {
  type: 'past',
  range: 'last24Months'
}, {
  type: 'past',
  range: 'last36Months'
}, {
  type: 'past',
  range: 'last48Months'
}, {
  type: 'past',
  range: 'last60Months'
}, {
  type: 'past',
  range: 'lastCalendarMonth'
}, {
  type: 'past',
  range: 'lastCalendarQuarter'
}, {
  type: 'past',
  range: 'lastCalendarYear'
}, {
  type: 'present',
  range: 'thisCalendarMonth'
}, {
  type: 'present',
  range: 'thisCalendarQuarter'
}, {
  type: 'present',
  range: 'thisCalendarYear'
}, {
  type: 'future',
  range: 'nextCalendarMonth'
}, {
  type: 'future',
  range: 'nextCalendarQuarter'
}, {
  type: 'future',
  range: 'nextCalendarYear'
}, {
  type: 'future',
  range: 'next30Days'
}, {
  type: 'future',
  range: 'next60Days'
}, {
  type: 'future',
  range: 'next90Days'
}, {
  type: 'future',
  range: 'next6Months'
}, {
  type: 'future',
  range: 'next12Months'
}, {
  type: 'future',
  range: 'next24Months'
}, {
  type: 'future',
  range: 'next36Months'
}];

var endOfDay = function endOfDay(date) {
  return (0, _moment["default"])(date).endOf('day').toDate();
};

var DateComponent = function DateComponent(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      _ref$excludeRollingRa = _ref.excludeRollingRanges,
      excludeRollingRanges = _ref$excludeRollingRa === void 0 ? [] : _ref$excludeRollingRa,
      _ref$theme = _ref.theme,
      DateInput = _ref$theme.DateInput,
      RadioList = _ref$theme.RadioList,
      Select = _ref$theme.Select;

  var _React$useState = _react["default"].useState(node.range === 'exact' || !node.range ? 'exact' : 'rolling'),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      dateType = _React$useState2[0],
      setDateType = _React$useState2[1];

  var rollingOpts = _fp["default"].reject(function (opt) {
    return _fp["default"].includes(opt.type, excludeRollingRanges);
  }, allRollingOpts);

  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(RadioList, {
    options: _futil["default"].autoLabelOptions(['exact', 'rolling']),
    value: dateType,
    style: {
      marginBottom: 10
    },
    onChange: function onChange(value) {
      tree.mutate(node.path, value === 'exact' ? {
        range: 'exact',
        from: null,
        to: null
      } : {
        range: '',
        from: null,
        to: null
      });
      setDateType(value);
    }
  }), dateType === 'exact' && /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/_react["default"].createElement(DateInput, {
    value: node.from,
    onChange: function onChange(date) {
      return tree.mutate(node.path, {
        range: 'exact',
        from: date
      });
    }
  }), /*#__PURE__*/_react["default"].createElement("div", null, "-"), /*#__PURE__*/_react["default"].createElement(DateInput, {
    value: node.to,
    onChange: function onChange(date) {
      return tree.mutate(node.path, {
        range: 'exact',
        to: endOfDay(date)
      });
    }
  })), dateType === 'rolling' && /*#__PURE__*/_react["default"].createElement(Select, {
    value: node.range,
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        range: e.target.value,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      });
    },
    options: _futil["default"].map(function (_ref2) {
      var range = _ref2.range;
      return {
        label: _fp["default"].startCase(range),
        value: range,
        selected: node.range === range
      };
    }, rollingOpts)
  }));
};

var _default = (0, _hoc.contexturifyWithoutLoader)(DateComponent);

exports["default"] = _default;
//# sourceMappingURL=Date.js.map