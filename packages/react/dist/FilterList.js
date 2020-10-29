"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Label = exports.FilterActions = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _futil = _interopRequireDefault(require("futil"));

var _recompose = require("recompose");

var _mobxReact = require("mobx-react");

var _greyVest = require("./greyVest");

var _FilterAdder = require("./FilterAdder");

var _hoc = require("./utils/hoc");

var _generic = require("./styles/generic");

var _search = require("./utils/search");

var _theme = require("./utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var FilterActions = _fp["default"].flow((0, _recompose.setDisplayName)('FilterActions'), _mobxReact.observer, _theme.withTheme)(function (_ref) {
  var node = _ref.node,
      tree = _ref.tree,
      fields = _ref.fields,
      popover = _ref.popover,
      _ref$theme = _ref.theme,
      DropdownItem = _ref$theme.DropdownItem,
      Popover = _ref$theme.Popover,
      Modal = _ref$theme.Modal,
      NestedPicker = _ref$theme.NestedPicker;

  var modal = _react["default"].useState(false);

  var typeOptions = _fp["default"].flow(_fp["default"].getOr([], [node.field, 'typeOptions']), _fp["default"].without([node.type]))(fields);

  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(Modal, {
    open: modal
  }, /*#__PURE__*/_react["default"].createElement(NestedPicker, {
    options: (0, _FilterAdder.fieldsToOptions)(fields),
    onChange: function onChange(field) {
      tree.replace(node.path, (0, _search.transformNodeFromField)({
        field: field,
        fields: fields
      }));

      _futil["default"].off(modal)();
    }
  })), /*#__PURE__*/_react["default"].createElement(Popover, {
    open: popover,
    arrow: false
  }, !_fp["default"].isEmpty(typeOptions) && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    className: "filter-actions-selected-type"
  }, "Filter type: ", /*#__PURE__*/_react["default"].createElement("strong", null, (0, _search.getTypeLabel)(tree, node.type))), _fp["default"].map(function (x) {
    return /*#__PURE__*/_react["default"].createElement(DropdownItem, {
      key: x.value,
      onClick: function onClick() {
        return tree.replace(node.path, (0, _search.newNodeFromType)(x.value, fields, node));
      }
    }, "\u2014Change to ", x.label);
  }, (0, _search.getTypeLabelOptions)(tree, typeOptions)), /*#__PURE__*/_react["default"].createElement("div", {
    className: "filter-actions-separator"
  })), /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: _futil["default"].on(modal)
  }, "Pick Field"), (node.hasValue || false) && /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: function onClick() {
      return tree.clear(node.path);
    }
  }, "Clear Filter"), /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: function onClick() {
      return tree.remove(node.path);
    }
  }, "Delete Filter")));
});

exports.FilterActions = FilterActions;

var Label = _fp["default"].flow((0, _recompose.setDisplayName)('Label'), _mobxReact.observer, _theme.withTheme)(function (_ref2) {
  var tree = _ref2.tree,
      node = _ref2.node,
      fields = _ref2.fields,
      children = _ref2.children,
      Icon = _ref2.theme.Icon,
      props = _objectWithoutProperties(_ref2, ["tree", "node", "fields", "children", "theme"]);

  var popover = _react["default"].useState(false);

  var modal = _react["default"].useState(false);

  var field = _fp["default"].get('field', node);

  return /*#__PURE__*/_react["default"].createElement(_greyVest.Flex, {
    className: "filter-field-label ".concat(_fp["default"].get('hasValue', node) ? 'filter-field-has-value' : '').trim(),
    style: {
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react["default"].createElement("span", props, children || _fp["default"].get([field, 'label'], fields) || field || ''), tree && node && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("span", {
    onClick: node.paused ? null : function (e) {
      e.stopPropagation();

      _futil["default"].flip(popover)();
    }
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "filter-field-label-icon"
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "TableColumnMenu"
  })), /*#__PURE__*/_react["default"].createElement(FilterActions, {
    node: node,
    tree: tree,
    fields: fields,
    popover: popover,
    modal: modal
  })),
  /*#__PURE__*/
  // Whitespace separator
  _react["default"].createElement("div", {
    style: {
      flexGrow: 1
    }
  })));
}); // we can't do this on export because FilterList is used internally


exports.Label = Label;

var FilterList = _fp["default"].flow((0, _recompose.setDisplayName)('FilterList'), _hoc.contexturifyWithoutLoader)(function (_ref3) {
  var tree = _ref3.tree,
      node = _ref3.node,
      fields = _ref3.fields,
      _ref3$mapNodeToProps = _ref3.mapNodeToProps,
      mapNodeToProps = _ref3$mapNodeToProps === void 0 ? _fp["default"].noop : _ref3$mapNodeToProps,
      _ref3$mapNodeToLabel = _ref3.mapNodeToLabel,
      mapNodeToLabel = _ref3$mapNodeToLabel === void 0 ? _fp["default"].noop : _ref3$mapNodeToLabel,
      className = _ref3.className,
      style = _ref3.style,
      _ref3$theme = _ref3.theme,
      UnmappedNodeComponent = _ref3$theme.UnmappedNodeComponent,
      Button = _ref3$theme.Button;
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: style,
    className: className
  }, _fp["default"].map(function (child) {
    return child.children ? /*#__PURE__*/_react["default"].createElement(FilterList, {
      key: child.path,
      tree: tree,
      node: child,
      fields: fields,
      mapNodeToProps: mapNodeToProps,
      mapNodeToLabel: mapNodeToLabel,
      className: 'filter-list-group',
      style: (0, _generic.bdJoin)(child)
    }) : /*#__PURE__*/_react["default"].createElement(_greyVest.Expandable, {
      key: child.path,
      className: "filter-list-item",
      isOpen: !child.paused,
      Label: /*#__PURE__*/_react["default"].createElement(Label, {
        tree: tree,
        node: child,
        fields: fields
      }, mapNodeToLabel(child, fields)),
      onClick: function onClick() {
        return tree && tree.mutate(child.path, {
          paused: !child.paused
        });
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "filter-list-item-contents"
    }, /*#__PURE__*/_react["default"].createElement(_greyVest.Dynamic, _objectSpread({
      component: UnmappedNodeComponent,
      tree: tree,
      node: child,
      path: _fp["default"].toArray(child.path)
    }, mapNodeToProps(child, fields))), !child.updating && tree.disableAutoUpdate && // find if any nodes in the tree are marked for update (i.e. usually nodes are marked for update because they react to "others" reactor)
    _fp["default"].some(function (treeNode) {
      return treeNode !== node && treeNode.markedForUpdate;
    }, _futil["default"].treeToArray(_fp["default"].get('children'))(tree.tree)) && /*#__PURE__*/_react["default"].createElement("div", {
      className: "apply-filter-button",
      onClick: function onClick(e) {
        e.stopPropagation();
        tree.triggerUpdate();
      }
    }, /*#__PURE__*/_react["default"].createElement(Button, {
      primary: true
    }, "Apply Filter"))));
  }, _fp["default"].get('children', node)));
});

var _default = FilterList;
exports["default"] = _default;
//# sourceMappingURL=FilterList.js.map