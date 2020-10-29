"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _mobxReact = require("mobx-react");

var _TagsJoinPicker = _interopRequireDefault(require("../TagsJoinPicker"));

var _theme = require("../../utils/theme");

var _greyVest = require("../../greyVest");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ActionsMenu = function ActionsMenu(_ref) {
  var node = _ref.node,
      tree = _ref.tree,
      close = _ref.close,
      _ref$theme = _ref.theme,
      Button = _ref$theme.Button,
      Checkbox = _ref$theme.Checkbox,
      _ref$actionWrapper = _ref.actionWrapper,
      actionWrapper = _ref$actionWrapper === void 0 ? _fp["default"].identity : _ref$actionWrapper;
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    style: {
      minWidth: 240,
      padding: 10
    },
    className: "tags-query-actions-menu",
    column: true,
    justifyContent: "stretch",
    alignItems: "stretch"
  }, !!_fp["default"].get('tags.length', node) && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(Button, {
    onClick: actionWrapper(function () {
      return close() || (0, _utils.copyTags)(node);
    })
  }, "Copy ", _fp["default"].startCase(_utils.tagTerm), "s"), /*#__PURE__*/_react["default"].createElement(Button, {
    style: {
      margin: '10px 0'
    },
    onClick: actionWrapper(function () {
      return close() || tree.mutate(node.path, {
        tags: []
      });
    })
  }, "Clear ", _fp["default"].startCase(_utils.tagTerm), "s"), /*#__PURE__*/_react["default"].createElement("div", {
    className: "line-separator"
  })), /*#__PURE__*/_react["default"].createElement("label", {
    className: "labeled-checkbox",
    style: {
      margin: '10px 0'
    }
  }, /*#__PURE__*/_react["default"].createElement(Checkbox, {
    htmlId: "stemming",
    checked: !node.exact,
    onChange: function onChange(e) {
      return tree.mutate(node.path, {
        exact: !e.target.checked
      });
    }
  }), /*#__PURE__*/_react["default"].createElement("span", null, "Include word variations")), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_TagsJoinPicker["default"], {
    node: node,
    tree: tree
  })));
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(ActionsMenu);

exports["default"] = _default;
//# sourceMappingURL=ActionsMenu.js.map