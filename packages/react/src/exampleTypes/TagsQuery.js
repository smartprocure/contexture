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
  theme: { Popover, TagsInput },
  ...props
}) => {
  let openTag = useLens('')
  return (
    <TagsInput
      splitCommas
      tags={_.map(field, node.tags)}
      onTagClick={tag => {
        F.set(tag, openTag)
      }}
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
      wrapTag={Tag => tagProps => (
        <>
          <Tag {...tagProps} />
          <Popover
            isOpen={F.view(openTag) === tagProps.tag}
            onClose={F.sets('', openTag)}
          >
            <TagQueryPopover {...{ tag: tagProps.tag, node, tree }} />
          </Popover>
        </>
      )}
      {...props}
    />
  )
}

export default contexturify(TagsQuery)
