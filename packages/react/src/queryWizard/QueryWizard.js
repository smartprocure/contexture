import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import { observer } from 'mobx-react'
import DefaultCheckButton from '../layout/CheckButton'
import DefaultModal from '../layout/Modal'
import DefaultIcon from '../DefaultIcon'
import WizardStep from './WizardStep'
import { withStateLens } from '../utils/mobx-react-utils'

export default withStateLens({ current: 0 })(
  observer(
    ({
      tree,
      path,
      CheckButton = DefaultCheckButton,
      Button = 'button',
      Modal = DefaultModal,
      Icon = DefaultIcon,
      fields,
      mapNodeToProps,
      mapNodeToLabel,
      current,
      className,
    }) => (
      <div className={className}>
        {F.mapIndexed(
          (node, i) => (
            <WizardStep
              {...{
                node,
                tree,
                fields,
                mapNodeToProps,
                mapNodeToLabel,
                CheckButton,
                Button,
                Icon,
                Modal,
              }}
              key={node.key}
              step={i}
              currentStep={current}
              expanded={F.view(current) === i}
              totalSteps={_.size(tree.getNode(path).children)}
            />
          ),
          tree.getNode(path).children || []
        )}
      </div>
    )
  )
)
