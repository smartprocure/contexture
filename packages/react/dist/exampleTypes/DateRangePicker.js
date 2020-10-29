"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _hoc = require("../utils/hoc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DateComponent = function DateComponent(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      ranges = _ref.ranges,
      Select = _ref.theme.Select;
  return /*#__PURE__*/_react["default"].createElement(Select, {
    value: (_fp["default"].find({
      range: node.range
    }, ranges) || {}).label,
    onChange: function onChange(event) {
      var value = _fp["default"].get('target.value', event);

      if (value) {
        var _$find = _fp["default"].find({
          label: value
        }, ranges),
            range = _$find.range;

        tree.mutate(node.path, {
          range: range,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      }
    },
    options: _fp["default"].map(function (x) {
      return {
        value: x.label,
        label: x.label
      };
    }, ranges)
  });
};

DateComponent.displayName = 'DateRangePicker';

var _default = (0, _hoc.contexturify)(DateComponent);

exports["default"] = _default;
//# sourceMappingURL=DateRangePicker.js.map