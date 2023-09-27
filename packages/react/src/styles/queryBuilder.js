import {
  dFlex,
  flexJustifyContentBetween,
  btn,
  roundedLeft0,
  w100,
} from './generic.js'

// Style Configuration
export let background = 'rgb(247, 247, 247)' //'#f0f8ff'
// let background = '#fff'
// let operatorHeight = 50
let operatorHeight = 35
// let operatorWidth = 100
let operatorWidth = 50
let ruleGutter = 15
// let ruleGutter = 50
let lineWidth = 1.5
// let lineWidth = 8

export let styles = {
  background,
  ruleGutter,
  lineWidth,
  operatorWidth,
  operatorHeight,

  btn,
  w100,
  dFlex,

  // Indent and Placement Preview
  indent: {
    width: operatorWidth,
    borderRadius: 5,
    borderBottomRightRadius: 0,
  },
  indentPreview: {
    width: '100%',
    height: operatorWidth,
    textTransform: 'none',
    letterSpacing: 'initial',
  },

  // Set up the left join line - color gets overriden
  condition: {
    // Box around condtion
    padding: '10px',
    borderRadius: '5px',
    // border: 0,
    borderWidth: lineWidth,
    borderLeftWidth: 1,
    // borderRightWidth: 1,
    // paddingLeft:0,
    borderStyle: 'solid',
    background: 'white',
  },
}
