# 2.4.0
* Added more example types (`bool`, `exists`, `date`, `geo`, `dateHistogram`)
* Add support for default properties on node types
* Add default contexts for `facet` and `results`

# 2.3.0
* Added lens

# 2.2.2
* Made the mutate action to be curried
* Defined a default debounce time

# 2.2.1
* Added a comment about onChange on the readme.

# 2.2.0
* Initializing all the custom properties as null when creting a new client.
* Using extend on all the custom properties that are added on the tree and not at the serialize level.
* Removed allowBlank.
* Allowing types to have init functions that can extend each node.
* Added an optional onChange function that gets called as soon as the extend function gets excecuted. It gets called with the node's path, the node and the changes received.
* Removed defaultHasValue and added a validate function to each of the example types.
* Cleaned up the code after the changes to have a single initialize function for each and every node, and also removed data even from the tests.

# 2.1.1
* Fix facet reactor for `optionsFilter` (was incorrectly named `filter`)

# 2.1.0
* Implemented a refresh action.

# 2.0.6
* Exposed exampleTypes

# 2.0.5
* Removed the default group reactor that listened to children changes.

# 2.0.4
* Added some example types

# 2.0.3
* Fixed bug with nested custom reactors.
* Fixdd bug with the mergeOn used by processResponse that was causing
  mobx arrays to mix old and new values instead of replacing them.

# 2.0.2
* Rename `only` reactor to `self`
* Small internal tweaks and documentation updates

# 2.0.1
* First pass at some real documentation

# 2.0.0
* Add decoded `path` to each node
* **Breaking change** Simplified initial api from `(tree, service, types, config)` to moving service and types into config as the first param and currying.

### Migration Guide
Replace every call like this: `ContextTree(tree, service, types, {...config})`
with a call like this: `ContextTree({service, types, ...config}, tree)`

# 1.3.0
* Add support for custom type specific reactors, eliminating the need for data/config (which the server flattens anyway)

# 1.2.1
* Fix serialization to never include contexts
* Fix onResult not to be called if there was no context response
* Default validation function is now stubTrue
* Added internal mocks utility

# 1.2.0
* Drop stale updates
* Add `onResult` api (mainly for use in test above)

# 1.1.1
* Remove unused subscribe API **Note** Normally this would be a breaking change, but it was undocumented.
* Made mutate a first class dispatchable event to avoid multiple dispatches
* Separated `defaultTypes` out to `exampleTypes.js`

# 1.1.0

## Major internal overhaul

**Note** Since the public API did not change, this is not a major version release - but these changes should result in _substantially_ improved performance.

A big theme was realizing that the edge case of async validation messing up in-progress dispatches is not actually possible in JS since it is single threaded - and even if it was, we don't snapshot the actual data/config values anyway.

* Removed almost all internal snapshotting (except serialization) by ignoring non-existant race conditions
* Validation now runs only 1 time per dispatch and stamps on group nodes (simplifying the API)
* All reactor processing and search blocking is now synchronous and have had their APIs radically simplified
* Removed all explicit knowledge of path encoding, instead using a single function
* Removed tons of custom code in favor of generic flat tree methods (originally extracted from this repo)
* Paths are no longer stamped on nodes (side effect of using a more generic method)
* Encoded path delimiter changed from `->` to `/`

# 1.0.5

* flattenTree fix for nodes that already have a path.

# 1.0.4

* package.json description and formatting thanks to Duti.

# 1.0.3

* Added babel-plugin-transform-runtime.

# 1.0.2

* MobX support and tests.

# 1.0.1

* Add CI stuff

# 1.0.0

* Initial release
