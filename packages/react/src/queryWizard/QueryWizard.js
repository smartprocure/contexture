import _ from 'lodash/fp.js'
import F from 'futil'
import React from 'react'
import { setDisplayName } from 'react-recompose'
import FilterButtonList from '../FilterButtonList.js'
import { StepsAccordion, AccordionStep } from '../purgatory/index.js'
import { withNode } from '../utils/hoc.js'
import { withTheme } from '../utils/theme.js'

let generateStepTitle = (node, title) => i =>
  (
    <h1>
      <span className="step-number">Step {i + 1} - </span>
      {i === 0
        ? `Search for ${title || 'Results'} by...`
        : i < _.size(node.children) - 1
        ? `And...`
        : `Narrow Your Results`}
    </h1>
  )

let QueryWizard = _.flow(
  setDisplayName('QueryWizard'),
  withNode,
  withTheme
)(
  ({
    tree,
    node,
    fields = {},
    title,
    onSubmit = _.noop,
    mapNodeToProps = _.noop,
    style,
  }) => (
    <StepsAccordion {...{ style, onSubmit }}>
      {F.mapIndexed(
        (child, i) => (
          <AccordionStep
            key={i}
            isRequired={i === 0}
            title={generateStepTitle(node, title)}
          >
            <FilterButtonList
              {...{
                node: child,
                tree,
                fields,
                mapNodeToProps,
              }}
              key={node.key}
            />
          </AccordionStep>
        ),
        _.get('children', node)
      )}
    </StepsAccordion>
  )
)

export default QueryWizard
