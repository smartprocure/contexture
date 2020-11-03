"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tabs = exports.Tab = exports.TabLabel = exports.TabContent = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _TabList = _interopRequireDefault(require("./TabList"));

var _Box = _interopRequireDefault(require("./Box"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

/* Usage */

/*
<Tabs tabControl={ButtonRadio} value="references">
  <Tab value="references" label="References">
    <PO Table />
  </Tab>
  <Tab label="Fancy Label">
  </Tab>
  <TabLabel value="option2">
    Option 2's Label
  </TabLabel>
  <TabContent value="option2">
    Option 2's Content
  </TabContent>
  <Tab value="functionTab" label="functionTab">
    {currentTab => <div>Function Tab Content</div>}
  </Tab>
</Tabs>
*/
var TabContent = function TabContent() {};

exports.TabContent = TabContent;

var TabLabel = function TabLabel() {};

exports.TabLabel = TabLabel;

var Tab = function Tab() {};

exports.Tab = Tab;

var Tabs = function Tabs(_ref) {
  var children = _ref.children,
      _ref$onChange = _ref.onChange,
      onChange = _ref$onChange === void 0 ? _fp["default"].noop : _ref$onChange,
      _ref$TabsList = _ref.TabsList,
      TabsList = _ref$TabsList === void 0 ? _TabList["default"] : _ref$TabsList,
      _ref$TabPanel = _ref.TabPanel,
      TabPanel = _ref$TabPanel === void 0 ? _Box["default"] : _ref$TabPanel,
      defaultValue = _ref.defaultValue,
      props = _objectWithoutProperties(_ref, ["children", "onChange", "TabsList", "TabPanel", "defaultValue"]);

  var childrenArray = _react["default"].Children.toArray(children);

  var options = _fp["default"].flow(_fp["default"].filter(function (child) {
    return child.type === Tab || child.type === TabLabel;
  }), _futil["default"].mapIndexed(function (_ref2, i) {
    var type = _ref2.type,
        props = _ref2.props;
    return {
      value: props.value || i,
      label: type === Tab ? props.label : props.children
    };
  }))(childrenArray);

  var _useState = (0, _react.useState)(defaultValue || options[0].value),
      _useState2 = _slicedToArray(_useState, 2),
      value = _useState2[0],
      setValue = _useState2[1]; // Allow controlled state


  if (!_fp["default"].isNil(props.value) && props.value !== value) setValue(props.value);

  var handleChange = function handleChange(to, from) {
    onChange(to, from);
    setValue(to);
  };

  var content = _fp["default"].flow(_fp["default"].filter.convert({
    cap: false
  })(function (_ref3, i) {
    var type = _ref3.type,
        props = _ref3.props;
    return (type === Tab || type === TabContent) && (value === props.value || value === i);
  }), _futil["default"].mapIndexed(function (_ref4, i) {
    var props = _ref4.props;
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
      key: i
    }, _futil["default"].callOrReturn(props.children, value));
  }))(childrenArray);

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(TabsList, {
    value: value,
    onChange: handleChange,
    options: options
  }), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: 'inline-block',
      minWidth: '100%'
    }
  }, /*#__PURE__*/_react["default"].createElement(TabPanel, null, content)));
};

exports.Tabs = Tabs;
//# sourceMappingURL=Tabs.js.map