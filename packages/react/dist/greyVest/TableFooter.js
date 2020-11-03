"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _Pager = _interopRequireDefault(require("./Pager"));

var _PagerItem = _interopRequireDefault(require("./PagerItem"));

var _PageSize = _interopRequireDefault(require("./PageSize"));

var _Flex = _interopRequireDefault(require("./Flex"));

var _format = require("../utils/format");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var PageDetails = function PageDetails(_ref) {
  var startRecord = _ref.startRecord,
      endRecord = _ref.endRecord,
      totalRecords = _ref.totalRecords,
      hasMore = _ref.hasMore;
  return /*#__PURE__*/_react["default"].createElement("span", {
    style: {
      flex: '0 1 30%',
      textAlign: 'right'
    }
  }, /*#__PURE__*/_react["default"].createElement("b", null, "Showing "), startRecord >= endRecord ? endRecord : "".concat((0, _format.toNumber)(startRecord), "-").concat((0, _format.toNumber)(endRecord)), _futil["default"].isNotNil(totalRecords) && " of ".concat((0, _format.toNumber)(totalRecords)).concat(hasMore ? '+' : ''));
}; // Requires either `totalRecords` or `hasMore` to do pagination properly.
// `hasMore` is a flag signifying that there is at least one page of records
// after the current one; it allows us to support some pagination functionality
// even when `totalRecords` is not given (eg. for APIs that return paginated
// results without a total count).


var TableFooter = function TableFooter(_ref2) {
  var _ref2$page = _ref2.page,
      page = _ref2$page === void 0 ? 1 : _ref2$page,
      onChangePage = _ref2.onChangePage,
      pageSize = _ref2.pageSize,
      onChangePageSize = _ref2.onChangePageSize,
      pageSizeOptions = _ref2.pageSizeOptions,
      hasMore = _ref2.hasMore,
      totalRecords = _ref2.totalRecords,
      _ref2$startRecord = _ref2.startRecord,
      startRecord = _ref2$startRecord === void 0 ? pageSize * (page - 1) + 1 : _ref2$startRecord,
      _ref2$endRecord = _ref2.endRecord,
      endRecord = _ref2$endRecord === void 0 ? hasMore ? page * pageSize : 0 : _ref2$endRecord,
      props = _objectWithoutProperties(_ref2, ["page", "onChangePage", "pageSize", "onChangePageSize", "pageSizeOptions", "hasMore", "totalRecords", "startRecord", "endRecord"]);

  // if endRecord isn't given, approximate it from totalRecords
  if (totalRecords) endRecord = endRecord || _fp["default"].min([page * pageSize, totalRecords]);
  if (!hasMore && !totalRecords) totalRecords = endRecord;

  var pageCount = _fp["default"].ceil((totalRecords || endRecord) / pageSize);

  return /*#__PURE__*/_react["default"].createElement(_Flex["default"], _extends({
    justifyContent: "space-between",
    alignItems: "center",
    style: {
      padding: '3px 8px'
    }
  }, props), /*#__PURE__*/_react["default"].createElement(_PageSize["default"], {
    sizeOptions: pageSizeOptions,
    value: pageSize,
    onChange: onChangePageSize,
    style: {
      flex: '0 1 30%'
    }
  }), /*#__PURE__*/_react["default"].createElement(_Flex["default"], {
    style: {
      flex: 1
    },
    alignItems: "center",
    justifyContent: "center"
  }, /*#__PURE__*/_react["default"].createElement(_Pager["default"], {
    value: page,
    onChange: onChangePage,
    pageCount: pageCount
  }), hasMore && page >= pageCount && /*#__PURE__*/_react["default"].createElement(_PagerItem["default"], {
    style: {
      margin: '0 8px',
      paddingLeft: 12,
      paddingRight: 12
    },
    onClick: function onClick() {
      return onChangePage(page + 1);
    }
  }, "Load More...")), /*#__PURE__*/_react["default"].createElement(PageDetails, {
    totalRecords: totalRecords,
    startRecord: startRecord,
    endRecord: endRecord,
    hasMore: hasMore
  }));
};

var _default = TableFooter;
exports["default"] = _default;
//# sourceMappingURL=TableFooter.js.map