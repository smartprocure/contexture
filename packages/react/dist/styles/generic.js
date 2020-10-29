"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.bgPreview = exports.bdJoin = exports.bgJoin = exports.joinColor = exports.loading = exports.bgStriped = exports.roundedRight0 = exports.roundedLeft0 = exports.btn = exports.fullscreen = exports.w100 = exports.flexJustifyContentBetween = exports.dFlex = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Layout
var dFlex = {
  display: 'flex'
};
exports.dFlex = dFlex;

var flexJustifyContentBetween = _objectSpread({
  justifyContent: 'space-between'
}, dFlex);

exports.flexJustifyContentBetween = flexJustifyContentBetween;
var w100 = {
  width: '100%'
};
exports.w100 = w100;
var fullscreen = {
  position: 'fixed',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
}; // Button

exports.fullscreen = fullscreen;
var btn = {
  border: '1px solid #ccc',
  padding: '.5rem 1rem',
  // fontSize: '1rem',
  borderRadius: 5000,
  //'.25rem',
  background: 'white',
  textAlign: 'center',
  display: 'inline-block'
};
exports.btn = btn;
var roundedLeft0 = {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0
};
exports.roundedLeft0 = roundedLeft0;
var roundedRight0 = {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0
}; // Misc

exports.roundedRight0 = roundedRight0;
var bgStriped = {
  backgroundImage: 'linear-gradient(-45deg, rgba(200, 200, 200, 0.2) 25%, transparent 25%, transparent 50%, rgba(200, 200, 200, 0.2) 50%, rgba(200, 200, 200, 0.2) 75%, transparent 75%, transparent',
  backgroundSize: '1rem 1rem'
};
exports.bgStriped = bgStriped;

var loading = _objectSpread(_objectSpread({}, bgStriped), {}, {
  opacity: 0.5
}); // Search


exports.loading = loading;

var joinColor = function joinColor(join) {
  return {
    and: '#5bc0de',
    or: '#5cb85c',
    not: '#d9534f'
  }[join.join || join];
};

exports.joinColor = joinColor;

var bgJoin = function bgJoin(tree) {
  return {
    background: joinColor(tree),
    color: 'white'
  };
};

exports.bgJoin = bgJoin;

var bdJoin = function bdJoin(tree) {
  return {
    borderColor: joinColor(tree)
  };
};

exports.bdJoin = bdJoin;

var bgPreview = function bgPreview(join) {
  return _objectSpread(_objectSpread({}, bgJoin(join)), bgStriped);
};

exports.bgPreview = bgPreview;
var _default = {
  // Layout
  dFlex: dFlex,
  flexJustifyContentBetween: flexJustifyContentBetween,
  w100: w100,
  fullscreen: fullscreen,
  // Button
  btn: btn,
  roundedLeft0: roundedLeft0,
  roundedRight0: roundedRight0,
  // Misc
  bgStriped: bgStriped,
  // Search
  joinColor: joinColor,
  bgJoin: bgJoin,
  bdJoin: bdJoin,
  bgPreview: bgPreview
};
exports["default"] = _default;
//# sourceMappingURL=generic.js.map