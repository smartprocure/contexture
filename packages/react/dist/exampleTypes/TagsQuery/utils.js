"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTagStyle = exports.getTag = exports.copyTags = exports.tagValueField = exports.tagTerm = void 0;

var _fp = _interopRequireDefault(require("lodash/fp"));

var _generic = require("../../styles/generic");

var _TagsJoinPicker = require("../TagsJoinPicker");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var tagTerm = 'keyword';
exports.tagTerm = tagTerm;
var tagValueField = 'word';
exports.tagValueField = tagValueField;

var copyTags = function copyTags(node) {
  if (node.tags) {
    var words = _fp["default"].flow(_fp["default"].map(tagValueField), _fp["default"].reverse, _fp["default"].join(','))(node.tags);

    navigator.clipboard.writeText(words);
  }
};

exports.copyTags = copyTags;

var getTag = function getTag(tag) {
  var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var key = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : tagValueField;
  return _fp["default"].find(_defineProperty({}, key, tag), node.tags) || {};
}; // TagsInput expects a `tagStyle` prop, which is a function of `tag`


exports.getTag = getTag;

var getTagStyle = function getTagStyle(node, key) {
  return function (tag) {
    var tagInstance = getTag(tag, node, key);
    return _objectSpread(_objectSpread(_objectSpread({}, tagInstance.distance ? {} : {
      fontWeight: 'bold'
    }), (0, _generic.bgJoin)((0, _TagsJoinPicker.tagToGroupJoin)(_fp["default"].get('join', node)))), {}, {
      opacity: tagInstance.onlyShowTheseResults || !_fp["default"].find('onlyShowTheseResults', node.tags) ? 1 : 0.5
    });
  };
};

exports.getTagStyle = getTagStyle;
//# sourceMappingURL=utils.js.map