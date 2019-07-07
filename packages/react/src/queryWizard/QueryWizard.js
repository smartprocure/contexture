import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultIcon from '../DefaultIcon'
import FilterButtonList from '../FilterButtonList'
import {
  CheckButton as DefaultCheckButton,
  Modal as DefaultModal,
} from '../layout'
import WizardAccordion from './WizardAccordion'

let QueryWizard = ({
  CheckButton = DefaultCheckButton,
  Button = 'button',
  Modal = DefaultModal,
  Icon = DefaultIcon,
  tree,
  path,
  fields,
  mapNodeToProps,
  mapNodeToLabel,
  className,
  style,
}) => (
  <WizardAccordion {...{ className, style }}>
    {(nodeChildren =>
      F.mapIndexed(
        (node, i) => (
          <FilterButtonList
            {...{
              CheckButton,
              Button,
              Icon,
              Modal,
              node,
              tree,
              fields,
              mapNodeToProps,
              mapNodeToLabel,
            }}
            key={node.key}
            isRequired={i === 0}
            stepTitle={
              i === 0
                ? `Search for ${node.key} by...`
                : i < _.size(nodeChildren) - 1
                ? `And...`
                : `Narrow Your Results`
            }
          />
        ),
        nodeChildren
      ))(tree.getNode(path).children || [])}
  </WizardAccordion>
)

QueryWizard.displayName = 'QueryWizard'
export default QueryWizard
