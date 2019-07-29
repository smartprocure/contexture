# 1.54.6
* Tweaks and fixes to QueryWizard & StepsAccordion

# 1.54.5
* Add support for type labels to type selection options in FilterList/QueryBuilder
* ResultTable: Pass additional props to Row

# 1.54.4
* New helper function `newNodeFromField`

# 1.54.3
* Allow to pass-through props from TagsQuery to the actual input in TagsInput

# 1.54.2
* GreyVest: Standardize FieldPicker modal across FilterList & QueryBuilder

# 1.54.1
* Update max-height / max-width for modal component

# 1.54.0
* Add one line support for the TagsInput component

# 1.53.0
* Add QueryWizard
* Add FilterButtonList

# 1.52.0
* Add CheckButton component

# 1.51.0
* Add field options to title popover in FilterList

# 1.50.0
* Add type options to title popover in FilterList

# 1.49.10
* Remove accidentally added line :(

# 1.49.9
* QueryBuilder: Fix Indentable AddPreview preview showing wrong join type

# 1.49.8
* QueryBuilder: Remove ContextureClientBridge

# 1.49.7
* Rename all instances of `tree` to `node` in QueryBuilder props

# 1.49.6
* Fix Select placeholder rendering

# 1.49.5
* Simplify QueryBuilder and contexture-mobx with the latest contexture-client

# 1.49.4
* Add minWidth to TagsInput

# 1.49.3
* Fix error when adding a new field in QueryBuilder

# 1.49.2
* Shrink font sizes to match design

# 1.49.1
* TagsInput: Remove 100% height
* StripedLoader: Remove 100% height
* Storybook: Center TagsInput in the search bar in GreyVest

# 1.49.0
* New grey vest component: ErrorBlock

# 1.48.14
* Removed Jest Snapshot tests.

# 1.48.13
* Flex: Add extra props for easier styling

# 1.48.12
* Facet: apply options filter change on submit button click

# 1.48.11
* TagsInput: Accept style prop

# 1.48.10
* New grey vest search component: ToggleFiltersHeader

# 1.48.9
* TermsStatsTable: Add margin to size dropdown to align with table

# 1.48.8
* TagsInput: Better validation on the input

# 1.48.7
* StripedLoader: Fix regression in 1.48.6

# 1.48.6
* StripedLoader: Fix loading styles

# 1.48.5
* Modal: Export themed from greyVest

# 1.48.4
* TagsInput > Tag: Render remove icon conditionally

# 1.48.3
* Handle null better in the DateInput component

# 1.48.2
* Handle null children in SearchFilters and TreePauseButton
* Fix ResultsTable inline filtering without Provider
* Expose missing `schemaFieldProps` and `componentForType`, `fieldsFromSchema` utils

# 1.48.1
* TagsQuery: Add stories
* TagsInput: Center tags
* TagsInput: Simplify greyvest styling
* TagsInput: Adjust margins to look nice when tags wrap around
* StripedLoader: Style with "display: contents" so it doesn't mess up grid/flex layouts

# 1.48.0
**Requires React 16.8**

## New Components
* GreyVest: Add SearchFilters
* GreyVest: Add AddableFilterList
* GreyVest: Add FiltersBox
* GreyVest: Add ToggleFiltersButton
* GreyVest: Add TreePauseButton
* GreyVest: Add SearchLayout
* GreyVest: Add Tabs (complete replacement of existing control)

## API Improvements
* GreyVest: Renamed Tabs to TabList
* GreyVest -> TabList: Pass `from` as second param to onChange
* FilterList: Fix bug with node actions not working without Provider
* GreyVest: Storybook refactoring (add decorator)
* Storybook: General Cleanup (no more headers on dev, etc)
* Added some basic prop-types support (will improve over time)

## Styling/Design Improvements
* GreyVest -> Button: Remove css outline

# 1.47.3
* Storybook: Organize categories

# 1.47.2
* Fix Checkbox dependency in CheckboxList

# 1.47.1
* DateInput: Always convert input to Date

# 1.47.0
## New Components
* GreyVest: Add Box
* GreyVest: Add LinkButton
* GreyVest: Added PagedResultTable

## API Improvements
* ResultTable: Make typeComponents optional
* FilterList: Make typeComponents optional
* FilterList: Fix bug with usage without Provider
* QueryBuilder: Add support for mapNodeToProps and MissingTypeComponent
* QueryBuilder: Allow typeComponents as an alias for types to match the FilterList API

## Styling/Design Improvements
* ResultCount: Remove Paging Info
* GreyVest: Styling improvements - center tabs, improve query builder styling to set things to a min height of 40px
* QueryBuilder -> FilterContents: Handle Nodes with types missing from typeOptions (by adding the current type to the drop down)
* QueryBuilder -> FilterContents: Show field if there is not label instead of a blank button
* GreyVest: Improve radio list styling (for advanced search)

# 1.46.0
* Update dependencies: babel 7, storybook 5, other dev dependencies
* Clean up storybook in general, streamlining storybook creation
* Add Story source addon
* Split grey vest into separate files

# 1.45.3
* Export styled TagsInput from greyVest theme

# 1.45.2
* Minor styling changes to search toolbar and search toolbar icons

# 1.45.1
* Round findBestRange result if significantDigits is set in Number component
* Number component supports setting significantDigits: 0

# 1.45.0
* Preserve geo filter dropdown state across renders.
* Do not return `location` from `utils/geo.js:loadHereOptions`

# 1.44.0
* Number component allows rounding decimal expansions to n digits with `signficantDigits` prop

# 1.43.11
* Ability to override the Loading component in injectTreeNode

# 1.43.10
* Fix loading styles for all components

# 1.43.9
* TagsInput: edit tag when backspace is pressed and no input is present.

# 1.43.8
* Set overflow: auto on table's horizontal axis

# 1.43.7
* Fix Date example type component's select

# 1.43.6
* Geo filter address formatting house # fix.

# 1.43.5
* Geo filter address formatting adjustments.

# 1.43.4
* Implemented support for setting bucket size on term stats via term stats table component.

# 1.43.3
* Add "Applies to all keywords" text

# 1.43.2
* Hide scrollbars when the content fits

# 1.43.1
* Date example type: correctly initialize select component.

# 1.43.0
* FilterList: Ability to delete a filter

# 1.42.1
* Downgrade danger peer dependency

# 1.42.0
* FilterList: Ability to clear a filter

# 1.41.7
* Add danger as a peer dependency

# 1.41.6
* Text example type: set display name
* StripedLoader: do not forward loading prop to child component

# 1.41.5
* CSS changes in regards to the tags remove size "button".

# 1.41.4
* ResultTable needs to prevent the popover from closing if a modal is open.

# 1.41.3
* Hotfix: do not trigger a tag popover when removing a tag in a search input

# 1.41.2
* Fix an issue sorting nested FieldPicker contents

# 1.41.1
* GreyVest: shorten animation duration for the refresh icon

# 1.41.0
* implement otherMatches bool on results node, default to false

# 1.40.1
* Popovers now close when users click outside of them.

# 1.40.0
* New style "gv-link-button", to use a button in place of an <a> tag with no 
  href

# 1.39.3
* FieldPicker options sortable, default alpha by label

# 1.39.2
* TagsInput: Preserve state between renders

# 1.39.1
* even horizontal padding on .gv-button

# 1.39.0
* New example type: mongoId; equivalent to a "text" example type

# 1.38.6
* GreyVest: Fix Refresh icon button pulse speed

# 1.38.5
* Pass along NumberInput to `Geo` example type

# 1.38.4
* Fix unique key React warning in ResultTable's HighlightedColumn tr

# 1.38.3
* Update default modal styling

# 1.38.2
* Fix `a` tag on Other Matches column to have a blank href

# 1.38.1
* Short other matches text and make it a proper link

# 1.38.0
* Change Other Matches column not to list every matching field to save space
* Fix Other Matches column rendering when there are no other matches
* Rename "Filter Options" in `ResultTable` to "Filter"

# 1.37.2
* Fix Date Picker styling in grey vest to match grey vest theme

# 1.37.1
* Add support for fields with dots in schema utils for defaultNodeProps lookup

# 1.37.0
* Add Layout -> Portal
* Layout -> Modal: Wrap in Portal
* FilterAdder: Add defaultNodeProps support
* GreyVest: Add defaultNodeProps example for `year` (sets `min` to 2005 when type is `number`)

# 1.36.0
* ExampleTypes/Date: use `react-date-picker` with HTML5 opt-out

# 1.35.1
# GreyVest: remove `position: sticky` from search bar

# 1.35.0
* FilterList: Add refresh icon to filter label when there is a pending update in the associated tree. Add css class to customize filter label display when the filter has value(s).
* TermsStatsTable: Make the criteria column have a blank header caption by default

# 1.34.6
* TagsQuery: check existence of `node` before looking for `node.join`

# 1.34.5
* NestedPicker: Whitelist props for a React DOM element when a custom Item is not being passed

# 1.34.4
* QueryBuilder: Fix weird spacing caused by flex instead of grid
* GreyVest: Fix input indentation
* ResultTable: Fix "double click" issue when inline filtering on a node that needs to be added

# 1.34.3
* ResultTable: Implemented a more robust algorithm to move columns.
* GreyVest: Included a hidden field 'imdbId' to test the new move columns algorithm.

# 1.34.2
* ResultTable: Lookup field labels in ResultTable other matches
* ResultTable: Dont highlight field names
* ResultTable: Fix other matches cursor
* GreyVest: Add inline title highlighting and additional writers highlighting

# 1.34.1
* Fixed inconsistent column header for the highlighted records on the ResultTable.

# 1.34.0
* Add Bool and Exists example types with GreyVest example

# 1.33.2
* ResultsTable: Inline filtering on paused nodes will now be un-paused instead of silently failing.
* GreyVest: Added a paused node example.

# 1.33.1
* Export RadioList from greyvest theme

# 1.33.0
* Add sorting capability to TermsStatsTable. Allow passing theme Button component to TermsStatsTable. Allow overriding the filter field and a value transformer for the filter field for TermsStatsTable.

# 1.32.2
* Fixes second occurence of baseline aligned checkbox labels

# 1.32.1
* ResultTable now exposes a Row property.

# 1.32.0
* improves checkbox and label styling in Facet example type

# 1.31.0
* TagsQuery: Add tag popover with support for changing join, per tag distance (0 vs 3 distance as "fuzzy" v "exact"), exact toggle, per tag disabling, and an apply distance to all tags link
* TagsText: Add Support
* TagsInput: Add tag popover support
* TagsInput: Add splitCommas prop to automatically split tags on comma (on paste and as you type)
* Number: More classNames added for styling hooks
* Layout: Added RadioList base component
* GreyVest: Added Custom RadioList (and used in Facet)
* GreyVest: Better styling on Number
* FilterList: Better error handling for missing types and labels

# 1.30.2
* Use `_.toArray` instead of `.slice()` to protect against undefined values.

# 1.30.1
* Fix the DateRangePicker OnChange issue

# 1.30.0
* Allow passing ref to Input, Textarea, Select in greyVest

# 1.29.3
* ResultTable: Fix an issue with default node to props map

# 1.29.2
* TermsStatsTable: Fixed potential crash if any of the children were null
  (such as if a children was either a component or null, which is
  valid React and JSX).

# 1.29.1
* GreyVest: Fix TagsInput tag spacing

# 1.29.0
* FilterList: Add support for groups, allowing it to render anything QueryBuilder can!
* QueryBuilder: Fix support for TagsQuery (was checking for join instead of children)
* QueryBuilder: Make Rule hover same as background
* QueryBuilder: Change default background
* QueryBuilder: Pass along button component prop
* GreyVest: Theme FilterList groups properly
* GreyVest: Prefill QueryBuilder with gv button
* GreyVest: Remove extra default margins on inputs
* IMDB GreyVest Story: Add a toggle to switch between FilterList and QueryBuilder in real time

# 1.28.1
* Add z-index to `sticky` search-bar

# 1.28.0
* Factor out Select layout compnent
* GreyVest: Add danger and success button colors
* GreyVest: Add error text and error list
* GreyVest: Textarea and Selects
* GreyVest: CheckboxList and RadioList
* GreyVest: Add missing display names

# 1.27.2
* TermsStatsTable now accepts a custom Filter property, to optionally
  replace its entire filter.

# 1.27.1
* GeoFilter util now accepts parameter for its hereMaps configuration

# 1.27.0
* Added nested support to the field picker. To nest options, add a `path` prop on fields before passing along to an Adder (which is also used by ResultsTable)
* Fixed Modal max-width to be fit-content instead of arbitrarily 500px
* Allow overriding the Picker in ModalFilterAdder

# 1.26.2
* Small performance improvement on CheckableResultsTable.

# 1.26.1
* Replaced all uses of `partial` with `defaultProps` from recompose.

# 1.26.0
* TagsQuery: Add custom placeholder support
* TagsInput: Add custom placeholder support
* Facet: Add formatCount support
* Facet: Make the select all label clickable
* ExpandableTable: Add expanded class to rows that are expanded
* ResultPager: Add a clamped +/-5 page button
* ResultPager: Add support for paging Icon overrides
* ResultPager: hide pager if only 1 page and support className override
* GreyVest: Increase spacing between facet options and left alight include toggle
* GreyVest: Give nested tables a grey background
* GreyVest ResultPager: hide disabled items, add margin between left/right page and +/-5 page, use chevron icons 
* GreyVest: Update tab padding
* GreyVest: Facet spacing tweaks

# 1.25.0
* Made the checkable tables capable of selecting all the visible results.
* Remove the three dots from the results table.

# 1.24.0
* Added CheckableTermsStatsTable

# 1.23.0
* Added optional formatter to number type

# 1.22.0
* Improved the Table Layout for terms_stats to allow users to search
  the terms_stats results, use the results as filters to their
  searches and anything else through the use of custom parameters.

# 1.21.0
* GreyVest: Complete design overhaul, now looks a bit more "material" like
* GreyVest: Add IconButton
* GreyVest: Add Tabs
* GreyVest: Add SearchBar
* GreyVest: Add gv-grid
* ResultsTable: Make Icons Customizable
* FilterList: Make Icons Customizable
* FilterList: Add mapNodeToLabel
* Popover: Fewer default styles (allows it to look better in GreyVest)
* Add Blueberry theme (snapshot of < 1.21 Grey Vest)

# 1.20.2
* IE11 fixes. Our last build was using map wrong in one of the
  occurrences (I messed up the parenthesis). Besides that, I found that
  the compiled code out of `[...child.path]` (where child.path is an
  array) would break on IE11. This is due to `child.path` being an
  observable array.

# 1.20.1
* IE11 fixes. On IE11, React's children object doesn't have a `map`
  method.

# 1.20.0
* Moved showBestRange from tree to prop on Number component.

# 1.19.0
* Add table layout support for terms stats type.

# 1.18.0
* Support best range for Number component

# 1.17.0
* Added support for mapNodeToProps on ResultTable.

# 1.16.0
* Added a column that shows the additional matching fields on ResultsTable.

# 1.15.0
* GreyVest: Tag design styline
* GreyVest: Add Fonts to greyVest (including font awesome)
* TagsQuery: Add tag onBlur
* TagsQuery: Prevent creating empty tags
* TagsQuery: Call triggerUpdate on submit
* TagsInput: Introduce "submit" concept (pressing enter with no contents in tags input)
* TagsInput: Add a class to the tags input remove button
* ResultsTable: Remove default table row height of 100
* Popover: Tweak default styling
* Update futil and remove actout in favor of domLens

# 1.14.2
* Add the geo coding for the geo filter.

# 1.14.1
* On ResultTable, fixed the HeaderCellDefault to receive only
  activeFilter, style, and children.

# 1.14.0
* Add geo filter.

# 1.13.2
* Only use needed provider in FilterList component.

# 1.13.1
* Updated duti to it's latest version.

# 1.13.0
* Allow excluding results fields from visible ResultsTable columns using the fields property.

# 1.12.0
* Don't show sort options for column in `ResultTable` if `disableSort` is set to true.
* Hide column menu after clicking sort option.

# 1.11.1
* Fixed tests

# 1.11.0
* Set `displayName` for components so they're visible in React dev tools.
* Don't show `+ Filter` for column if `typeDefault` is not set or `disableFilter` is set to true.

# 1.10.1
* Added the availability to access the record's _id as part of the
  results obtained from the getRecord function of ResultTable.

# 1.10.0
* Add support for collapsing and pausing facet components in FilterList.

# 1.9.5
* Add support to ResultTable for displaying cell values from nested objects
  when the cell value is not a simple object such a string/number.

# 1.9.4
* Made the Popover component work properly when the parent component
  can be horizontally scrolled and it's width exceeds the width of the
  page.

# 1.9.3
* Make grey vest checkbox use a real checkbox so the event api of onChange has parity with native
* Make facet options clickable anywhere on the row, instead of just on the label/checkbox
* Make ResultTable respect HeaderCell from field schema
* Internal refactoring of futil candidates / actout util

# 1.9.2
* Removed min-width from gv-table thead tr

# 1.9.1
* The Modal should have zIndex:1

# 1.9.0
* Add CheckableResultsTable

# 1.8.0
* Add support for `mapNodeToProps` on `FilterList`
* Add support for `displayBlank` on `Facet`, which defaults to <i>Not Specified</i>
* Make the main npm script be `dist` to support importing direct from contexture-react
* Make inject tree node generate deterministic nodeKey if not provided
* Make ResultCount be inline-block and add inject tree node style support

# 1.7.2
* Made Grey Vest able to compose styles.

# 1.7.1
* Republish with build (CI published failed due to revoked token)

# 1.7.0
* Add support for column filtering and reordering to `ResultTable`
* Add support for `loadingAware` flag on injectTreeNode
* Make `ResultTable` loading indicator only apply to the body and not the headers
* Make `ResultTable` HeaderCell configurable (includes `activeFilter` prop)

# 1.6.0
* Add support for adding columns to `ResultTable` (note that it doesn't work with `infer`ed fields)
* Improve ResultTable field drop down styling
* Add Text example type
* Add LensInput to layout
* Export FilterAdder, ModalFilterAdder, FilterList components, and Layout components at the root for easier importing

# 1.5.1
* Support disabling pager items in grey vest
* Don't rerender from StripedLoader when changing styles
* Add basic IE11 grid support

# 1.5.0
* Add `display` support to `Facet` example type to format options

# 1.4.2
* Fix import paths

# 1.4.1
* Downgrade mobx to 4 and move mobx deps to peer dependencies

# 1.4.0
* Add TagsQuery example component
* Add DateRangePicker
* Add Grey Vest theme
* Add Select All and Include/Exclude to Facet
* Add basic TagsInput and Grid to layout
* Add ModalFilterAdder
* Improve styling all around

# 1.3.2
* Support dots in field names in FilterList
* Add basic search example for schema explorer, with loadable schema overrides

# 1.3.1
* Small styling improvements on charts and facet and refactoring
* Fix result table schema auto detect bug when fields are arrays
* Improved storybook styling
* Added new storybook demo theme (on search button)

# 1.3.0
* Add StripedLoader
* Add `loading` to injectTreeNode to abstract updating vs markedForUpdate
* Use StripedLoader in injectTreeNode automatically
* Add SearchButton Story (uses disableAutoUpdate from contexture-client)

# 1.2.1
* Fix TermsStats export
* Bump client dependency

# 1.2.0
* Add TermsStats example type and BarChart in Layout
* Fix includes bug in results table
* Add cardinality and show more to Facet
* Add basic Save/Load in new debug panel to explorer story

# 1.1.0
* Improved ES schema utils to account for mode map
* Add display names to example type components
* Add injectDefaults

# 1.0.1
* Fixed an immutable issue. See: https://github.com/smartprocure/contexture-react/pull/31

# 1.0.0
* Rearranged exports
* `example-types` are now exposed as `exampleTypes/` and are broken into separate files instead of `components.js`
* `Popover`, `Flex`, and `SpacedList` moved from `example-types` to `layout/`
* utils like injectTreeNode, mobx-react-utils, etc are available under `utils` instead of root
* `SearchRoot` is now `QueryBuilder`
* Popover show lens prop renamed to isOpen
* Added `layout/Modal`         
* Rearranged storybook set up to split things into separate files with a folder hierarchy
* Added IMDB storybook section
* Added `layout/Awaiter`
* Added `exampleTypes/ResultTable`
* Added `FilterList`
* Added `layout/TextHighlight`
* Added `FilteredPicker` and `ModalPicker` to layout
* Added `partial` to mobx-react-utils
* Added schema util and `FilterAdder`
* `InjectTreeNode` now supports dynamically adding node via group + key? + field + white listed props as a second param
* Renamed `Range` example type to `Number`
* Added contexture-mobx
* Added `ContextureProvider`
* Added `ResultPager` to example types
* Updated Mobx to v4 (along with related mobx-react)
* Added `exampleTypes/Date`

# 0.3.2
* Better InjectTreeNode

# 0.3.1
* Fix facet bug

# 0.3.0
* Add real exapmle type components

# 0.2.1
* Fix snapshots

# 0.2.0
* Support contexture-client 2.0
* Add source maps

# 0.1.7

* Fixes after 0.1.6
* Made the facet component actually work.
* Made the query component actually work.

# 0.1.6

* Allowing specific paths to be used instead of the search root.
* Making the field picker work.

# 0.1.5

* Moved mobx and mobx-react to peer dependencies.

# 0.1.4

* `npm run build` on `prepublish`.

# 0.1.3

* Making the src folder available to NPM.

# 0.1.2

* Fixed the remove function on the SearchRoot component

# 0.1.1

* Add `SearchRoot` multifield stories

# 0.1.0

* Initial commit of actual search GUI components

# 0.0.4

* Add README and CHANGELOG to Storybook

# 0.0.3

* Add storybook deploying to github pages

# 0.0.2

* Add CI configuration to project

# 0.0.1

* Initial commit
