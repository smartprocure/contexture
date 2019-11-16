import React from 'react'
import F from 'futil'
import _ from 'lodash/fp'
import { observer } from 'mobx-react'
import OutsideClickHandler from 'react-outside-click-handler'
import { useLensObject } from '../utils/react'
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
    className={`${
      disabled ? 'disabled' : 'animated pulse infinite'
    } ${className || ''}`}
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
}) => {
  let collapse = React.useState(true)
  let popoverState = useLensObject({ open: false, tagOpen: '' })
  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        F.on(collapse)()
        F.off(popoverState.open)()
        F.set('', popoverState.tagOpen)
      }}
    >
      <ButtonGroup style={searchBarStyle}>
        <Box style={searchBarBoxStyle} onClick={F.off(collapse)}>
          <ExpandableTagsQuery
            {...{ tree, node, collapse, popoverState, actionWrapper }}
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

export default _.flow(
  observer,
  withNode
)(SearchBar)
