"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.MockTagsInput = void 0;

var _react = _interopRequireWildcard(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobx = require("mobx");

var _mobxReact = require("mobx-react");

var _Flex = _interopRequireDefault(require("./Flex"));

var _Tag = _interopRequireDefault(require("./Tag"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var isValidInput = function isValidInput(tag, tags) {
  return !_fp["default"].isEmpty(tag) && !_fp["default"].includes(tag, tags);
};

var TagsInput = /*#__PURE__*/(0, _react.forwardRef)(function (_ref, inputRef) {
  var tags = _ref.tags,
      addTag = _ref.addTag,
      removeTag = _ref.removeTag,
      _ref$submit = _ref.submit,
      submit = _ref$submit === void 0 ? _fp["default"].noop : _ref$submit,
      tagStyle = _ref.tagStyle,
      _ref$placeholder = _ref.placeholder,
      placeholder = _ref$placeholder === void 0 ? 'Search...' : _ref$placeholder,
      splitCommas = _ref.splitCommas,
      style = _ref.style,
      _ref$onBlur = _ref.onBlur,
      _onBlur = _ref$onBlur === void 0 ? _fp["default"].noop : _ref$onBlur,
      _ref$onInputChange = _ref.onInputChange,
      onInputChange = _ref$onInputChange === void 0 ? _fp["default"].noop : _ref$onInputChange,
      _ref$onTagClick = _ref.onTagClick,
      onTagClick = _ref$onTagClick === void 0 ? _fp["default"].noop : _ref$onTagClick,
      _ref$Tag = _ref.Tag,
      Tag = _ref$Tag === void 0 ? _Tag["default"] : _ref$Tag,
      props = _objectWithoutProperties(_ref, ["tags", "addTag", "removeTag", "submit", "tagStyle", "placeholder", "splitCommas", "style", "onBlur", "onInputChange", "onTagClick", "Tag"]);

  var containerRef = _react["default"].useRef();

  var state = (0, _mobxReact.useLocalStore)(function () {
    return {
      currentInput: ''
    };
  });
  addTag = splitCommas ? _fp["default"].flow(_fp["default"].split(','), _fp["default"].invokeMap('trim'), _fp["default"].compact, _fp["default"].uniq, _fp["default"].difference(_fp["default"], tags), _fp["default"].map(addTag)) : _fp["default"].flow(_fp["default"].trim, addTag);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: 'tags-input',
    ref: containerRef,
    style: _objectSpread({}, style)
  }, /*#__PURE__*/_react["default"].createElement(_Flex["default"], {
    wrap: true,
    alignItems: "center",
    style: {
      cursor: 'text',
      height: '100%',
      padding: 2
    }
  }, _fp["default"].map(function (t) {
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
  }, tags), /*#__PURE__*/_react["default"].createElement("input", _extends({
    style: {
      border: 'none',
      outline: 'none',
      flex: 1,
      margin: 3,
      minWidth: 120
    },
    ref: inputRef,
    onChange: function onChange(e) {
      state.currentInput = e.target.value;
      onInputChange();
    },
    onBlur: function onBlur() {
      if (isValidInput(state.currentInput, tags)) {
        addTag(state.currentInput);
        state.currentInput = '';

        _onBlur();
      }
    },
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter' && !state.currentInput) submit();

      if ((_fp["default"].includes(e.key, ['Enter', 'Tab']) || splitCommas && e.key === ',') && isValidInput(state.currentInput, tags)) {
        addTag(state.currentInput);
        state.currentInput = '';
        e.preventDefault();
      }

      if (e.key === 'Backspace' && !state.currentInput && tags.length) {
        var last = _fp["default"].last(tags);

        removeTag(last);
        state.currentInput = last;
        e.preventDefault();
      }
    },
    value: state.currentInput,
    placeholder: placeholder
  }, props))));
}); // Just uses an internal observable array

var MockTagsInput = (0, _mobxReact.inject)(function () {
  var tags = (0, _mobx.observable)([]);
  return {
    tags: tags,
    addTag: function addTag(tag) {
      tags.push(tag);
    },
    removeTag: function removeTag(tag) {
      tags = _fp["default"].without(tag, tags);
    }
  };
})(TagsInput);
exports.MockTagsInput = MockTagsInput;
MockTagsInput.displayName = 'MockTagsInput';

var _default = (0, _mobxReact.observer)(TagsInput);

exports["default"] = _default;
//# sourceMappingURL=TagsInput.js.map