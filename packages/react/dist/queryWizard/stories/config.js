"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nodeOverrides = exports.tree = exports.fields = exports.types = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _contextureClient = require("contexture-client");

var _contextureMobx = _interopRequireDefault(require("../../utils/contexture-mobx"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var typeDescriptions = {
  tagsQuery: {
    description: 'Enter some tags.'
  },
  query: {
    description: 'Enter a search term in the field.'
  },
  facet: {
    description: 'Use the checkboxes to select all the results you wish to include. You can find and add multiple results by repeating this process.'
  }
};

var types = _fp["default"].merge(_contextureClient.exampleTypes, typeDescriptions);

exports.types = types;
var fields = {
  foo: {
    label: 'Foo',
    description: 'Enter a foo.'
  },
  bar: {
    label: 'Bar',
    description: "Type in the bar's name."
  }
};
exports.fields = fields;
var Client = (0, _contextureMobx["default"])({
  debug: true,
  types: types,
  service: (0, _contextureClient.mockService)()
});
var tree = Client({
  key: 'root',
  join: 'and',
  children: [{
    key: 'step 1',
    type: 'group',
    join: 'and',
    children: [{
      type: 'tagsQuery',
      key: 'friendly node'
    }, {
      key: 'foop',
      type: 'group',
      join: 'and',
      children: [{
        type: 'query',
        key: 'longName'
      }, {
        type: 'group',
        key: 'foo',
        join: 'or',
        children: [{
          key: 'foo',
          field: 'foo',
          type: 'query'
        }, {
          key: 'bar',
          field: 'bar',
          type: 'tagsQuery'
        }]
      }]
    }, {
      type: 'facet',
      key: 'friendly facet'
    }]
  }, {
    key: 'step 2',
    type: 'group',
    join: 'and',
    children: [{
      type: 'tagsQuery',
      key: 'friendly node',
      field: 'foo'
    }, {
      type: 'facet',
      key: 'friendly facet',
      field: 'bar'
    }]
  }]
});
exports.tree = tree;
var nodeOverrides = {
  longName: {
    label: 'This is a really long name'
  },
  'friendly facet': {
    label: 'This is another really long name',
    description: 'FRIENDLY FACET OVERRIDE DESCRIPTION!'
  }
};
exports.nodeOverrides = nodeOverrides;
//# sourceMappingURL=config.js.map