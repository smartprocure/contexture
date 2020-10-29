"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _mobxReact = require("mobx-react");

var _theme = require("../../utils/theme");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var TagActionsMenu = function TagActionsMenu(_ref) {
  var tag = _ref.tag,
      node = _ref.node,
      tree = _ref.tree,
      _ref$theme = _ref.theme,
      Button = _ref$theme.Button,
      Checkbox = _ref$theme.Checkbox,
      RadioList = _ref$theme.RadioList;
  var tagInstance = (0, _utils.getTag)(tag, node);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "tags-query-tag-actions-menu",
    style: {
      minWidth: 100,
      padding: 10
    }
  }, /*#__PURE__*/_react["default"].createElement("div", null, _fp["default"].startCase(_utils.tagTerm), ":", ' ', /*#__PURE__*/_react["default"].createElement("span", {
    className: "filter-field-label"
  }, tag)), _fp["default"].includes(' ', tag) && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      margin: '10px 0'
    }
  }, /*#__PURE__*/_react["default"].createElement(RadioList, {
    options: _futil["default"].autoLabelOptions(['fuzzy', 'exact']),
    value: tagInstance.distance ? 'fuzzy' : 'exact',
    onChange: function onChange(value) {
      tagInstance.distance = value === 'fuzzy' ? 3 : 0;
      tree.mutate(node.path, {
        tags: _toConsumableArray(node.tags)
      });
    }
  }), /*#__PURE__*/_react["default"].createElement(Button, {
    onClick: function onClick() {
      tree.mutate(node.path, {
        tags: _fp["default"].map(function (tag) {
          if (_fp["default"].includes(' ', tag[_utils.tagValueField])) tag.distance = tagInstance.distance;
          return tag;
        }, node.tags)
      });
    }
  }, "Apply to all ", _utils.tagTerm, "s")), /*#__PURE__*/_react["default"].createElement("label", {
    className: "labeled-checkbox",
    style: {
      marginTop: 15
    }
  }, /*#__PURE__*/_react["default"].createElement(Checkbox, {
    checked: tagInstance.onlyShowTheseResults,
    onChange: function onChange(e) {
      tagInstance.onlyShowTheseResults = e.target.checked;
      tree.mutate(node.path, {
        tags: _toConsumableArray(node.tags)
      });
    }
  }), /*#__PURE__*/_react["default"].createElement("span", null, "Only view this ", _utils.tagTerm)));
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(TagActionsMenu);

exports["default"] = _default;
//# sourceMappingURL=TagActionsMenu.js.map