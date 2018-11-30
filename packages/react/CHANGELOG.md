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
