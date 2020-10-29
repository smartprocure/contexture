"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Tags = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

var _2 = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var Tags = function Tags(_ref) {
  var _ref$reverse = _ref.reverse,
      reverse = _ref$reverse === void 0 ? false : _ref$reverse,
      tags = _ref.tags,
      removeTag = _ref.removeTag,
      tagStyle = _ref.tagStyle,
      _ref$onTagClick = _ref.onTagClick,
      onTagClick = _ref$onTagClick === void 0 ? _fp["default"].noop : _ref$onTagClick,
      _ref$Tag = _ref.Tag,
      Tag = _ref$Tag === void 0 ? _2.Tag : _ref$Tag;
  return /*#__PURE__*/_react["default"].createElement(_2.Flex, {
    wrap: true,
    alignItems: "center",
    style: {
      cursor: 'text',
      margin: '0 -2px'
    }
  }, _fp["default"].flow(reverse ? _fp["default"].reverse : _fp["default"].identity, _fp["default"].map(function (t) {
    return /*#__PURE__*/_react["default"].createElement(Tag, _extends({
      key: t,
      value: t
    }, {
      removeTag: removeTag,
      tagStyle: tagStyle
    }, {
      onClick: function onClick() {
        return onTagClick(t);
      }
    }));
  }))(tags));
};

exports.Tags = Tags;

var isValidInput = function isValidInput(tag, tags) {
  return !_fp["default"].isEmpty(tag) && !_fp["default"].includes(tag, tags);
};

var ExpandableTagsInput = function ExpandableTagsInput(_ref2) {
  var tags = _ref2.tags,
      addTag = _ref2.addTag,
      removeTag = _ref2.removeTag,
      _ref2$submit = _ref2.submit,
      submit = _ref2$submit === void 0 ? _fp["default"].noop : _ref2$submit,
      tagStyle = _ref2.tagStyle,
      _ref2$placeholder = _ref2.placeholder,
      placeholder = _ref2$placeholder === void 0 ? 'Search...' : _ref2$placeholder,
      splitCommas = _ref2.splitCommas,
      style = _ref2.style,
      _ref2$onBlur = _ref2.onBlur,
      _onBlur = _ref2$onBlur === void 0 ? _fp["default"].noop : _ref2$onBlur,
      _ref2$onInputChange = _ref2.onInputChange,
      onInputChange = _ref2$onInputChange === void 0 ? _fp["default"].noop : _ref2$onInputChange,
      _ref2$onTagClick = _ref2.onTagClick,
      onTagClick = _ref2$onTagClick === void 0 ? _fp["default"].noop : _ref2$onTagClick,
      _ref2$Tag = _ref2.Tag,
      Tag = _ref2$Tag === void 0 ? _2.Tag : _ref2$Tag,
      props = _objectWithoutProperties(_ref2, ["tags", "addTag", "removeTag", "submit", "tagStyle", "placeholder", "splitCommas", "style", "onBlur", "onInputChange", "onTagClick", "Tag"]);

  addTag = splitCommas ? _fp["default"].flow(_fp["default"].split(','), _fp["default"].invokeMap('trim'), _fp["default"].compact, _fp["default"].uniq, _fp["default"].difference(_fp["default"], tags), _fp["default"].map(addTag)) : _fp["default"].flow(_fp["default"].trim, addTag);

  var _React$useState = _react["default"].useState(''),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      currentInput = _React$useState2[0],
      setCurrentInput = _React$useState2[1];

  return /*#__PURE__*/_react["default"].createElement("div", {
    style: style
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "tags-input-container",
    columns: "1fr auto",
    gap: "8px 4px"
  }, /*#__PURE__*/_react["default"].createElement("input", _extends({
    style: {
      flex: 1,
      border: 0
    },
    onChange: function onChange(e) {
      setCurrentInput(e.target.value);
      onInputChange();
    },
    onBlur: function onBlur() {
      if (isValidInput(currentInput, tags)) {
        addTag(currentInput);
        setCurrentInput('');

        _onBlur();
      }
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter' && !currentInput) submit();

      if ((_fp["default"].includes(e.key, ['Enter', 'Tab']) || splitCommas && e.key === ',') && isValidInput(currentInput, tags)) {
        addTag(currentInput);
        setCurrentInput('');
        e.preventDefault();
      }

      if (e.key === 'Backspace' && !currentInput && tags.length) {
        var last = _fp["default"].last(tags);

        removeTag(last);
        setCurrentInput(last);
        e.preventDefault();
      }
    },
    value: currentInput,
    placeholder: placeholder
  }, props)), /*#__PURE__*/_react["default"].createElement(Tags, _extends({
    reverse: true
  }, {
    tags: tags,
    removeTag: removeTag,
    tagStyle: tagStyle,
    onTagClick: onTagClick,
    Tag: Tag
  }))));
};

var _default = (0, _mobxReact.observer)(ExpandableTagsInput);

exports["default"] = _default;
//# sourceMappingURL=ExpandableTagsInput.js.map