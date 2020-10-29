"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _util = require("./stories/util");

var _Group = _interopRequireDefault(require("./Group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _react2.storiesOf)('Search Components|QueryBuilder/Internals/Group', module).addDecorator(_util.DnDDecorator).add('One Filter', function () {
  return /*#__PURE__*/_react["default"].createElement(_Group["default"], {
    node: {
      key: 'root',
      join: 'and',
      children: [{
        key: 'filter 1',
        type: 'query'
      }]
    },
    root: _util.root,
    isRoot: true
  });
}).add('Multiple Filters', function () {
  return /*#__PURE__*/_react["default"].createElement(_Group["default"], {
    node: {
      key: 'root',
      join: 'and',
      children: [{
        type: 'query',
        key: 'filter 1'
      }, {
        key: 'group1',
        join: 'or',
        children: [{
          type: 'query',
          key: 'filter 2a'
        }, {
          type: 'query',
          key: 'filter 2b'
        }, {
          key: 'group2',
          join: 'and',
          children: [{
            key: 'filter 4a',
            type: 'facet'
          }, {
            type: 'query',
            key: 'filter 4b'
          }]
        }]
      }, {
        type: 'query',
        key: 'filter 3'
      }, {
        key: 'group2',
        join: 'not',
        children: [{
          key: 'filter 5a',
          type: 'number'
        }, {
          type: 'query',
          key: 'filter 5b'
        }]
      }, {
        key: 'group24',
        join: 'or',
        children: [{
          key: 'group2',
          join: 'and',
          children: [{
            type: 'query',
            key: 'filter 4a'
          }, {
            key: 'txt filter 4b',
            type: 'text'
          }]
        }, {
          key: 'asdf',
          typ: 'query'
        }]
      }]
    },
    root: _util.root,
    isRoot: true
  });
});
//# sourceMappingURL=Group.stories.js.map