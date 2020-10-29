"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _hoc = require("../utils/hoc");

var _format = require("../utils/format");

var _facet = require("../utils/facet");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DateRangeFacet = function DateRangeFacet(_ref) {
  var tree = _ref.tree,
      node = _ref.node,
      _ref$hide = _ref.hide,
      hide = _ref$hide === void 0 ? {
    counts: false // Hide the facet counts so only the labels are displayed

  } : _ref$hide,
      _ref$display = _ref.display,
      display = _ref$display === void 0 ? _facet.displayFn : _ref$display,
      _ref$displayBlank = _ref.displayBlank,
      displayBlank = _ref$displayBlank === void 0 ? _facet.displayBlankFn : _ref$displayBlank,
      _ref$formatCount = _ref.formatCount,
      formatCount = _ref$formatCount === void 0 ? _format.toNumber : _ref$formatCount;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "contexture-daterangefacet"
  }, /*#__PURE__*/_react["default"].createElement(_facet.FacetCheckboxList, {
    tree: tree,
    node: node,
    hide: hide,
    display: display,
    displayBlank: displayBlank,
    formatCount: formatCount
  }));
};

var _default = (0, _hoc.contexturify)(DateRangeFacet);

exports["default"] = _default;
//# sourceMappingURL=DateRangeFacet.js.map