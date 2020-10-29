"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _core = require("@material-ui/core");

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var iconMap = {
  SortAscending: 'expand_less',
  SortDescending: 'expand_more',
  MoveLeft: 'chevron_left',
  MoveRight: 'chevron_right',
  RemoveColumn: 'remove',
  AddColumn: 'add',
  FilterExpand: 'filter_alt',
  FilterCollapse: 'filter_list',
  FilterAdd: 'filter_list',
  TableColumnMenu: 'more_vert',
  FilterListExpand: 'add',
  FilterListCollapse: 'remove',
  TreePause: 'remove_circle_outline',
  TreeUnpause: 'add_circle_outline',
  PreviousPage: 'chevron_left',
  NextPage: 'chevron_right',
  Previous5Pages: 'more_horiz',
  Next5Pages: 'more_horiz',
  Refresh: 'refresh',
  AutoUpdate: 'autorenew',
  New: 'fiber_new',
  Expand: 'keyboard_arrow_down'
};

var _default = function _default(_ref) {
  var icon = _ref.icon,
      props = _objectWithoutProperties(_ref, ["icon"]);

  return /*#__PURE__*/_react["default"].createElement(_core.Icon, _extends({
    fontSize: "small"
  }, props), iconMap[icon]);
};

exports["default"] = _default;
//# sourceMappingURL=Icon.js.map