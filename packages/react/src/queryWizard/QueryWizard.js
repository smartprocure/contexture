import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultIcon from '../DefaultIcon'
import DefaultFilterButtonList from '../FilterButtonList'
import DefaultMissingTypeComponent from '../DefaultMissingTypeComponent'
import {
  CheckButton as DefaultCheckButton,
  Modal as DefaultModal,
  StepsAccordion as DefaultStepsAccordion,
  AccordionStep,
} from '../layout'
import InjectTreeNode from '../utils/injectTreeNode'

let generateStepTitle = (node, title) => i => (
  <h1>
    <span className="step-number">Step {i + 1} - </span>
    {i === 0
      ? `Search for ${title || 'Results'} by...`
      : i < _.size(node.children) - 1
      ? `And...`
      : `Narrow Your Results`}
  </h1>
)

let QueryWizard = InjectTreeNode(
  ({
    StepsAccordion = DefaultStepsAccordion,
    FilterButtonList = DefaultFilterButtonList,
    CheckButton = DefaultCheckButton,
    Button = 'button',
    Modal = DefaultModal,
    MissingTypeComponent = DefaultMissingTypeComponent,
    Icon = DefaultIcon,
    tree,
    node,
    fields = {},
    title,
    onSubmit = _.noop,
    mapNodeToProps = _.noop,
    style,
  }) => (
    <StepsAccordion {...{ Button, Icon, style, onSubmit }}>
      {F.mapIndexed(
        (child, i) => (
          <AccordionStep
            isRequired={i === 0}
            title={generateStepTitle(node, title)}
          >
            <FilterButtonList
              {...{
                CheckButton,
                Button,
                Icon,
                MissingTypeComponent,
                Modal,
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

QueryWizard.displayName = 'QueryWizard'
export default QueryWizard
