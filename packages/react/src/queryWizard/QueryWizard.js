import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultIcon from '../DefaultIcon'
import DefaultFilterButtonList from '../FilterButtonList'
import DefaultMissingTypeComponent from '../DefaultMissingTypeComponent'
import {
  CheckButton as DefaultCheckButton,
  Modal as DefaultModal,
} from '../layout'
import InjectTreeNode from '../utils/injectTreeNode'
import DefaultStepsAccordion from './StepsAccordion'

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
    className,
    style,
  }) => (
    <StepsAccordion {...{ Button, Icon, className, style, onSubmit }}>
      {F.mapIndexed(
        (child, i) => (
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
            isRequired={i === 0}
            stepTitle={
              i === 0
                ? `Search for ${title || 'Results'} by...`
                : i < _.size(node.children) - 1
                ? `And...`
                : `Narrow Your Results`
            }
          />
        ),
        _.get('children', node)
      )}
    </StepsAccordion>
  )
)

QueryWizard.displayName = 'QueryWizard'
export default QueryWizard
