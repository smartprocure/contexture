"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _hoc = require("../utils/hoc");

var _generic = require("../styles/generic");

var _TagsJoinPicker = _interopRequireWildcard(require("./TagsJoinPicker"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var operatorOptions = _futil["default"].autoLabelOptions([{
  value: 'containsWord',
  label: 'Field Contains'
}, {
  value: 'wordStartsWith',
  label: 'Word Starts With'
}, {
  value: 'wordEndsWith',
  label: 'Word Ends With'
}, {
  value: 'containsExact',
  label: 'Word Is Exactly'
}, {
  value: 'startsWith',
  label: 'Field Starts With'
}, {
  value: 'endsWith',
  label: 'Field Ends With'
}, {
  value: 'is',
  label: 'Field Is Exactly'
} // { value: 'isNot', label: 'Is Not' },
// { value: 'contains', label: 'Contains'},
// { value: 'doesNotContain', label: 'Does Not Contain'}
]);

var Text = function Text(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      placeholder = _ref.placeholder,
      _ref$theme = _ref.theme,
      Select = _ref$theme.Select,
      TagsInput = _ref$theme.TagsInput,
      Popover = _ref$theme.Popover;

  var open = _react["default"].useState(false);

  var _React$useState = _react["default"].useState(null),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      selectedTag = _React$useState2[0],
      setSelectedTag = _React$useState2[1];

  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "contexture-text"
  }, /*#__PURE__*/_react["default"].createElement(Select, {
    value: node.operator,
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        operator: e.target.value
      });
    },
    options: operatorOptions
  }), /*#__PURE__*/_react["default"].createElement(TagsInput, {
    splitCommas: true,
    tags: node.values,
    onTagClick: function onTagClick(tag) {
      _futil["default"].on(open)();

      setSelectedTag(tag);
    },
    addTag: function addTag(tag) {
      tree.mutate(node.path, {
        values: [].concat(_toConsumableArray(node.values), [tag])
      });
    },
    removeTag: function removeTag(tag) {
      tree.mutate(node.path, {
        values: _fp["default"].without([tag], node.values)
      });
    },
    tagStyle: (0, _generic.bgJoin)((0, _TagsJoinPicker.tagToGroupJoin)(node.join)),
    submit: tree.triggerUpdate,
    placeholder: placeholder
  }), /*#__PURE__*/_react["default"].createElement(Popover, {
    open: open
  }, /*#__PURE__*/_react["default"].createElement(_TagsJoinPicker["default"], {
    tag: selectedTag,
    node: node,
    tree: tree
  })));
};

var _default = (0, _hoc.contexturify)(Text);

exports["default"] = _default;
//# sourceMappingURL=TagsText.js.map