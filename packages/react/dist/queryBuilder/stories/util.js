"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.root = exports.parent = exports.DnDDecorator = void 0;

var _react = _interopRequireDefault(require("react"));

var F = _interopRequireWildcard(require("futil"));

var _addonActions = require("@storybook/addon-actions");

var _DDContext = _interopRequireDefault(require("../DragDrop/DDContext"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var DnDWrap = (0, _DDContext["default"])(function (_ref) {
  var children = _ref.children;
  return /*#__PURE__*/_react["default"].createElement("div", null, children);
});

var DnDDecorator = function DnDDecorator(storyFn) {
  return /*#__PURE__*/_react["default"].createElement(DnDWrap, null, storyFn());
};

exports.DnDDecorator = DnDDecorator;
var parent = {
  lens: {
    wrapHover: F.objectLens(),
    removeHover: F.objectLens(),
    joinHover: F.objectLens()
  }
};
exports.parent = parent;
var root = {
  join: (0, _addonActions.action)('join'),
  indent: (0, _addonActions.action)('indent'),
  remove: (0, _addonActions.action)('remove'),
  typeChange: (0, _addonActions.action)('typeChange'),
  add: (0, _addonActions.action)('add'),
  move: (0, _addonActions.action)('move'),
  mutate: (0, _addonActions.action)('mutate'),
  types: {
    testType: {},
    testType2: {}
  }
};
/* TODO: Remove this. Left it so git detects this as a file rename
require('./operatorMenu').default(parent, root)
require('./operator').default(parent, root, DnDDecorator)
require('./addPreview').default(parent, root, DnDDecorator)
require('./indentable').default(parent, root, DnDDecorator)
require('./filterContents').default(parent, root)
require('./rule').default(parent, root, DnDDecorator)
require('./group').default(parent, root, DnDDecorator)
*/

exports.root = root;
//# sourceMappingURL=util.js.map