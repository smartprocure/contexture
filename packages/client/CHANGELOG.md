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
