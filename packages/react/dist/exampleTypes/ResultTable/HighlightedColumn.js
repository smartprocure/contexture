"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

var _mobxReact = require("mobx-react");

var _schema = require("../../utils/schema");

var _theme = require("../../utils/theme");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var labelForField = function labelForField(schema, field) {
  return _fp["default"].getOr(field, 'label', _fp["default"].find({
    field: field
  }, schema));
};

var HighlightedColumn = function HighlightedColumn(_ref) {
  var node = _ref.node,
      _ref$results = _ref.results,
      results = _ref$results === void 0 ? _fp["default"].result('slice', (0, _schema.getResults)(node)) : _ref$results,
      _ref$additionalFields = _ref.additionalFields,
      additionalFields = _ref$additionalFields === void 0 ? _fp["default"].result('0.additionalFields.slice', results) : _ref$additionalFields,
      schema = _ref.schema,
      _ref$Cell = _ref.Cell,
      Cell = _ref$Cell === void 0 ? 'td' : _ref$Cell,
      _ref$theme = _ref.theme,
      Modal = _ref$theme.Modal,
      Table = _ref$theme.Table;

  var viewModal = _react["default"].useState(false);

  return _fp["default"].isEmpty(additionalFields) ? /*#__PURE__*/_react["default"].createElement(Cell, {
    key: "additionalFields"
  }) : /*#__PURE__*/_react["default"].createElement(Cell, {
    key: "additionalFields"
  }, /*#__PURE__*/_react["default"].createElement(Modal, {
    open: viewModal
  }, /*#__PURE__*/_react["default"].createElement("h3", null, "Other Matching Fields"), /*#__PURE__*/_react["default"].createElement(Table, null, /*#__PURE__*/_react["default"].createElement("tbody", null, _fp["default"].map(function (_ref2) {
    var label = _ref2.label,
        value = _ref2.value;
    return /*#__PURE__*/_react["default"].createElement("tr", {
      key: label
    }, /*#__PURE__*/_react["default"].createElement("td", null, labelForField(schema, label)), /*#__PURE__*/_react["default"].createElement("td", {
      dangerouslySetInnerHTML: {
        __html: value
      }
    }));
  }, additionalFields)))), /*#__PURE__*/_react["default"].createElement("button", {
    className: "gv-link-button",
    onClick: function onClick(e) {
      e.preventDefault();
      F.on(viewModal)();
    }
  }, "Matched ", _fp["default"].size(additionalFields), " other field(s)"));
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(HighlightedColumn);

exports["default"] = _default;
//# sourceMappingURL=HighlightedColumn.js.map