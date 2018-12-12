import React from 'react'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import injectTreeNode from '../utils/injectTreeNode'
import { exampleTypes } from 'contexture-client'
import { bgJoin } from '../styles/generic'
import { TagsInput as DefaultTagsInput } from '../layout/TagsInput'

let tagToGroupJoin = x =>
  ({
    any: 'or',
    all: 'and',
    none: 'not',
  }[x])
let tagValueField = 'word'
let TagsQuery = injectTreeNode(
  observer(({ tree, node, TagsInput = DefaultTagsInput, placeholder }) => (
    <TagsInput
      splitCommas
      tags={_.map(tagValueField, node.tags)}
      addTag={tag => {
        tree.mutate(node.path, {
          tags: [...node.tags, { [tagValueField]: tag, distance: 3 }],
        })
      }}
      removeTag={tag => {
        tree.mutate(node.path, {
          tags: _.reject({ [tagValueField]: tag }, node.tags),
        })
      }}
      tagStyle={bgJoin(tagToGroupJoin(node.join || 'any'))}
      submit={tree.triggerUpdate}
      placeholder={placeholder}
    />
  )),
  exampleTypes.tagsQuery
)
TagsQuery.displayName = 'TagsQuery'

export default TagsQuery
