"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.FiltersBox = exports.AddableFilterList = exports.SearchTree = void 0;

var _react = _interopRequireDefault(require("react"));

var _fp = _interopRequireDefault(require("lodash/fp"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _futil = _interopRequireDefault(require("futil"));

var _mobxReact = require("mobx-react");

var _2 = require(".");

var _purgatory = require("./purgatory");

var _greyVest = require("./greyVest");

var _theme = require("./utils/theme");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var SearchTree = function SearchTree() {};

exports.SearchTree = SearchTree;

var LabelledList = function LabelledList(_ref) {
  var list = _ref.list,
      Component = _ref.Component;
  return _futil["default"].mapIndexed(function (_ref2, i) {
    var label = _ref2.label,
        props = _objectWithoutProperties(_ref2, ["label"]);

    return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, {
      key: i
    }, label && /*#__PURE__*/_react["default"].createElement("h3", null, label), /*#__PURE__*/_react["default"].createElement(Component, props));
  }, list);
};

var AddableFilterList = function AddableFilterList(props) {
  return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_2.FilterList, props), /*#__PURE__*/_react["default"].createElement(_2.FilterAdder, _extends({}, props, {
    uniqueFields: !props.allowDuplicateFields
  })));
};

exports.AddableFilterList = AddableFilterList;
var FiltersBox = (0, _theme.withTheme)(function (_ref3) {
  var Box = _ref3.theme.Box,
      props = _objectWithoutProperties(_ref3, ["theme"]);

  return /*#__PURE__*/_react["default"].createElement(Box, {
    className: "filter-list"
  }, /*#__PURE__*/_react["default"].createElement(AddableFilterList, props));
});
exports.FiltersBox = FiltersBox;
FiltersBox.displayName = 'FiltersBox';

var BasicSearchFilters = function BasicSearchFilters(_ref4) {
  var setMode = _ref4.setMode,
      trees = _ref4.trees,
      children = _ref4.children,
      BasicFilters = _ref4.BasicFilters;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_2.Flex, {
    alignItems: "center",
    justifyContent: "space-between"
  }, /*#__PURE__*/_react["default"].createElement("h1", null, "Filters"), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_greyVest.Popover, {
    position: "bottom right",
    trigger: /*#__PURE__*/_react["default"].createElement(_greyVest.DropdownItem, null, /*#__PURE__*/_react["default"].createElement(_greyVest.Icon, {
      icon: "more_vert"
    }))
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.DropdownItem, {
    onClick: function onClick() {
      return setMode('resultsOnly');
    }
  }, "Hide Filters"), /*#__PURE__*/_react["default"].createElement(_purgatory.TreePauseButton, {
    children: children,
    Component: _greyVest.DropdownItem
  }), /*#__PURE__*/_react["default"].createElement(_greyVest.DropdownItem, {
    onClick: function onClick() {
      return setMode('builder');
    }
  }, "Advanced Search Builder")))), /*#__PURE__*/_react["default"].createElement(LabelledList, {
    list: trees,
    Component: BasicFilters
  }));
};

var BuilderSearchFilters = function BuilderSearchFilters(_ref5) {
  var setMode = _ref5.setMode,
      trees = _ref5.trees,
      BuilderFilters = _ref5.BuilderFilters;
  return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_2.Flex, {
    alignItems: "center",
    justifyContent: "space-between"
  }, /*#__PURE__*/_react["default"].createElement("h1", null, "Filters"), /*#__PURE__*/_react["default"].createElement(_greyVest.LinkButton, {
    onClick: function onClick() {
      return setMode('basic');
    }
  }, "Back to Regular Search")), /*#__PURE__*/_react["default"].createElement(LabelledList, {
    list: trees,
    Component: BuilderFilters
  }));
};

var SearchFilters = function SearchFilters(_ref6) {
  var mode = _ref6.mode,
      setMode = _ref6.setMode,
      children = _ref6.children,
      _ref6$BasicFilters = _ref6.BasicFilters,
      BasicFilters = _ref6$BasicFilters === void 0 ? FiltersBox : _ref6$BasicFilters,
      _ref6$BuilderFilters = _ref6.BuilderFilters,
      BuilderFilters = _ref6$BuilderFilters === void 0 ? _2.QueryBuilder : _ref6$BuilderFilters;

  var trees = _fp["default"].flow(_react["default"].Children.toArray, _fp["default"].map('props'))(children);

  return mode === 'basic' ? /*#__PURE__*/_react["default"].createElement(BasicSearchFilters, {
    trees: trees,
    setMode: setMode,
    children: children,
    BasicFilters: BasicFilters
  }) : mode === 'builder' ? /*#__PURE__*/_react["default"].createElement(BuilderSearchFilters, {
    trees: trees,
    setMode: setMode,
    BuilderFilters: BuilderFilters
  }) : null;
};

SearchFilters.propTypes = {
  mode: _propTypes["default"].oneOf(['basic', 'builder', 'resultsOnly'])
};

var _default = (0, _mobxReact.observer)(SearchFilters);

exports["default"] = _default;
//# sourceMappingURL=SearchFilters.js.map