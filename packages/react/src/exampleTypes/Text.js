import React from 'react'
import _ from 'lodash/fp'
import { inject } from 'mobx-react'
import injectTreeNode from '../utils/injectTreeNode'
import LensInput from '../layout/LensInput'

let Text = injectTreeNode(
  inject((context, { tree, node, prop = 'value' }) => ({
    lens: tree.lens(node.path, prop)
  }))(LensInput)
)

export default Text