"use strict";

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _testTree = _interopRequireDefault(require("./stories/testTree"));

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(0, _react2.storiesOf)('ExampleTypes|CheckableResultTable', module).addDecorator((0, _themePicker["default"])('greyVest')).add('With selected prop', function () {
  var selected = _react["default"].useState([]);

  return /*#__PURE__*/_react["default"].createElement("div", null, "Selected: ", JSON.stringify(_futil["default"].view(selected)), /*#__PURE__*/_react["default"].createElement(_.CheckableResultTable, {
    tree: (0, _testTree["default"])(),
    path: ['results'],
    selected: selected,
    getValue: "_id",
    fields: {
      _id: true,
      title: true,
      nested: {
        label: 'Nested Value',
        display: function display(x) {
          return x.value;
        }
      }
    }
  }));
}).add('With selectedValues/onChange props', function () {
  var _React$useState = _react["default"].useState([]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      selectedValues = _React$useState2[0],
      onChange = _React$useState2[1];

  return /*#__PURE__*/_react["default"].createElement("div", null, "Selected: ", JSON.stringify(selectedValues), /*#__PURE__*/_react["default"].createElement(_.CheckableResultTable, _extends({
    tree: (0, _testTree["default"])(),
    path: ['results']
  }, {
    selectedValues: selectedValues,
    onChange: onChange
  }, {
    getValue: "_id",
    fields: {
      _id: true,
      title: true,
      nested: {
        label: 'Nested Value',
        display: function display(x) {
          return x.value;
        }
      }
    }
  })));
});
//# sourceMappingURL=CheckableResultTable.stories.js.map