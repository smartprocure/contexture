"use strict";

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _testTree = _interopRequireDefault(require("../stories/testTree"));

var _themePicker = _interopRequireDefault(require("../../stories/themePicker"));

var _2 = require("..");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var tags = _fp["default"].map(function (n) {
  return {
    word: "(".concat(n, ") This is a tag")
  };
}, _fp["default"].range(1, 5));

var treeWithTags = (0, _testTree["default"])(function (testTree) {
  testTree.getNode(['tagsQuery']).tags = tags;
  return testTree;
});
(0, _react2.storiesOf)('ExampleTypes|Tags Query', module).addDecorator((0, _themePicker["default"])('greyVest')).add('Default', function () {
  return /*#__PURE__*/_react["default"].createElement(_2.TagsQuery, {
    tree: treeWithTags,
    path: ['tagsQuery']
  });
}).add('Responsive', function () {
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      maxWidth: 500
    }
  }, /*#__PURE__*/_react["default"].createElement(_2.TagsQuery, {
    tree: treeWithTags,
    path: ['tagsQuery']
  }));
});
//# sourceMappingURL=index.stories.js.map