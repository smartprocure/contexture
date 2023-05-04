import React from 'react'
import F from 'futil'
import _ from 'lodash/fp.js'
import { observer } from 'mobx-react'
import OutsideClickHandler from 'react-outside-click-handler'
import { withNode } from '../utils/hoc.js'
import { Box, ButtonGroup, Button, StripedLoader } from '../greyVest/index.js'
import ExpandableTagsInput, { Tags } from '../greyVest/ExpandableTagsInput.js'
import ExpandableTagsQuery from './ExpandableTagsQuery/index.js'

let searchBarStyle = {
  overflow: 'visible', // for the search button animation
}

let searchBarBoxStyle = {
  padding: '8px 10px',
  flex: 1,
}

let inputStyle = {
  border: 'none',
}

let buttonStyle = {
  boxShadow: '0 2px 10px 0 rgba(39, 44, 65, 0.1)',
  fontSize: 18,
  maxHeight: 56,
}

let AnimatedButton = ({ disabled, style, className, ...props }) => (
  <Button
    className={`${disabled ? 'disabled' : 'animated pulse infinite'} ${
      className || ''
    }`}
    // BG Color is 50% white + primary button background, replacing 50% opacity
    style={{
      ...style,
      ...(disabled ? { backgroundColor: '#80BBEF' } : {}),
      animationDuration: '500ms',
    }}
    primary
    {...props}
  />
)

let SearchButton = observer(({ tree, searchButtonProps }) => (
  <AnimatedButton
    disabled={!tree?.tree?.markedForUpdate}
    onClick={tree.triggerUpdate}
    style={buttonStyle}
    {...searchButtonProps}
  >
    Search
  </AnimatedButton>
))

let SearchBar = ({
  tree,
  node,
  actionWrapper,
  searchButtonProps,
  tagsQueryProps,
  enableKeywordGenerations,
}) => {
  let collapse = React.useState(true)
  return (
    <OutsideClickHandler.default
      onOutsideClick={() => {
        F.on(collapse)()
      }}
      useCapture={false}
    >
      <ButtonGroup
        data-path={node.path}
        style={searchBarStyle}
        // The outside click handler listens for the onMouseUp event which takes priority over any onClick handlers in the children
        // So we need to add this handler to ensure that the child events are triggered appropriately
        onMouseUp={(e) => {
          e.stopPropagation()
        }}
      >
        <Box style={searchBarBoxStyle} onClick={F.off(collapse)}>
          <ExpandableTagsQuery
            {...{
              tree,
              node,
              collapse,
              actionWrapper,
              enableKeywordGenerations,
            }}
            onAddTag={F.off(collapse)}
            Loader={({ children, ...props }) => (
              <StripedLoader {...props}>{children}</StripedLoader>
            )}
            style={inputStyle}
            theme={{
              TagsInput:
                F.view(collapse) && !_.isEmpty(node.tags)
                  ? Tags
                  : ExpandableTagsInput,
            }}
            autoFocus
            {...tagsQueryProps}
          />
        </Box>
        {tree.disableAutoUpdate && (
          <SearchButton tree={tree} searchButtonProps={searchButtonProps} />
        )}
      </ButtonGroup>
    </OutsideClickHandler.default>
  )
}

export default _.flow(observer, withNode)(SearchBar)
