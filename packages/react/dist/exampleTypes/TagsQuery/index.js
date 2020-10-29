"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.innerHeight = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _greyVest = require("../../greyVest");

var _hoc = require("../../utils/hoc");

var _utils = require("./utils");

var _TagActionsMenu = _interopRequireDefault(require("./TagActionsMenu"));

var _ActionsMenu = _interopRequireDefault(require("./ActionsMenu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var innerHeight = 40;
exports.innerHeight = innerHeight;

var TagsQuery = function TagsQuery(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      style = _ref.style,
      actionWrapper = _ref.actionWrapper,
      _ref$onAddTag = _ref.onAddTag,
      onAddTag = _ref$onAddTag === void 0 ? _fp["default"].noop : _ref$onAddTag,
      _ref$theme = _ref.theme,
      Icon = _ref$theme.Icon,
      TagsInput = _ref$theme.TagsInput,
      Tag = _ref$theme.Tag,
      Popover = _ref$theme.Popover,
      props = _objectWithoutProperties(_ref, ["tree", "node", "style", "actionWrapper", "onAddTag", "theme"]);

  var TagWithPopover = function TagWithPopover(props) {
    return /*#__PURE__*/_react["default"].createElement(Popover, {
      position: "right top",
      closeOnPopoverClick: false,
      trigger: /*#__PURE__*/_react["default"].createElement(Tag, props)
    }, /*#__PURE__*/_react["default"].createElement(_TagActionsMenu["default"], _extends({
      tag: props.value
    }, {
      node: node,
      tree: tree
    })));
  };

  return /*#__PURE__*/_react["default"].createElement(_greyVest.Grid, {
    className: "tags-query",
    rows: "".concat(innerHeight, "px minmax(0, auto)"),
    columns: "1fr auto",
    style: style
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.GridItem, {
    height: 2,
    place: "center stretch"
  }, /*#__PURE__*/_react["default"].createElement(TagsInput, _extends({
    splitCommas: true,
    tags: _fp["default"].map(_utils.tagValueField, node.tags),
    addTag: function addTag(tag) {
      var _ref2;

      tree.mutate(node.path, {
        tags: [].concat(_toConsumableArray(node.tags), [(_ref2 = {}, _defineProperty(_ref2, _utils.tagValueField, tag), _defineProperty(_ref2, "distance", 3), _ref2)])
      });
      onAddTag(tag);
    },
    removeTag: function removeTag(tag) {
      tree.mutate(node.path, {
        tags: _fp["default"].reject(_defineProperty({}, _utils.tagValueField, tag), node.tags)
      });
    },
    tagStyle: (0, _utils.getTagStyle)(node, _utils.tagValueField),
    submit: tree.triggerUpdate,
    Tag: TagWithPopover,
    style: {
      flex: 1,
      border: 0
    }
  }, props))), /*#__PURE__*/_react["default"].createElement(_greyVest.GridItem, {
    place: "center"
  }, /*#__PURE__*/_react["default"].createElement(Popover, {
    style: {
      width: 'auto'
    },
    position: 'bottom right',
    closeOnPopoverClick: false,
    trigger: /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(Icon, {
      icon: "TableColumnMenu"
    }))
  }, function (close) {
    return /*#__PURE__*/_react["default"].createElement(_ActionsMenu["default"], {
      node: node,
      tree: tree,
      close: close,
      actionWrapper: actionWrapper
    });
  })));
};

var _default = (0, _hoc.contexturifyWithoutLoader)(TagsQuery);

exports["default"] = _default;
//# sourceMappingURL=index.js.map