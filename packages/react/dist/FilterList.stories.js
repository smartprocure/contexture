"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _schema = require("./utils/schema");

var _themePicker = _interopRequireDefault(require("./stories/themePicker"));

var _ = require(".");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('Search Components|FilterList', module).addDecorator((0, _themePicker["default"])('blueberry')).add('FilterList', function () {
  return /*#__PURE__*/_react["default"].createElement(_.FilterList, {
    node: {
      children: [{
        field: 'a',
        type: 'typeA',
        path: ['a', 'a']
      }, {
        field: 'b',
        type: 'typeB',
        path: ['a', 'b']
      }, {
        field: 'c',
        type: 'typeB',
        path: ['a', 'c']
      }]
    },
    fields: {
      a: {
        label: 'Field A'
      },
      b: {
        label: 'B Field'
      },
      c: {
        label: 'c'
      }
    },
    tree: {},
    mapNodeToProps: (0, _schema.componentForType)({
      typeA: function typeA() {
        return /*#__PURE__*/_react["default"].createElement("div", null, "A TYPE");
      },
      typeB: function typeB() {
        return /*#__PURE__*/_react["default"].createElement("div", null, "B TYPE");
      }
    })
  });
});
//# sourceMappingURL=FilterList.stories.js.map