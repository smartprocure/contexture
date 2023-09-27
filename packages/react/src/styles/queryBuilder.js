import { dFlex, btn, w100 } from './generic.js'

// Style Configuration
export let background = 'rgb(247, 247, 247)' //'#f0f8ff'
// let background = '#fff'
// let operatorHeight = 50
let operatorHeight = 35
// let operatorWidth = 100
let operatorWidth = 50
let ruleGutter = 25
// let ruleGutter = 50
let lineWidth = 2
// let lineWidth = 8
let borderRadius = 5

export let styles = {
  background,
  ruleGutter,
  lineWidth,
  operatorWidth,
  operatorHeight,
  borderRadius,

  w100,
  dFlex,

  // Reset button styles
  buttonStyleReset: {
    borderRadius,
    textTransform: 'none',
    letterSpacing: 'initial',
  },

  // Indent and Placement Preview
  indent: {
    width: operatorWidth,
    borderRadius,
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
    borderRadius,
    // border: 0,
    borderWidth: 1,
    borderLeftWidth: 1,
    // borderRightWidth: 1,
    // paddingLeft:0,
    borderStyle: 'solid',
    background: 'white',
  },
}
