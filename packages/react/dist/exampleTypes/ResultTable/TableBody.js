"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

var _schema = require("../../utils/schema");

var _HighlightedColumn = _interopRequireDefault(require("./HighlightedColumn"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

// Separate this our so that the table root doesn't create a dependency on results to headers won't need to rerender on data change
var TableBody = function TableBody(_ref) {
  var node = _ref.node,
      visibleFields = _ref.visibleFields,
      fields = _ref.fields,
      hiddenFields = _ref.hiddenFields,
      schema = _ref.schema,
      _ref$Row = _ref.Row,
      Row = _ref$Row === void 0 ? 'tr' : _ref$Row,
      _ref$getRowKey = _ref.getRowKey,
      getRowKey = _ref$getRowKey === void 0 ? _fp["default"].get('_id') : _ref$getRowKey,
      stickyFields = _ref.stickyFields;
  return /*#__PURE__*/_react["default"].createElement("tbody", null, !!(0, _schema.getResults)(node).length && _fp["default"].map(function (x) {
    return /*#__PURE__*/_react["default"].createElement(Row, _extends({
      key: getRowKey(x),
      record: (0, _schema.getRecord)(x)
    }, {
      fields: fields,
      visibleFields: visibleFields,
      hiddenFields: hiddenFields
    }), _fp["default"].map(function (_ref2) {
      var field = _ref2.field,
          _ref2$display = _ref2.display,
          display = _ref2$display === void 0 ? function (x) {
        return x;
      } : _ref2$display,
          _ref2$Cell = _ref2.Cell,
          Cell = _ref2$Cell === void 0 ? 'td' : _ref2$Cell;
      return /*#__PURE__*/_react["default"].createElement(Cell, {
        key: field,
        style: _fp["default"].contains(stickyFields, field) ? {
          position: 'sticky',
          left: 0,
          zIndex: 1,
          boxShadow: 'rgba(0, 0, 0, 0.1) 6px 0px 5px -5px'
        } : null
      }, display(_fp["default"].get(field, (0, _schema.getRecord)(x)), (0, _schema.getRecord)(x)));
    }, visibleFields), node.showOtherMatches && /*#__PURE__*/_react["default"].createElement(_HighlightedColumn["default"], {
      node: node,
      additionalFields: _fp["default"].result('additionalFields.slice', x),
      schema: schema
    }));
  }, (0, _schema.getResults)(node)));
};

var _default = (0, _mobxReact.observer)(TableBody);

exports["default"] = _default;
//# sourceMappingURL=TableBody.js.map