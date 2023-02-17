# Changelog

## 2.49.15

### Patch Changes

- ec5bb50: Fix yarn.lock

## 2.49.14

### Patch Changes

- 4afa762: Fix package json contexture repo links

## 2.49.12

- Run tests with jest's ESM support. Remove esbuild-jest transform

## 2.49.11

- Fix default exports when library is being consumed from CommonJS. More info at https://esbuild.github.io/content-types/#default-interop

## 2.49.10

- Bring back package.json exports field

## 2.49.9

- Pivot node: Do not reset expansions on pause mutations

## 2.49.8

- Revert package.json exports field

## 2.49.7

- Misc fixes and cleanup

## 2.49.6

- Format source with prettier

## 2.49.5

- Use yarn instead of npm
- ESM source
- Use esbuild instead of webpack/babel to build before publishing

## 2.49.4

- Pivot node: Do not remove root node when present in `selectedRows` when checking which selected rows should remain

## 2.49.3

- Pivot node: Do not reset expansions when the filters are changed (that only affects other nodes)

## 2.49.2

- Pivot node: Add new field `selectedRows`. Clear as needed `selectedRows` when the `expansions` array and/or query results are changing

## 2.49.1

- Pivot node: fixing issues with sorting and result merging

## 2.49.0

- Pivot node: New `expansions` array for `columns` and `rows` with `drilldown` and `loaded`

## 2.48.1

- Migrate tests to jest

## 2.48.0

- New feature: new per-node hook `onSerialize` allows users to customize tree nodes as the tree is being serialized

## 2.47.0

- Pivot node: new `pagination` logic with `drilldown` and `skip`

## 2.46.0

- Pivot node: renaming groups to rows and deprecating the flatten flag

## 2.45.1

- Pivot node: reset the drilldown on tree mutations

## 2.45.0

- Pivot node: removing subtotals flag as it was deprecated in ES

## 2.44.0

- Add `isStale`, sugar for `markedForUpdate || updating`
- Node flags `isStale`, `markedForUpdate`, and `updating` are now properly set at the group level as whether any of their children have them set
- Deprecated undocumented internal `flat` tree, will remove in next version
- Remove unused `default` type support
- `watchNode` now supports nested paths (e.g. `context.something`) and empty keys array
- Actions now recieve a full `TreeInstance` instead of just action props

## 2.43.0

- Add `watchNode`

## 2.42.0

- Pivot node: add missing reactors and defaults

## 2.41.0

- Pivot node: merging new response object format

## 2.40.2

- Fix: Pivot node: deep merging for groups and columns

## 2.40.1

- Fix: Pivot node: merging columns on drilldown response

## 2.40.0

- Pivot node: support for columns field

## 2.39.3

- Fix: Use `snapshot` on `typeDefaults` instead of `_.deepClone` to fix regression from `2.38.0` for real world apps that end up with observable `typeDefaults`

## 2.39.2

- Better `pivot` `mergeResponse` implementation that merges groups by key
- Move from `futil-js` to `futil`
- Pass `snapshot` into `mergeResponse` to avoid a mobx bug

## 2.39.1

- Add node validation for `pivot` groups
- Add self reactor for a `pivot` node `drilldown` property

## 2.39.0

- Add support for type specifc `onDispatch`, called when an event is dispatched with a target node with the corresponding type
- Add `pivot` `onDispatch` which sets `forceReplaceResponse` when certain keys are mutated.
- Pivot response merge - calls `F.mergeAllArrays` on context, which may be a generic answer to response merges.

## 2.38.1

- Update pull-request workflow to better catch test failures

## 2.38.0

- Per type response merges via `shouldMergeResponse` and `mergeResponse`- allows types to retain the response state between search calls to cleanly support things like inifinite scrolling and drilldowns. Will automatically always force response replacement when updated by others (since the query has likely changed, invalidating prior responses). This is tracked by a new `forceReplaceResponse` internal state flag per node.
- Leverages response merge feature to implement `infiniteScroll` for `results` (just set `infiniteScroll` to true and `mutate` increments to `page`!)
- Fix: Always `_.deepClone` defaults on node init to prevent accidentally mutating type defaults
- Cleanup: swap custom mutable mergeWith with extend
- Cleanup: remove references to results.context.response (since we no longer wrap results in response)

## 2.37.0

- Add `pivot` type

## 2.36.1

- Updated CI to use node16 and npm7
- Updated package-lock.json to version 2

## 2.36.1

- Fix: debouncing updates with path independently

## 2.36.0

- Debounce for immediate updates is set to 1 ms
- Fixing logic filterOnly flag for serialized tree
- Subquery: making whole targetTree to await for sourceNode

## 2.35.0

- Immediate updates are now debounced 10ms (which happens on self affecting reactors when disableAutoUpdate is true)

## 2.34.0

- Silencing updates from changes with no value
- This removes unnecessary tree update when switching from exact to rolling

## 2.33.1

- Changed over CI from CircleCI to Github Actions

## 2.33.0

- Self affecting dispatches updating only themselves when disabling auto update
  - This is achieved by making `triggerUpdate` optionally take a `path`
  - Provides a significant performance improvement as large tree no longer
    need to be updated entirely when small parts of them change in isolation.
- This has no breaking api changes

## 2.32.3

- Refactoring to simplify code (preparing for larger updates)
- Also fixes a bug when the `standardChange` reactor should return `all`, but wouldn't have

## 2.32.2

- set default date.range to 'exact'

## 2.32.1

- set default context.results to [] for `tagsQuery`

## 2.32.0

- Update `tagsQuery` reactors to `all` to support showing counts on tags

## 2.31.2

- Update subquery node reactors to `all`

## 2.31.1

- Update savedSearch node reactors to `all`

## 2.31.0

- Remove logic that marks and deletes a `filterOnly` node with no value

## 2.30.0

- When `disableAutoUpdate` is `true` triggering updates immediately instead of debouncing them

## 2.29.1

- Add the dateRangeFacet type.

## 2.29.0

- Support changes to `date` type.

## 2.28.4

- Fix exampleTypes validateValueExistence to be an actual function

## 2.28.3

- Add a fallback in the unlikely chance a tagsQuery tags property isn't an array or doesn't exist
- Add the basic validate values function on some example types which didn't previously have a validate function

## 2.28.2

- Fix a typo "udpated" in a node resolve catch block log

## 2.28.1

- Fix an issue updating the target search from a subquery

## 2.28.0

- Add `processResponseNode` to support intermediate partial results from the server

## 2.27.0

- Add `debugInfo.dispatchHistory` to the tree
- Add `metaHistory` to individual nodes
- Add ability to override the debug log function (needed for tests)

## 2.26.4

- Add `clear` tree action tests

## 2.26.3

- Call `initObject` on `TreeInstance`. In the mobx case, this should allow observing tree instance properties like `disableAutoUpdate`

## 2.26.2

- Handle better empty values in sourceTree with subQuery

## 2.26.1

- Add custom autoKey function for terms_stats type (uses `key_field` and `value_field` instead of `field`)

## 2.26.0

- Expose additional properties on tree instance: `flat`, `snapshot`, `extend`, `types`, `initNode`, `initObject`

## 2.25.0

- Add automatic generation and deduplication of default node keys during tree init and `add` action
- Add support for `autoKey` type property to specify type-specific autokey functions

## 2.24.1

- Await `processResponse` to normalize the tree post service exception

## 2.24.0

- Update `replace` action to support taking a transform function as an argument

## 2.23.0

- Add `onError` event to be triggered on service exception

## 2.22.3

- Add `_.toArray` to actions to handle ObservableArray paths

## 2.22.2

- Set defaults for geo location and radius

## 2.22.1

- Fix bug with replace not inserting at the right index with mobx

## 2.22.0

- Add nested pause actions (pauseNested, unpauseNested, isPausedNested)
- Add move action
- Add wrapInGroup action
- Add replace action
- Support nested add, nested remove, add at index
- Add `initObject` config support
- Entire test suite is now run against both the native JS and mobx client

## 2.21.0

- Serialize a node's `paused` field

## 2.20.0

- Add `clear` action to reset a node's value to its defaults

## 2.19.2

- Add `value` reactor for `mongoId` example type

## 2.19.1

- Add missing defaults for `subquery` and `savedSearch` example types.

## 2.19.0

- Add `subquery` and `savedSearch` example types.

## 2.18.1

- Fixed deep bug: afterSearch should be called at the moment we
  receive new values. This would cause nodes previously marked for
  update to not call afterSearch because these nodes weren't marked by
  the current dispatch.

## 2.18.0

- Added validate function to `geo` example type

## 2.17.3

- Added defaults and reactors for `text`'s `operator`.
- Added `tagsText`, which is just like text but supports an array of values.
- Added default and reactor for `tagsQuery`'s `exact` flag.

## 2.17.2

- Added a default `filter` property in the `terms_stats` type.

## 2.17.1

- Added a `self` reactor to `terms_stats`'s filter property.

## 2.17.0

- Added self reactor for `findBestRange` on `number` type

## 2.16.1

- Facet should have mode 'include' by default.

## 2.16.0

- Make sure that afterSearch hook is called after triggerUpdate has executed.

## 2.15.1

- Add defaults and more reactors for geo type.

## 2.15.0

- Add subQuery/getValues support for terms_stats type.

## 2.14.1

- Duti upgrade.

## 2.14.0

- Add twoLevelMatch/matchStats reactor of self for key_value field.

## 2.13.7

- Fixed an issue when mutating groups would return an observable array
  that we wouldn't be able to parse.

## 2.13.6

- Republish 2.13.5 which was published manually without building.

## 2.13.5

- Fix bug preventing nodes without contexts from being marked as no longer updating.

## 2.13.4

- Fix error with mobx 4 usage where event path itself is an observable.

## 2.13.3

- Fix error when the entire tree is a mobx 4 observable by using snapshot in affectsSelf check

## 2.13.2

- exampleType's subquery option has to be lowercase.
- Added subquery.useValues to the mongoId type.

## 2.13.1

- Small fix for MobX 4. Just making sure that observables are not used for comparing paths.

## 2.13.0

- Add tagsQuery example type

## 2.12.1

- Catch case where unsolicited node responses from the service for nodes that have never been updated explode because of missing upatingPromise (but still log in debug mode)
- Update mobx tests to use mobx 5

## 2.12.0

- Added `onUpdateByOthers` hook and update results example type to use it

## 2.11.0

- Added `disableAutoUpdate` and `triggerUpdate` action

## 2.10.0

- Added `subquery` for piping search results from one node into the input of another
- Added `subquery.getValues` and `subquery.useValues` support for client types
- Allow `onChange` and `onResult` to be changed at runtime on the tree instance (before, it was only settable in initial config)
- Added `onMarkForUpdate` and `afterSearch` hooks
- Fixed bug on `markForUpdate` that replaced promises before fulfillment

## 2.9.1

- Fix bug that incorrectly marked siblings for update if they were in nested groups.

## 2.9.0

- Add `updatingPromise` to nodes which can be used to await nodes being updated (planned for subquery/cascade use case)

## 2.8.0

- Added more example types.

## 2.7.3

- Make sure type has a default (undefined) and field has a default in relevant example types.

## 2.7.2

- Add missing example type terms_stats

## 2.7.1

- Add missing example type defaults

## 2.7.0

- Expose `mockService` as a top level export

## 2.6.1

- Ensure `mockService` is accessible from `src`

## 2.6.0

- Expose `addActions` to enable extending the client with new actions that have the same access levels as first party ones.
- Expose `addReactors` which allows extending the client with new reactors.
- Expose `Tree`, `encode`, `decode`, `hasValue`, and `hasContext` utils.

## 2.5.2

- Fix defaults for facet and results
- Add more reactors across many example types
- Stamp `type` on example-types

## 2.5.1

- Account for core returning an empty data object

## 2.5.0

- Deprecate wrapping responses in `data`, will be removed in 3.0

## 2.4.0

- Added more example types (`bool`, `exists`, `date`, `geo`, `dateHistogram`)
- Add support for default properties on node types
- Add default contexts for `facet` and `results`

## 2.3.0

- Added lens

## 2.2.2

- Made the mutate action to be curried
- Defined a default debounce time

## 2.2.1

- Added a comment about onChange on the readme.

## 2.2.0

- Initializing all the custom properties as null when creting a new client.
- Using extend on all the custom properties that are added on the tree and not at the serialize level.
- Removed allowBlank.
- Allowing types to have init functions that can extend each node.
- Added an optional onChange function that gets called as soon as the extend function gets excecuted. It gets called with the node's path, the node and the changes received.
- Removed defaultHasValue and added a validate function to each of the example types.
- Cleaned up the code after the changes to have a single initialize function for each and every node, and also removed data even from the tests.

## 2.1.1

- Fix facet reactor for `optionsFilter` (was incorrectly named `filter`)

## 2.1.0

- Implemented a refresh action.

## 2.0.6

- Exposed exampleTypes

## 2.0.5

- Removed the default group reactor that listened to children changes.

## 2.0.4

- Added some example types

## 2.0.3

- Fixed bug with nested custom reactors.
- Fixdd bug with the mergeOn used by processResponse that was causing
  mobx arrays to mix old and new values instead of replacing them.

## 2.0.2

- Rename `only` reactor to `self`
- Small internal tweaks and documentation updates

## 2.0.1

- First pass at some real documentation

## 2.0.0

- Add decoded `path` to each node
- **Breaking change** Simplified initial api from `(tree, service, types, config)` to moving service and types into config as the first param and currying.

### Migration Guide

Replace every call like this: `ContextTree(tree, service, types, {...config})`
with a call like this: `ContextTree({service, types, ...config}, tree)`

## 1.3.0

- Add support for custom type specific reactors, eliminating the need for data/config (which the server flattens anyway)

## 1.2.1

- Fix serialization to never include contexts
- Fix onResult not to be called if there was no context response
- Default validation function is now stubTrue
- Added internal mocks utility

## 1.2.0

- Drop stale updates
- Add `onResult` api (mainly for use in test above)

## 1.1.1

- Remove unused subscribe API **Note** Normally this would be a breaking change, but it was undocumented.
- Made mutate a first class dispatchable event to avoid multiple dispatches
- Separated `defaultTypes` out to `exampleTypes.js`

## 1.1.0

## Major internal overhaul

**Note** Since the public API did not change, this is not a major version release - but these changes should result in _substantially_ improved performance.

A big theme was realizing that the edge case of async validation messing up in-progress dispatches is not actually possible in JS since it is single threaded - and even if it was, we don't snapshot the actual data/config values anyway.

- Removed almost all internal snapshotting (except serialization) by ignoring non-existant race conditions
- Validation now runs only 1 time per dispatch and stamps on group nodes (simplifying the API)
- All reactor processing and search blocking is now synchronous and have had their APIs radically simplified
- Removed all explicit knowledge of path encoding, instead using a single function
- Removed tons of custom code in favor of generic flat tree methods (originally extracted from this repo)
- Paths are no longer stamped on nodes (side effect of using a more generic method)
- Encoded path delimiter changed from `->` to `/`

## 1.0.5

- flattenTree fix for nodes that already have a path.

## 1.0.4

- package.json description and formatting thanks to Duti.

## 1.0.3

- Added babel-plugin-transform-runtime.

## 1.0.2

- MobX support and tests.

## 1.0.1

- Add CI stuff

## 1.0.0

- Initial release
