"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _contextureClient = require("contexture-client");

var _contextureMobx = _interopRequireDefault(require("../utils/contexture-mobx"));

var _exampleTypes = require("../exampleTypes");

var _schema = require("../utils/schema");

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

var _ = _interopRequireDefault(require("."));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Client = (0, _contextureMobx["default"])({
  debug: true,
  types: _contextureClient.exampleTypes,
  service: (0, _contextureClient.mockService)()
});

var Node = function Node(type, key) {
  return {
    key: key,
    type: type
  };
};

(0, _react2.storiesOf)('Search Components|QueryBuilder', module).addDecorator((0, _themePicker["default"])('greyVest')).add('One Filter', function () {
  return /*#__PURE__*/_react["default"].createElement(_["default"], {
    tree: Client({
      key: 'root',
      join: 'and',
      children: [{
        key: 'filter 1',
        type: 'query'
      }]
    }),
    path: ['root'],
    mapNodeToProps: (0, _schema.componentForType)(_exampleTypes.TypeMap)
  });
}).add('One Filter with fields', function () {
  return /*#__PURE__*/_react["default"].createElement(_["default"], {
    path: ['root'],
    tree: Client({
      key: 'root',
      join: 'and',
      children: [{
        key: 'filter 1',
        field: 'test',
        type: 'query'
      }]
    }),
    fields: {
      test: {
        field: 'test',
        label: 'Test',
        typeOptions: ['facet', 'query']
      },
      test2: {
        field: 'test2',
        label: 'Test2',
        typeOptions: ['facet', 'query']
      }
    },
    mapNodeToProps: (0, _schema.componentForType)(_exampleTypes.TypeMap)
  });
}).add('One Filter with facet options', function () {
  return /*#__PURE__*/_react["default"].createElement(_["default"], {
    path: ['root'],
    tree: Client({
      key: 'root',
      join: 'and',
      children: [{
        key: 'filter 1',
        type: 'facet',
        context: {
          options: [{
            name: 'Option 1',
            count: 2
          }, {
            name: 'Option 2',
            count: 1
          }]
        }
      }]
    }),
    fields: ['field1', 'field2', {
      label: 'Field 3',
      value: 'field3'
    }],
    mapNodeToProps: (0, _schema.componentForType)(_exampleTypes.TypeMap)
  });
}).add('One Filter on a misplaced root', function () {
  return /*#__PURE__*/_react["default"].createElement(_["default"], {
    tree: Client({
      key: 'root',
      join: 'and',
      children: [{
        key: 'search',
        join: 'and',
        children: [{
          key: 'filter 1',
          type: 'query'
        }]
      }]
    }),
    path: ['root', 'search'],
    mapNodeToProps: (0, _schema.componentForType)(_exampleTypes.TypeMap)
  });
}).add('Multiple Filters', function () {
  return /*#__PURE__*/_react["default"].createElement(_["default"], {
    path: ['root'],
    tree: Client({
      key: 'root',
      join: 'and',
      children: [Node('query', 'filter 1'), {
        key: 'group1',
        join: 'or',
        children: [Node('query', 'filter 2a'), Node('query', 'filter 2b'), {
          key: 'group2',
          join: 'and',
          children: [Node('facet', 'filter 4a'), Node('query', 'filter 4b')]
        }]
      }, Node('query', 'filter 3'), {
        key: 'group2',
        join: 'not',
        children: [Node('number', 'filter 5a'), Node('query', 'filter 5b')]
      }, {
        key: 'group24',
        join: 'or',
        children: [{
          key: 'group2',
          join: 'and',
          children: [Node('query', 'filter 4a'), Node('text', 'txt filter 4b')]
        }, Node('query', 'asdf')]
      }]
    }),
    mapNodeToProps: (0, _schema.componentForType)(_exampleTypes.TypeMap)
  });
});
//# sourceMappingURL=QueryBuilder.stories.js.map