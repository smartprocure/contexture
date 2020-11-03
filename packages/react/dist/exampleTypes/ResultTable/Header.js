"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var F = _interopRequireWildcard(require("futil"));

var _recompose = require("recompose");

var _mobxReact = require("mobx-react");

var _greyVest = require("../../greyVest");

var _theme = require("../../utils/theme");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var moveColumn = function moveColumn(mutate, computeNextIndex, field, visibleFields, includes) {
  var visibleFieldIndex = _fp["default"].findIndex({
    field: field
  }, visibleFields);

  var nextField = _fp["default"].flow(_fp["default"].nth(computeNextIndex(visibleFieldIndex)), _fp["default"].get('field'))(visibleFields);

  mutate({
    include: F.moveIndex(_fp["default"].indexOf(field, includes), _fp["default"].indexOf(nextField, includes), includes)
  });
};

var popoverStyle = {
  userSelect: 'none',
  width: 'auto'
};

var HeaderCellDefault = _fp["default"].flow((0, _recompose.setDisplayName)('HeaderCell'), _mobxReact.observer)(function (_ref) {
  var activeFilter = _ref.activeFilter,
      style = _ref.style,
      children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("th", {
    style: _objectSpread(_objectSpread({}, activeFilter ? {
      fontWeight: 900
    } : {}), style)
  }, children);
});

var Header = function Header(_ref2) {
  var fieldSchema = _ref2.field,
      includes = _ref2.includes,
      addOptions = _ref2.addOptions,
      addFilter = _ref2.addFilter,
      tree = _ref2.tree,
      node = _ref2.node,
      mutate = _ref2.mutate,
      criteria = _ref2.criteria,
      mapNodeToProps = _ref2.mapNodeToProps,
      fields = _ref2.fields,
      visibleFields = _ref2.visibleFields,
      sticky = _ref2.sticky,
      _ref2$theme = _ref2.theme,
      DropdownItem = _ref2$theme.DropdownItem,
      Icon = _ref2$theme.Icon,
      Popover = _ref2$theme.Popover,
      Modal = _ref2$theme.Modal,
      NestedPicker = _ref2$theme.NestedPicker,
      UnmappedNodeComponent = _ref2$theme.UnmappedNodeComponent;

  var adding = _react["default"].useState(false);

  var filtering = _react["default"].useState(false);

  var disableFilter = fieldSchema.disableFilter,
      disableSort = fieldSchema.disableSort,
      field = fieldSchema.field,
      _fieldSchema$sortFiel = fieldSchema.sortField,
      sortField = _fieldSchema$sortFiel === void 0 ? field : _fieldSchema$sortFiel,
      label = fieldSchema.label,
      hideRemoveColumn = fieldSchema.hideRemoveColumn,
      hideMenu = fieldSchema.hideMenu,
      typeDefault = fieldSchema.typeDefault;
  var HeaderCell = fieldSchema.HeaderCell || HeaderCellDefault;

  var filterNode = criteria && _fp["default"].find({
    field: field
  }, _fp["default"].getOr([], 'children', tree.getNode(criteria)));

  var filter = function filter() {
    if (!filterNode) addFilter(field);
    filterNode = criteria && _fp["default"].find({
      field: field
    }, _fp["default"].getOr([], 'children', tree.getNode(criteria)));
    tree.mutate(filterNode.path, {
      paused: false
    });
    F.flip(filtering)();
  };

  var Label = label;
  return /*#__PURE__*/_react["default"].createElement(HeaderCell, {
    style: {
      cursor: hideMenu ? 'default' : 'pointer',
      left: sticky ? 0 : '',
      zIndex: sticky ? 11 : ''
    }
  }, /*#__PURE__*/_react["default"].createElement("span", null, _fp["default"].isFunction(label) ? /*#__PURE__*/_react["default"].createElement(Label, null) : label, ' ', field === node.sortField && /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: node.sortDir === 'asc' ? 'SortAscending' : 'SortDescending'
  }), /*#__PURE__*/_react["default"].createElement(Popover, {
    trigger: hideMenu ? null : /*#__PURE__*/_react["default"].createElement(Icon, {
      icon: "TableColumnMenu"
    }),
    position: "bottom center",
    closeOnPopoverClick: false,
    style: popoverStyle
  }, !disableSort && /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: function onClick() {
      mutate({
        sortField: sortField,
        sortDir: 'asc'
      });
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "SortAscending"
  }), "Sort Ascending"), !disableSort && /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: function onClick() {
      mutate({
        sortField: sortField,
        sortDir: 'desc'
      });
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "SortDescending"
  }), "Sort Descending"), /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: function onClick() {
      return moveColumn(mutate, function (i) {
        return i - 1;
      }, field, visibleFields, includes);
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "MoveLeft"
  }), "Move Left"), /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: function onClick() {
      return moveColumn(mutate, function (i) {
        return i + 1;
      }, field, visibleFields, includes);
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "MoveRight"
  }), "Move Right"), !hideRemoveColumn && /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: function onClick() {
      return mutate({
        include: _fp["default"].without([field], includes)
      });
    }
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "RemoveColumn"
  }), "Remove Column"), !!addOptions.length && /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: F.on(adding)
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: "AddColumn"
  }), "Add Column"), criteria && (typeDefault || filterNode) && !disableFilter && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(DropdownItem, {
    onClick: filter
  }, /*#__PURE__*/_react["default"].createElement(Icon, {
    icon: filterNode ? F.view(filtering) ? 'FilterCollapse' : 'FilterExpand' : 'FilterAdd'
  }), "Filter"), F.view(filtering) && filterNode && !filterNode.paused && /*#__PURE__*/_react["default"].createElement(_greyVest.Dynamic, _objectSpread({
    component: UnmappedNodeComponent,
    tree: tree,
    path: _fp["default"].toArray(filterNode.path)
  }, mapNodeToProps(filterNode, fields)))), /*#__PURE__*/_react["default"].createElement(Modal, {
    open: adding
  }, /*#__PURE__*/_react["default"].createElement(NestedPicker, {
    options: addOptions,
    onChange: function onChange(triggerField) {
      var index = includes.indexOf(field);

      if (index >= 0) {
        includes.splice(index + 1, 0, triggerField);
        mutate({
          include: includes
        });
      }

      F.off(adding)();
    }
  })))));
};

var _default = _fp["default"].flow(_mobxReact.observer, _theme.withTheme)(Header);

exports["default"] = _default;
//# sourceMappingURL=Header.js.map