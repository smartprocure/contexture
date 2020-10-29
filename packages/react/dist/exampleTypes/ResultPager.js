"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _futil = _interopRequireDefault(require("futil"));

var _react = _interopRequireDefault(require("react"));

var _hoc = require("../utils/hoc");

var _greyVest = require("../greyVest");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var ResultPager = function ResultPager(_ref) {
  var node = _ref.node,
      tree = _ref.tree,
      _ref$theme = _ref.theme,
      PagerItem = _ref$theme.PagerItem,
      Icon = _ref$theme.Icon;
  var pages = Math.ceil(_futil["default"].cascade(['response.totalRecords', 'totalRecords'], node.context, 1) / node.pageSize);
  var page = node.page || 1;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Pager, _extends({
    value: page,
    pageCount: pages,
    onChange: function onChange(page) {
      return tree.mutate(node.path, {
        page: page
      });
    }
  }, {
    PagerItem: PagerItem,
    Icon: Icon
  }));
};

var _default = (0, _hoc.contexturifyWithoutLoader)(ResultPager);

exports["default"] = _default;
//# sourceMappingURL=ResultPager.js.map