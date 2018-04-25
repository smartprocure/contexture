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
