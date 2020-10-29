"use strict";

var _schema = require("./schema");

var _exampleTypes = require("../exampleTypes");

var _base = require("../themes/base");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

test('componentForType', function () {
  var mapNodeToComponent = (0, _schema.componentForType)(_exampleTypes.TypeMap);
  var defaultProps = {
    component: _base.UnmappedNodeComponent
  }; // for realism

  var node = {
    type: 'facet'
  };
  expect(mapNodeToComponent(node)).toEqual({
    component: _exampleTypes.Facet
  });
  var unmappedNode = {
    type: 'little-teapot'
  };
  expect(mapNodeToComponent(unmappedNode)).toEqual(undefined); // merge test

  expect(_objectSpread(_objectSpread({}, defaultProps), mapNodeToComponent(unmappedNode))).toEqual({
    component: _base.UnmappedNodeComponent
  });
  expect(_objectSpread(_objectSpread({}, defaultProps), mapNodeToComponent(node))).not.toEqual({
    component: _base.UnmappedNodeComponent
  });
});
//# sourceMappingURL=schema.test.js.map