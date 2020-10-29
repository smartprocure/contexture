"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.styles = exports.background = void 0;

var _generic = require("./generic");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Style Configuration
var background = 'rgb(247, 247, 247)'; //'#f0f8ff'
// let background = '#fff'
// let operatorHeight = 50

exports.background = background;
var operatorHeight = 35; // let operatorWidth = 100

var operatorWidth = 50;
var ruleGutter = 15; // let ruleGutter = 50

var lineWidth = 2; // let lineWidth = 8

var styles = {
  btn: _generic.btn,
  w100: _generic.w100,
  dFlex: _generic.dFlex,
  // Indent and Placement Preview
  indent: {
    marginBottom: "".concat(ruleGutter, "px"),
    borderRadius: 5,
    zIndex: 1,
    minWidth: "".concat(operatorWidth, "px"),
    marginRight: "".concat(ruleGutter, "px"),
    borderBottomRightRadius: 0
  },
  indentPreview: _objectSpread({
    marginBottom: "".concat(ruleGutter, "px"),
    borderRadius: 5,
    width: '100%',
    padding: '10px',
    lineHeight: '30px',
    borderLeft: 0,
    marginLeft: "-".concat(ruleGutter + 5, "px"),
    //+5 arbitrarily aligns bg slashes
    paddingLeft: ruleGutter * 2
  }, _generic.roundedLeft0),
  // Set up the left join line - color gets overriden
  conditions: {
    borderLeft: "".concat(lineWidth, "px solid black"),
    paddingLeft: "".concat((operatorWidth - lineWidth) / 2, "px"),
    marginLeft: "".concat((operatorWidth - lineWidth) / 2, "px")
  },
  conditionsInner: {
    marginLeft: "-".concat(operatorWidth, "px"),
    width: '100%'
  },
  condition: _objectSpread({
    // Box around condtion
    padding: '10px',
    borderRadius: '5px',
    marginBottom: "".concat(ruleGutter, "px"),
    // border: 0,
    borderWidth: 1,
    borderLeftWidth: 1,
    // borderRightWidth: 1,
    // paddingLeft:0,
    borderStyle: 'solid',
    width: '100%',
    background: 'white'
  }, _generic.flexJustifyContentBetween),
  // Operator
  operator: {
    width: "".concat(operatorWidth, "px"),
    marginRight: "".concat(ruleGutter, "px"),
    borderRadius: '5px',
    color: 'white',
    lineHeight: "".concat(operatorHeight, "px"),
    textAlign: 'center'
  },
  blankOperator: {
    width: "".concat(operatorWidth / 2 + ruleGutter, "px"),
    height: operatorHeight / 2,
    marginLeft: "".concat((operatorWidth - lineWidth) / 2, "px"),
    background: background,
    borderBottom: "solid ".concat(lineWidth, "px black")
  },
  operatorLine: {
    width: "".concat(ruleGutter, "px"),
    bottom: "".concat(operatorHeight / 2, "px"),
    height: "".concat(lineWidth, "px"),
    position: 'relative',
    left: "".concat(operatorWidth, "px")
  },
  blankOperatorLineExtended: {
    width: operatorWidth / 2,
    top: -lineWidth,
    left: operatorWidth + ruleGutter - lineWidth
  },
  operatorLineExtended: {
    width: "".concat(operatorWidth / 2 + ruleGutter - lineWidth / 2, "px")
  },
  operatorPopover: {
    border: "solid 1px black",
    marginLeft: operatorWidth + ruleGutter,
    // Set to 0 on wrapHover to avoid jumping
    marginTop: "-".concat(operatorHeight + lineWidth, "px")
  }
};
exports.styles = styles;
//# sourceMappingURL=queryBuilder.js.map