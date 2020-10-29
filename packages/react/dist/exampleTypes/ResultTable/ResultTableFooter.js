"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _TableFooter = _interopRequireDefault(require("../../greyVest/TableFooter"));

var _hoc = require("../../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ResultTableFooter = function ResultTableFooter(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      pageSizeOptions = _ref.pageSizeOptions;

  var getFromContext = function getFromContext(key) {
    return _futil["default"].cascade(["context.response.".concat(key), "context.".concat(key)], node);
  };

  return /*#__PURE__*/_react["default"].createElement(_TableFooter["default"], _extends({
    page: node.page || 1,
    onChangePage: function onChangePage(page) {
      return tree.mutate(node.path, {
        page: page
      });
    },
    pageSize: node.pageSize,
    onChangePageSize: function onChangePageSize(pageSize) {
      tree.mutate(node.path, {
        pageSize: pageSize,
        page: _fp["default"].ceil((getFromContext('startRecord') || 0) / pageSize) || 1
      });
    },
    pageSizeOptions: pageSizeOptions
  }, _futil["default"].arrayToObject(function (x) {
    return x;
  }, getFromContext, ['hasMore', 'totalRecords', 'startRecord', 'endRecord'])));
};

var _default = (0, _hoc.contexturifyWithoutLoader)(ResultTableFooter);

exports["default"] = _default;
//# sourceMappingURL=ResultTableFooter.js.map