"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getSheet = function getSheet(set) {
  return require("emoji-datasource/img/".concat(set, "/sheets/32.png"));
};

var EmojiIcon = function EmojiIcon(_ref) {
  var _ref$set = _ref.set,
      set = _ref$set === void 0 ? 'twitter' : _ref$set,
      _ref$record = _ref.record,
      sheet_x = _ref$record.sheet_x,
      sheet_y = _ref$record.sheet_y;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      backgroundImage: "url(".concat(getSheet(set), ")"),
      backgroundPosition: "-".concat(sheet_x * 34, "px -").concat(sheet_y * 34, "px"),
      width: 33,
      height: 33,
      transform: 'scale(0.75)'
    }
  });
};

var _default = EmojiIcon;
exports["default"] = _default;
//# sourceMappingURL=EmojiIcon.js.map