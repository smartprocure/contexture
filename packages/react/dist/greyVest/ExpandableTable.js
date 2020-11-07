"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Column = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _DropdownItem = require("./DropdownItem");

var _Popover = _interopRequireDefault(require("./Popover"));

var _Icon = _interopRequireDefault(require("./Icon"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Column = _fp["default"].identity;
exports.Column = Column;
Column.displayName = 'Column';
var ExpandedSection = (0, _mobxReact.observer)(function (_ref) {
  var columnCount = _ref.columnCount,
      expandedRow = _ref.expandedRow;
  return _fp["default"].getOr(null, 'details.Component', expandedRow) && /*#__PURE__*/_react["default"].createElement("tr", {
    align: "center"
  }, /*#__PURE__*/_react["default"].createElement("td", {
    colSpan: columnCount
  }, expandedRow.details.Component(_fp["default"].get(expandedRow.field, expandedRow.record), expandedRow.record)));
});

var TableBodyState = function TableBodyState() {
  var state = {
    expanded: (0, _mobx.observable)(new Map()),
    onClick: function onClick(field, keyField, record, index, details) {
      var key = record[keyField];
      var indexedField = "".concat(field).concat(index);

      if (_fp["default"].get('indexedField', state.expanded.get(key)) !== indexedField) {
        state.expanded.set(key, {
          key: key,
          record: record,
          field: field,
          indexedField: indexedField,
          details: details
        });
      } else {
        state.expanded["delete"](key);
      }
    }
  };
  return state;
};

var TableBody = (0, _mobxReact.inject)(TableBodyState)((0, _mobxReact.observer)(function (_ref2) {
  var data = _ref2.data,
      columns = _ref2.columns,
      recordKey = _ref2.recordKey,
      expanded = _ref2.expanded,
      _onClick = _ref2.onClick;
  return /*#__PURE__*/_react["default"].createElement("tbody", null, _fp["default"].map(function (x) {
    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
      key: x[recordKey]
    }, /*#__PURE__*/_react["default"].createElement("tr", _extends({}, x.rowAttrs, {
      key: x[recordKey],
      className: _fp["default"].getOr('', 'rowAttrs.className', x) + (expanded.has(x[recordKey]) ? 'expanded' : '')
    }), F.mapIndexed(function (_ref3, i) {
      var field = _ref3.field,
          _ref3$display = _ref3.display,
          display = _ref3$display === void 0 ? function (x) {
        return x;
      } : _ref3$display,
          _ref3$details = _ref3.details,
          details = _ref3$details === void 0 ? {} : _ref3$details;
      return /*#__PURE__*/_react["default"].createElement("td", _extends({
        key: "".concat(field).concat(i)
      }, !_fp["default"].isEmpty(details) && {
        style: {
          cursor: !_fp["default"].isEmpty(details) ? 'pointer' : 'auto'
        },
        onClick: function onClick() {
          return _onClick(field, recordKey, x, i, details, expanded);
        }
      }), _fp["default"].getOr(display, "".concat(_fp["default"].isEqual(_fp["default"].get('indexedField', expanded.get(x[recordKey])), "".concat(field).concat(i)) ? 'collapse' : 'expand', ".display"), details)(_fp["default"].get(field, x), x));
    }, columns)), expanded.has(x[recordKey]) && /*#__PURE__*/_react["default"].createElement(ExpandedSection, {
      expandedRow: expanded.get(x[recordKey]),
      columnCount: columns.length
    }));
  }, data));
}));

var TableState = function TableState(stores, props) {
  return {
    columns: _fp["default"].map(function (_ref4) {
      var props = _ref4.props;
      return _objectSpread(_objectSpread({}, _fp["default"].pick(['field', 'label', 'display', 'enableSort'], props)), {}, {
        details: F.compactObject(_objectSpread(_objectSpread({}, _fp["default"].pick(['expand', 'collapse'], props)), {}, {
          Component: props.children
        }))
      });
    }, _fp["default"].castArray(props.children))
  };
};

var ExpandableTable = (0, _mobxReact.inject)(TableState)((0, _mobxReact.observer)(function (_ref5) {
  var data = _ref5.data,
      columns = _ref5.columns,
      _ref5$recordKey = _ref5.recordKey,
      recordKey = _ref5$recordKey === void 0 ? 'key' : _ref5$recordKey,
      _ref5$columnSort = _ref5.columnSort,
      columnSort = _ref5$columnSort === void 0 ? _fp["default"].identity : _ref5$columnSort,
      props = _objectWithoutProperties(_ref5, ["data", "columns", "recordKey", "columnSort"]);

  return /*#__PURE__*/_react["default"].createElement("table", props.tableAttrs, /*#__PURE__*/_react["default"].createElement("thead", null, /*#__PURE__*/_react["default"].createElement("tr", null, F.mapIndexed(function (c, i) {
    return /*#__PURE__*/_react["default"].createElement("th", _extends({
      key: "".concat(c.field).concat(i)
    }, c.enableSort && {
      style: {
        cursor: 'pointer'
      }
    }), /*#__PURE__*/_react["default"].createElement("div", {
      className: "shadow"
    }), /*#__PURE__*/_react["default"].createElement("span", null, F.callOrReturn(_fp["default"].getOr(F.autoLabel(c.field), 'label', c)), c.enableSort && /*#__PURE__*/_react["default"].createElement(_Popover["default"], {
      trigger: /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        icon: "TableColumnMenu"
      }),
      position: "bottom ".concat(i === columns.length - 1 ? 'right' : 'center'),
      style: {
        userSelect: 'none',
        width: 'auto'
      }
    }, /*#__PURE__*/_react["default"].createElement(_DropdownItem.DropdownItem, {
      onClick: function onClick() {
        c.sortDir = 'asc';
        columnSort(c);
      }
    }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
      icon: "SortAscending"
    }), "Sort Ascending"), /*#__PURE__*/_react["default"].createElement(_DropdownItem.DropdownItem, {
      onClick: function onClick() {
        c.sortDir = 'desc';
        columnSort(c);
      }
    }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
      icon: "SortDescending"
    }), "Sort Descending"))));
  }, columns))), /*#__PURE__*/_react["default"].createElement(TableBody, {
    columns: columns,
    data: data,
    recordKey: recordKey
  }));
}));
ExpandableTable.displayName = 'ExpandableTable';
var _default = ExpandableTable;
exports["default"] = _default;
//# sourceMappingURL=ExpandableTable.js.map