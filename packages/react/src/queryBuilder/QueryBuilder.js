import React from 'react'
import { observable } from 'mobx'
import DDContext from './DragDrop/DDContext'
import { Component } from '../utils/mobx-react-utils'
import { Modal as DefaultModal, NestedPicker } from '../layout/'
import Group from './Group'
import styles from '../styles'

let { background } = styles

export default DDContext(
  Component(
    (
      { tree: iTree, types: iTypes, typeComponents: iTypeComponents },
      {
        typeComponents = iTypeComponents,
        types = iTypes || typeComponents,
        tree = iTree,
      }
    ) => ({
      types,
      state: observable({
        adding: false,
        ...tree,
      }),
    }),
    ({
      state,
      path,
      fields,
      types = {},
      Button = 'button',
      Modal = DefaultModal,
      Picker = NestedPicker,
      mapNodeToProps,
      MissingTypeComponent,
    }) => (
      <div style={{ background }}>
        {state.getNode(path) && (
          <Group
            node={state.getNode(path)}
            tree={state}
            isRoot={true}
            {...{
              Button,
              Modal,
              Picker,
              fields,
              types,
              mapNodeToProps,
              MissingTypeComponent,
            }}
          />
        )}
        <Button
          onClick={() => {
            state.adding = !state.adding
          }}
        >
          {state.adding ? 'Cancel' : 'Add Filter'}
        </Button>
      </div>
    ),
    'QueryBuilder'
  ),
  { allowEmptyNode: true } // false alarm, this one's for DDContext
)
