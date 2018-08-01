import {
  dFlex,
  flexJustifyContentBetween,
  btn,
  roundedLeft0,
  w100,
} from './generic'

// Style Configuration
export let background = '#f0f8ff'
// let background = '#fff'
// let operatorHeight = 50
let operatorHeight = 35
// let operatorWidth = 100
let operatorWidth = 50
let ruleGutter = 15
// let ruleGutter = 50
let lineWidth = 2
// let lineWidth = 8

export let styles = {
  btn,
  w100,
  dFlex,

  // Indent and Placement Preview
  indent: {
    marginBottom: `${ruleGutter}px`,
    borderRadius: 5,
    zIndex: 1,

    minWidth: `${operatorWidth}px`,
    marginRight: `${ruleGutter}px`,

    borderBottomRightRadius: 0,
  },
  indentPreview: {
    marginBottom: `${ruleGutter}px`,
    borderRadius: 5,

    width: '100%',
    padding: '10px',
    lineHeight: '30px',
    borderLeft: 0,
    marginLeft: `-${ruleGutter + 5}px`, //+5 arbitrarily aligns bg slashes
    paddingLeft: ruleGutter * 2,
    ...roundedLeft0,
  },

  // Set up the left join line - color gets overriden
  conditions: {
    borderLeft: `${lineWidth}px solid black`,
    paddingLeft: `${(operatorWidth - lineWidth) / 2}px`,
    marginLeft: `${(operatorWidth - lineWidth) / 2}px`,
  },
  conditionsInner: {
    marginLeft: `-${operatorWidth}px`,
    width: '100%',
  },
  condition: {
    // Box around condtion
    padding: '10px',
    borderRadius: '5px',
    marginBottom: `${ruleGutter}px`,
    // border: 0,
    borderWidth: 1,
    borderLeftWidth: 1,
    // borderRightWidth: 1,
    // paddingLeft:0,
    borderStyle: 'solid',

    width: '100%',
    background: 'white',
    ...flexJustifyContentBetween,
  },

  // Operator
  operator: {
    width: `${operatorWidth}px`,
    marginRight: `${ruleGutter}px`,

    borderRadius: '5px',
    color: 'white',
    lineHeight: `${operatorHeight}px`,
    textAlign: 'center',
  },
  blankOperator: {
    width: `${operatorWidth / 2 + ruleGutter}px`,
    height: operatorHeight / 2,
    marginLeft: `${(operatorWidth - lineWidth) / 2}px`,
    background,
    borderBottom: `solid ${lineWidth}px black`,
  },
  operatorLine: {
    width: `${ruleGutter}px`,
    bottom: `${operatorHeight / 2}px`,
    height: `${lineWidth}px`,
    position: 'relative',
    left: `${operatorWidth}px`,
  },
  blankOperatorLineExtended: {
    width: operatorWidth / 2,
    top: -lineWidth,
    left: operatorWidth + ruleGutter - lineWidth,
  },
  operatorLineExtended: {
    width: `${operatorWidth / 2 + ruleGutter - lineWidth / 2}px`,
  },

  operatorPopover: {
    border: `solid 1px black`,
    marginLeft: operatorWidth + ruleGutter, // Set to 0 on wrapHover to avoid jumping
    marginTop: `-${operatorHeight + lineWidth}px`,
  },
}
