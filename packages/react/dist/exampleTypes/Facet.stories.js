"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emojiDataset = exports.facetSelect = exports.facet = exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _testTree = _interopRequireDefault(require("./stories/testTree"));

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _MemoryTable = require("../MemoryTable");

var _contextureMobx = _interopRequireDefault(require("../utils/contexture-mobx"));

var _greyVest = require("../greyVest");

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = {
  title: 'ExampleTypes | Facet',
  component: _.Facet,
  decorators: [(0, _themePicker["default"])('greyVest')]
};
exports["default"] = _default;

var facet = function facet() {
  return /*#__PURE__*/_react["default"].createElement(_.Facet, {
    tree: (0, _testTree["default"])(),
    path: ['facet']
  });
};

exports.facet = facet;

var facetSelect = function facetSelect() {
  return /*#__PURE__*/_react["default"].createElement(_.FacetSelect, {
    tree: (0, _testTree["default"])(),
    path: ['facet']
  });
};

exports.facetSelect = facetSelect;

var emojiDataset = function emojiDataset() {
  var data = require('emoji-datasource');

  var service = (0, _MemoryTable.memoryService)(data);
  var tree = (0, _contextureMobx["default"])({
    service: service
  })({
    key: 'root',
    children: [{
      type: 'facet',
      field: 'category'
    }, {
      type: 'results'
    }]
  });
  tree.refresh(['root']);
  return /*#__PURE__*/_react["default"].createElement(_greyVest.Grid, {
    columns: "1fr 3fr",
    gap: 8
  }, /*#__PURE__*/_react["default"].createElement(_greyVest.Box, null, /*#__PURE__*/_react["default"].createElement(_.Facet, {
    tree: tree,
    path: ['root', 'category-facet']
  })), /*#__PURE__*/_react["default"].createElement(_greyVest.Box, {
    style: {
      overflow: 'auto'
    }
  }, /*#__PURE__*/_react["default"].createElement(_.ResultTable, {
    infer: true,
    tree: tree,
    path: ['root', 'results'],
    fields: {
      category: {
        order: 1
      }
    }
  })));
};

exports.emojiDataset = emojiDataset;
//# sourceMappingURL=Facet.stories.js.map