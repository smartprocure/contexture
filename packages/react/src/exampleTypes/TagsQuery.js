import React from 'react'
import _ from 'lodash/fp'
import F from 'futil-js'
import { contexturify } from '../utils/hoc'
import { getTagStyle } from '../utils/tagsQuery'
import { useLens } from '../utils/react'
import TagQueryPopover from './TagQueryPopover'

const field = 'word'

let TagsQuery = ({
  tree,
  node,
  placeholder,
  theme: { Popover, TagsInput, Tag },
  ...props
}) => {
  let TagWithPopover = ({ onClick, ...props }) => {
    let open = useLens(false)
    return (
      <>
        <Tag
          onClick={tag => {
            F.on(open)()
            onClick(tag)
          }}
          {...props}
        />
        <Popover open={open}>
          <TagQueryPopover {...{ tag: props.tag, node, tree }} />
        </Popover>
      </>
    )
  }

  return (
    <TagsInput
      splitCommas
      tags={_.map(field, node.tags)}
      addTag={tag => {
        tree.mutate(node.path, {
          tags: [...node.tags, { [field]: tag, distance: 3 }],
        })
      }}
      removeTag={tag => {
        tree.mutate(node.path, {
          tags: _.reject({ [field]: tag }, node.tags),
        })
      }}
      tagStyle={getTagStyle(node, field)}
      submit={tree.triggerUpdate}
      placeholder={placeholder}
      Tag={TagWithPopover}
      {...props}
    />
  )
}

export default contexturify(TagsQuery)
