import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import OutsideClickHandler from 'react-outside-click-handler'
import { withNode } from '../utils/hoc'
import { Box, ButtonGroup, Button } from '../greyVest'
import ExpandableTagsInput, { Tags } from '../greyVest/ExpandableTagsInput'
import ExpandableTagsQuery from './ExpandableTagsQuery'

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
    data-testid="button-main-search"
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

let SearchButton = observer(({ tree, resultsPath, searchButtonProps }) => (
  <AnimatedButton
    disabled={!tree.getNode(resultsPath).markedForUpdate}
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
  resultsPath,
  actionWrapper,
  searchButtonProps,
  tagsQueryProps,
}) => {
  let collapse = React.useState(true)
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        F.on(collapse)()
      }}
      useCapture={false}
    >
      <ButtonGroup
        style={searchBarStyle}
        // The outside click handler listens for the onMouseUp event which takes priority over any onClick handlers in the children
        // So we need to add this handler to ensure that the child events are triggered appropriately
        onMouseUp={e => {
          e.stopPropagation()
        }}
      >
        <Box
          data-testid="main-search-bar"
          style={searchBarBoxStyle}
          onClick={F.off(collapse)}
        >
          <ExpandableTagsQuery
            {...{ tree, node, collapse, actionWrapper }}
            onAddTag={F.off(collapse)}
            Loader={({ children }) => <div>{children}</div>}
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
          <SearchButton
            tree={tree}
            resultsPath={resultsPath}
            searchButtonProps={searchButtonProps}
          />
        )}
      </ButtonGroup>
    </OutsideClickHandler>
  )
}

export default _.flow(observer, withNode)(SearchBar)
