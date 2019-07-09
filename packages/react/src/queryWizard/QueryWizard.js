import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultIcon from '../DefaultIcon'
import DefaultFilterButtonList from '../FilterButtonList'
import {
  CheckButton as DefaultCheckButton,
  Modal as DefaultModal,
} from '../layout'
import InjectTreeNode from '../utils/injectTreeNode'
import DefaultAccordionWizard from './AccordionWizard'

let QueryWizard = InjectTreeNode(
  ({
    AccordionWizard = DefaultAccordionWizard,
    FilterButtonList = DefaultFilterButtonList,
    CheckButton = DefaultCheckButton,
    Button = 'button',
    Modal = DefaultModal,
    Icon = DefaultIcon,
    tree,
    node,
    fields = {},
    title,
    mapNodeToProps = _.noop,
    mapNodeToLabel = _.noop,
    mapNodeToDescription = _.noop,
    className,
    style,
  }) => (
    <AccordionWizard {...{ Button, Icon, className, style }}>
      {F.mapIndexed(
        (child, i) => (
          <FilterButtonList
            {...{
              CheckButton,
              Button,
              Icon,
              Modal,
              node: child,
              tree,
              fields,
              mapNodeToProps,
              mapNodeToLabel,
              mapNodeToDescription,
            }}
            key={node.key}
            isRequired={i === 0}
            stepTitle={
              i === 0
                ? `Search for ${title ||
                    mapNodeToLabel(child, fields) ||
                    child.key} by...`
                : i < _.size(node.children) - 1
                ? `And...`
                : `Narrow Your Results`
            }
          />
        ),
        _.get('children', node)
      )}
    </AccordionWizard>
  )
)

QueryWizard.displayName = 'QueryWizard'
export default QueryWizard
