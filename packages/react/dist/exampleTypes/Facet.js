"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _futil = _interopRequireDefault(require("futil"));

var _hoc = require("../utils/hoc");

var _format = require("../utils/format");

var _facet = require("../utils/facet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Facet = function Facet(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      _ref$hide = _ref.hide,
      hide = _ref$hide === void 0 ? {
    selectAll: false,
    // Hide the initial "Select All" checkbox
    radioList: false,
    // Hide the Include/Exclude radio list
    facetFilter: false,
    // Hide the search box above the facet checkboxes
    counts: false // Hide the facet counts so only the labels are displayed

  } : _ref$hide,
      _ref$display = _ref.display,
      display = _ref$display === void 0 ? _facet.displayFn : _ref$display,
      _ref$displayBlank = _ref.displayBlank,
      displayBlank = _ref$displayBlank === void 0 ? _facet.displayBlankFn : _ref$displayBlank,
      _ref$formatCount = _ref.formatCount,
      formatCount = _ref$formatCount === void 0 ? _format.toNumber : _ref$formatCount,
      RadioList = _ref.theme.RadioList;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "contexture-facet"
  }, !hide.radioList && /*#__PURE__*/_react["default"].createElement(RadioList, {
    value: node.mode || 'include' // Fix by changing defaults in client example type
    ,
    onChange: function onChange(mode) {
      return tree.mutate(node.path, {
        mode: mode
      });
    },
    options: _futil["default"].autoLabelOptions(['include', 'exclude'])
  }), !hide.facetFilter && /*#__PURE__*/_react["default"].createElement(_facet.FacetOptionsFilter, {
    tree: tree,
    node: node
  }), !hide.selectAll && /*#__PURE__*/_react["default"].createElement(_facet.SelectAll, {
    node: node,
    tree: tree
  }), /*#__PURE__*/_react["default"].createElement(_facet.FacetCheckboxList, {
    tree: tree,
    node: node,
    hide: hide,
    display: display,
    displayBlank: displayBlank,
    formatCount: formatCount
  }), /*#__PURE__*/_react["default"].createElement(_facet.Cardinality, {
    node: node,
    tree: tree
  }));
};

var _default = (0, _hoc.contexturify)(Facet);

exports["default"] = _default;
//# sourceMappingURL=Facet.js.map