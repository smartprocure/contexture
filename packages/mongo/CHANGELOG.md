# 0.11.1
* Fix typo in README
* Fix accidental NPM publish in 0.11.0

# 0.11.0
* Results example type: Add `hasMore` flag to context if `skipCount` is true and the query has results beyond the current page

# 0.10.1
* [DateHistogram] Fix key timestamp bug

# 0.10.0
* Add `termsStats` example type
* Add `dateHistogram` example type
* Add `skipCount` flag to results to avoid getting counts 
* Fix meta request logging to wrap `collection` and `aggs` under a `request` key

# 0.9.5
* Refactor `hasValue` flow.

# 0.9.4
* Make sure `hasValue` takes into account empty strings for `text` type.

# 0.9.3
* Leverage new futil export regex builders in the facet options filter
* Move from `futil-js` to lastest `futil` (just package rename + version bump)
* Change internal naming from `context` to `node`

# 0.9.2
* Make sure to use the populate key when `$unwind`ing a `$lookup`.

# 0.9.1
* Add "preserveNullAndEmptyArrays" to the unwind for the populate configuration

# 0.9.0
* Add support for unwind on the populate configuration

# 0.8.5
* Results example type: Don't `$project` redundant child paths when parent path is already projected.

# 0.8.4
* Results example type: Removed default `$sort`. Fixed `$limit` when pageSize is 0.

# 0.8.3
* Results example type: sort after lookups and `include` is respected now via `$project`.

# 0.8.2
* Fix typo on `tagsText` example type

# 0.8.1
* Remove uneccessary contexture peer dependency (which causes an issue since minor revisions are breaking in semver at 0.x)

# 0.8.0
* Add `tagsText` example type

# 0.7.1
* The Results type now allows unlimited results by setting pageSize to zero.

# 0.7.0
* Added support for Mongo ObjectIDs to teh facet example type.

# 0.6.3
* `number` properly handle empty string, null, undefined, and NaN

# 0.6.2
* `number` properly supports casting strings to numbers

# 0.6.1
* Fix bug in `statistical` when there are no results

# 0.6.0
* `facet` options are sorted by count
* `facet` options filter now translates words to intersection regexes
* `facet` properly filters _before_ limiting (so filter works properly)

# 0.5.0
* Add `dateType ` support to date type (with `date`, `timestamp`, and `unix ` options)

# 0.4.0
* Add support for facet optionsFilter
* Cleanup changelog

# 0.3.0
* Add array support for `facet` example type

# 0.2.3
* Some more tests for the example-types

# 0.2.2
* Changed the `statistical` type so it wouldn't return an array

# 0.2.1
* Improved the `facet` type, allowing for unlimited queries

# 0.2.0
* Added the `statistical` type

# 0.1.6
* Fixed the text type using F.cascade with more than one parammeter

# 0.1.5
* Fixed the contexture version in our peerDependencies

# 0.1.4
* Kill data and config, requiring contexture >= 0.40

# 0.1.3
* Refactoring exclude mongoId

# 0.1.2
* Added the option to exclude on the mongoId type

# 0.1.1
* Fix bluebird regression and temporarily disable missing collection check

# 0.1.0
* Add `populate` support to results type, which performs `$lookup`s

# 0.0.10
* Add error for specified collection not being found

# 0.0.9
Added data.values support to mongoId

# 0.0.8
* Make sure types are available `contexture-mongo/types`
* Rename the default types to example types
* Made integration tests for the text and the mongoId example types

# 0.0.7
* Use the native mongo driver
* Renamed the expected model property to be collection

# 0.0.6
* Making sure we export the types

# 0.0.5
* Add dev tooling around contributing

# 0.0.4
* Add date documentation and missing mongoId dependencies

# 0.0.3
* Add date unit tests and missing date dependencies

# 0.0.2
* Fixed dependencies

# 0.0.1
* Initial Release
