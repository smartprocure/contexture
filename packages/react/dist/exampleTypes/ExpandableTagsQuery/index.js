"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _reactMeasure = require("react-measure");

var _hoc = require("../../utils/hoc");

var _TagsQuery = _interopRequireWildcard(require("../TagsQuery"));

var _ExpandArrow = _interopRequireDefault(require("./ExpandArrow"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var collapsedStyle = {
  maxHeight: _TagsQuery.innerHeight,
  overflowY: 'auto'
};

var ExpandableTagsQuery = function ExpandableTagsQuery(_ref) {
  var measureRef = _ref.measureRef,
      contentRect = _ref.contentRect,
      collapse = _ref.collapse,
      props = _objectWithoutProperties(_ref, ["measureRef", "contentRect", "collapse"]);

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    style: _futil["default"].view(collapse) ? collapsedStyle : {}
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: measureRef
  }, /*#__PURE__*/_react["default"].createElement(_TagsQuery["default"], _fp["default"].omit('measure', props)))), _futil["default"].view(collapse) && contentRect.entry.height > _TagsQuery.innerHeight && /*#__PURE__*/_react["default"].createElement(_ExpandArrow["default"], {
    collapse: collapse,
    tagsLength: props.node.tags.length
  }));
};

var _default = _fp["default"].flow(_hoc.contexturify, (0, _reactMeasure.withContentRect)())(ExpandableTagsQuery);

exports["default"] = _default;
//# sourceMappingURL=index.js.map