import _ from 'lodash/fp'
import F from 'futil-js'
import React from 'react'
import DefaultCheckButton from '../layout/CheckButton'
import DefaultModal from '../layout/Modal'
import { Flex } from '../layout/Flex'
import FilterItem from './FilterItem'
/* node:
{
  type: 'group',
  join: 'and',

}
*/

export default ({
  node,
  tree,
  CheckButton = DefaultCheckButton, 
  Button = 'button', 
  Modal = DefaultModal, 
  fields,
  mapNodeToProps,
  stepNumber}) => {
  let modal = F.stateLens(React.useState(false))
  return (
    <div>
      <h1>Step {stepNumber + 1} - Search for {node.friendlyName || node.key}</h1>
      <Flex>
        {_.map(child =>
          <div key={child.key}>
            <CheckButton checked={node.hasValue} onClick={F.on(modal)}>{child.friendlyName || child.key}</CheckButton>
            <Modal isOpen={modal}>
              <FilterItem node={child} tree={tree} mapNodeToProps={mapNodeToProps} fields={fields} />
              <Button onClick={() => tree.clear(child.path)}>Clear</Button>
              <Button primary onClick={F.off(modal)}>Done</Button>
            </Modal>
          </div>,
          _.getOr([], 'children', node)
        )}
      </Flex>
      <Button primary>Continue</Button>
    </div>
  )
}
