"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _fp = _interopRequireDefault(require("lodash/fp"));

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _2 = _interopRequireDefault(require("."));

var _3 = require("..");

var _StepsAccordion = _interopRequireWildcard(require("../purgatory/StepsAccordion"));

var _futil = require("futil");

var _schema = require("../utils/schema");

var _exampleTypes = require("../exampleTypes");

var _config = require("./stories/config");

var _themePicker = _interopRequireDefault(require("../stories/themePicker"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mapNodeToDescription = function mapNodeToDescription(types) {
  return function (node, fields) {
    return {
      description: _fp["default"].join(' ', [_fp["default"].get([node.field, 'description'], fields) || node.description, _fp["default"].get([node.type, 'description'], types)])
    };
  };
};

var WizardStory = function WizardStory() {
  return /*#__PURE__*/_react["default"].createElement(_2["default"], {
    tree: _config.tree,
    path: ['root'],
    fields: _config.fields,
    mapNodeToProps: (0, _futil.mergeOverAll)([(0, _schema.componentForType)(_exampleTypes.TypeMap), (0, _schema.schemaFieldProps)(['label']), mapNodeToDescription(_config.types), function (node) {
      return _config.nodeOverrides[node.key];
    }]),
    title: "Movies"
  });
};

var AccordionStory = function AccordionStory() {
  return /*#__PURE__*/_react["default"].createElement(_StepsAccordion["default"], null, /*#__PURE__*/_react["default"].createElement(_StepsAccordion.AccordionStep, {
    isRequired: true,
    title: /*#__PURE__*/_react["default"].createElement("h1", null, "Test title")
  }, /*#__PURE__*/_react["default"].createElement(_3.FilterButtonList, {
    tree: _config.tree,
    fields: _config.fields,
    path: ['root', 'step 1'],
    mapNodeToProps: (0, _futil.mergeOverAll)([(0, _schema.componentForType)(_exampleTypes.TypeMap), (0, _schema.schemaFieldProps)(['label']), mapNodeToDescription(_config.types), function (node) {
      return _config.nodeOverrides[node.key];
    }])
  })), /*#__PURE__*/_react["default"].createElement(_StepsAccordion.AccordionStep, {
    isRequired: false,
    title: /*#__PURE__*/_react["default"].createElement("h1", null, "Quick brown fox")
  }, /*#__PURE__*/_react["default"].createElement(_3.FilterButtonList, {
    tree: _config.tree,
    path: ['root', 'step 2'],
    fields: _config.fields,
    mapNodeToProps: (0, _futil.mergeOverAll)([(0, _schema.componentForType)(_exampleTypes.TypeMap), mapNodeToDescription(_config.types), function (node) {
      return _config.nodeOverrides[node.key];
    }])
  })));
};

(0, _react2.storiesOf)('Search Components|QueryWizard', module).addDecorator((0, _themePicker["default"])('greyVest')).add('QueryWizard', WizardStory).add('Accordion with FilterButtonList', AccordionStory);
//# sourceMappingURL=QueryWizard.stories.js.map