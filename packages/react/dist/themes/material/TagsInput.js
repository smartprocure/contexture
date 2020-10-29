"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _mobxReact = require("mobx-react");

var _materialUiChipInput = _interopRequireDefault(require("material-ui-chip-input"));

var _Tag = _interopRequireDefault(require("./Tag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TagsInput = function TagsInput(_ref) {
  var tags = _ref.tags,
      addTag = _ref.addTag,
      removeTag = _ref.removeTag,
      onTagClick = _ref.onTagClick,
      tagStyle = _ref.tagStyle,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? 'Search...' : _ref$placeholder,
      _ref$Tag = _ref.Tag,
      Tag = _ref$Tag === void 0 ? _Tag["default"] : _ref$Tag,
      style = _ref.style;
  return /*#__PURE__*/_react["default"].createElement(_materialUiChipInput["default"], {
    onAdd: addTag,
    onDelete: removeTag,
    placeholder: placeholder,
    value: tags,
    chipRenderer: function chipRenderer(_ref2) {
      var value = _ref2.value;
      return /*#__PURE__*/_react["default"].createElement(Tag, {
        onClick: function onClick() {
          return onTagClick(value);
        },
        removeTag: removeTag,
        value: value,
        style: {
          marginRight: 4
        },
        tagStyle: tagStyle
      });
    },
    style: style,
    fullWidth: true,
    alwaysShowPlaceholder: true
  });
};

var _default = (0, _mobxReact.observer)(TagsInput);

exports["default"] = _default;
//# sourceMappingURL=TagsInput.js.map