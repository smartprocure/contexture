# Changelog

## 1.34.1

### Patch Changes

- ecf4ba68: Fix highlighting related to multiple matches for separate fields in field group all searches.

## 1.34.0

### Minor Changes

- ed93ab86: Add option to opt-out of merging highlights onto source

## 1.33.1

### Patch Changes

- 43b4eecc: revert defaults on `step` type

## 1.33.0

### Minor Changes

- bf80fccc: `step` type contract updated to use `min` and `max` instead of `range` so it can be consistent with `number` type

## 1.32.0

### Minor Changes

- 98299f3a: capbility of dealing with `null` ranges added to `step` query on elastic search provider

## 1.31.0

### Minor Changes

- 16e9bbff: New type Step Slider type added

## 1.30.1

### Patch Changes

- 3cfb1e4e: Fix regression in contexture-elasticsearch error handling

## 1.30.0

### Minor Changes

- 1fb99f79: Support elasticsearch client v8

### Patch Changes

- dca7d1dc: Respect include zero node config while filtering properly when filtering is enabled for facets
- ac684f83: Use the standard Error class [cause property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#providing_structured_data_as_the_error_cause) to add more context about the original elasticsearch error.

## 1.29.2

### Patch Changes

- 2065fa24: Remove bad configuration from scrolling payload

## 1.29.1

### Patch Changes

- d0bd30b1: Bump contexture-util

## 1.29.0

### Minor Changes

- 4b10b04b: Set the `to` date to the end of the current day for all `lastXDays` and `lastXMonths` date ranges.
  Set the `from` date to the start of the day for all `lastXDays` date ranges.

## 1.28.0

### Minor Changes

- f1d42dde: Enable control of Elastic partial results config and ability to log partial results

## 1.27.7

### Patch Changes

- 11186dcd: Bubble up original errors

## 1.27.6

### Patch Changes

- a6bbf8d2: More correct merging of highlights

  Fix issue where highlighting will behave wrongly when the text being highlighted contains substrings that match the highlighting tags.

## 1.27.5

### Patch Changes

- 3658ef6a: Allow some special characters in TagsQuery component
- Updated dependencies
  - contexture-util@0.1.1

## 1.27.4

### Patch Changes

- 05130fea: Fix error when there are no results node includes

## 1.27.3

### Patch Changes

- 5b45757d: Add temporary "highlightOtherMatches" flag (default false) to work around performance problems
- 1237b3ab: Low-hanging perf improvements in elasticsearch highlighting

## 1.27.2

### Patch Changes

- b0f4c7e9: Bump futil and add changeset

## 1.27.1

### Patch Changes

- bb727452: Do not set empty highlights on hit if there are none.

## 1.27.0

### Minor Changes

- 2f4e5039: Remove `subFields` configuration in the schema. Instead only send fields of type
  `text` for highlighting. This both simplifies the API and reduces payload to
  elastic, as well as fixing an issue where non-text top-level fields such as
  `keyword` type fields were being highlighted when they should not be.

## 1.26.0

### Minor Changes

- e004eda2: Revamp elasticsearch highlighting API and implementation

## 1.25.6

### Patch Changes

- b77aa6f3: When performing scrolling searches make sure to pass scroll_id in the body of the request

## 1.25.5

### Patch Changes

- 867c633e: Fix regression in PR #159

## 1.25.4

### Patch Changes

- 45247060: Clear arrays when nestedPath is not in highlights

## 1.25.3

### Patch Changes

- 250bb471: Ensure original highlight fields from schema merge into highlighting configuration

## 1.25.2

### Patch Changes

- 1c64ec48: Merge results node highlighting settings into schema highlighting settings

## 1.25.1

### Patch Changes

- 9b49d293: Fix regexes handling in elasticsearch highlighting code

## 1.25.0

### Minor Changes

- 283c50d1: Pivot: combination of `groupCounts` and `skip` won't skip if groupCounts is not available for a type

## 1.24.0

### Minor Changes

- 001eb3a: Pivot: configuring `groupCounts` and `skip` per group/value level. `groupCounts` flag adds subgroups counter to the parent level. `skip` flag skips the groping level in aggregation

## 1.23.0

### Minor Changes

- 0de3013: Support elasticsearch v8 by moving date_histogram interval to calendar_interval

## 1.22.3

### Patch Changes

- 83fc5da: Fix keyword count when past the limit to retrieve counts.

## 1.22.2

### Patch Changes

- f80580a: Fix click through of FY dates coming from report view

## 1.22.1

### Patch Changes

- bf48a09b: Fixed various bugs related to keyword generations

## 1.22.0

### Minor Changes

- 35bae50: Add Keyword Generation support to `tagsQuery`

## 1.21.0

### Minor Changes

- 78e9d0f: Highlight: filterNested flag to return only values with hightlights

## 1.20.0

### Minor Changes

- 260d6e8: Fix: removing override from searchHighlight

## 1.19.17

### Patch Changes

- fc6fbea: Highlight: override schema config by node config

## 1.19.16

### Patch Changes

- 3b7125e: Remove publish config and set default config to make yalc linking simpler

## 1.19.15

### Patch Changes

- 57c91c0: Fix pivot validContext to allow rows, columns, OR values
- a25aa61: bump futil

## 1.19.14

### Patch Changes

- 4acd46a: Nested highlighting fixes

## 1.19.13

### Patch Changes

- 2dc36c8: Republish packages with correct package.json exports field

## 1.19.12

### Patch Changes

- cd3e075: Update yarn.lock on versioning

## 1.19.11

### Patch Changes

- ec5bb50: Fix yarn.lock

## 1.19.10

### Patch Changes

- 4afa762: Fix package json contexture repo links

## 1.19.8

- ESM source
- Use esbuild to build before publishing

## 1.19.7

- [pivot] refactor `filterGroupRanges` implementation and make pivot `buildGroupQuery` drilldown aware

## 1.19.6

- [pivot] Remove federal references to fiscal year

## 1.19.5

- [pivot] Fiscal Year work for the pivot table groupingsj

## 1.19.4

- [pivot] fix range expansions by filtering ranges against drilldown

## 1.19.3

- Small tweak throwing more informative error

## 1.19.2

- [pivot] fix drilldown for `dateRangesGroupStats` type

## 1.19.1

- [pivot] Fixing initialization for `expansions` array

## 1.19.0

- [pivot] Create new `dateRangesGroupStats` type

## 1.18.0

- [pivot] New `expansions` array for `columns` and `rows` with `drilldown` and `loaded`

## 1.17.3

- Changed package manger from npm to yarn

## 1.17.2

- Migrate tests to jest

## 1.17.1

- [elasticDSL] Ensure the results are structured correctly

## 1.17.0

- [pivot] New `pagination` logic with `drilldown` and `skip`

## 1.16.2

- [tagsQuery] Fix the level at which child aggs are spread onto the query

## 1.16.1

- [pivot] Support drilldowns with additional fields (multi-term aggregation) for `fieldValuesGroupStats` type

## 1.16.0

- [pivot] Create new `tagsQueryGroupStats` type

## 1.15.0

- [pivot] Renaming groups to rows and deprecating the flatten flag

## 1.14.2

- Fix CI. Diti has a peer dependency conflict in npm 8.11 wich ships with the latest
  version of node so lock to node 16.15.0 for now.

## 1.14.1

- [pivot] Fix multi-term aggregation query logic

## 1.14.0

- [pivot] Add support for multi-term aggregations in group queries

## 1.13.0

- [pivot] Removing support for subtotals flag and making it automatic if there is no flatten or drilldown

## 1.12.2

- [pivot] Fix sorting for a total column document count

## 1.12.1

- [pivot] Fix sorting bugs on `_count` a metrics with dots when there are no columns

## 1.12.0

- [pivot] Add sort api
- [pivot] Add filter api
- [fieldValuesGroupStats] `.value` not needed for sorting
- [fieldValuesGroupStats]: `sort.order` renamed to `sort.direction`
- [numberRangesGroupStats] Fix drilldown logic to be lt instead of lte

## 1.11.2

- Pivot: removing metrics and counts from parent levels when drilling down

## 1.11.1

- Pivot: fix for root level aggregations

## 1.11.0

- Pivot: add root level columns and calculations

## 1.10.0

- Add `columns` to pivot type. `buildGroupQuery` now takes a `groupingType` prop to behave differently as a group vs a column
- Added a hacky implementation of tree simplification (flattening `buckets`, etc) which will be replaced by a transmute tree version in a future release

## 1.9.0

- Add `aliasOf` to elastic schemas (for better alias handling)

## 1.8.2

- Fix bug with pivot processReponse including groups that weren't in the query when setting a drilldown

## 1.8.1

- Fix bug with pivot drilldown wrapping tree and processResponse not handling it

## 1.8.0

- Add `pivot` drilldown support

## 1.7.1

- Update pull-request workflow to better catch test failures

## 1.7.0

- Fix bug where 0 and null value metrics wouldn't be flattened by dsl utils
- Factor out groupStats util
- Add pivot type

## 1.6.3

- Fixes a bug extracting es types from mappings across different elasticsearch versions.

## 1.6.2

- Added `date` type to `schemaMapping.js`

## 1.6.1

- Updated CI to use node16 and npm7
- Updated package-lock.json to version 2

## 1.6.0

- Experimental API: remove redis cache support
- Provider: add `searchWrapper` config option

## 1.5.0

- Add `debug` calls to track request/response queries via the `contexture:elasticsearch` namespace.

## 1.4.4

- Fix `must not` text filter option

## 1.4.3

- Switch from the deprecated `dateOptionalTime` to the `date_optional_time`

## 1.4.2

- Fix issue with regex util to comply with https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-regexp-query.html#regexp-query-ex-request

## 1.4.1

- Use native ES support for case insensitive regex matching

## 1.4.0

- Create a new child client on every search to allow passing headers and other options on a per search basis

## 1.3.0

- Experimental API: storing searches in redis cache

## 1.2.0

- Add last1Day and last1Hour to dateMath util

## 1.1.8

- Example types' context is now valid even if `statsField` is not passed.
- [fieldValuePartitionGroupStats] Use `getField` to map field to its un-analyzed value.

## 1.1.7

- [tagsText/text] Use `prefix` queries where possible for startsWith instead of regex
- [tagsText/text] Support dynamic notAnalyzed field detection (no longer hardcoded to untouched)

## 1.1.6

- [tagsQuery] Limit validContext to 100 tags

## 1.1.5

- [tagsQuery] Replace special chars with empty space

## 1.1.4

- Changes the CI from CircleCI to Github Actions

## 1.1.3

- Increased the value of `scroll` from `'2m'` to `'60m'`, this is to accommodate deeper pagination. Eventually we need to move `search_after` as it is now recommended for es7 but for, but this change accommodates our use cases for now without (hopefully) too much of a performance hit.

## 1.1.2

- Elasticsearch error response being omitted from thrown error. This was intended to be refactored as part of v1 but was never completed. This change brings back the previous behavior until the refactor is able to be completed.

## 1.1.1

- [results] Respect `highlight: false` to opt out highlighting (regression from 1.0)

## 1.1.0

- [tagsQuery] Return counts for each tag

## 1.0.3

- [geo] Fixed bug with client passed latitude/longitude

## 1.0.2

- [number] Fix additional bug with `findBestRange` (map result keys to number)

## 1.0.1

- [number] Fix bug with `findBestRange`

## 1.0.0

- Errors are now gracefully caught on a per node basis and properly set on node.error. This means that a node can throw an error, but the rest of the search will continue properly and also not log an uncaught exception to the console. This means the contexture dev tools can now be used to see raw ES errors.
- Simplified runSearch with modern JS syntax
- Get mappings now handles type-less mappings, which is the default on ES7+ (while still handling types for ES6-)
- `fieldMode` and `modeMap` are now generally removed in favor of automatically using the appropriate not analyzed field as determined dynamically from the schemas (which are now typically generated by reading `_mappings`)
- [DateRangeFacet] converted to `dateOptionalTime` format which works on ES 6 and 7
- [Results] track_total_hits and handle total.hits being an object for ES 7 support
- Remove `bluebird` dependency
- Remove last bit of non fp lodash
- Removed directory-metagen dependency
- New node types now focus on exporting a buildQuery function to make them more easily testable
- Internal - rearranged directory structure to clearly separate utils from types and the provider core
- New Nodes!
  - `dateIntervalGroupStats` - replaces `dateHistogram`
  - `fieldValuesDelta` - replaces `termsDelta`, standardized input/output names
  - `fieldValuesGroupStats` - replaces `terms_stats` and `termsStatsHits`
  - `fieldValuePartitionGroupStats` - replaces `matchStats` and `matchCardinality`
  - `numberIntervalGroupStats` - replaces `smartIntervalHistogram`
  - `numberRangesGroupStats` - replaces `rangeStats`
  - `percentilesGroupStats` - replaces `percentileRange`
  - `stats` - can replace `statistical`, `cardinality` and `percentiles`, plus supports other stats
- 🚨BREAKING Changes:
  - IE Support requires a polyfill for Math.log10
    - Browser usage of `contexture-elasticsearch` is an odd use case anyway, but you can use core-js to polyfill if needed, or do it yourself:
      ```js
      Math.log10 = Math.log10 = (x) => Math.log(x) / Math.LOG10E
      ```
  - [Provider Setup / Top Level]
    - Assumes the elasticsearch client is the new @elastic/elasticsearch npm package. Will not work with the old `elasticsearch` package
    - Removed unused `getMappingProperties` API
    - Top level `config.request` deprecated in favor of per request config
    - `requestorContext` replaced with `{requestOptions: headers}`
    - Killed schema `rawFieldName` and `getField`
  - [Removed Example Types]
    - `nonzeroClusters` (arbitrary with limited utility over regular histogram)
    - `nLevelAggregation` (irrelevant now that ES supports pipeline aggs)
    - `percentileRanks` (no known usage)
    - `smartPercentileRanks` (no known usage)
    - `terms` (just a `facet` without a filter, or a new `fieldValuesGroupStats` without stats)
    - `twoLevelMatch` (never intended to be exposed)
    - `esTwoLevelAggregation` (never intended to be exposed)
    - `default` (never intended to be exposed)
    - `termsDelta` (replaced with `valuesDelta`)
    - `percentileRange` (replaced with `percentilesGroupStats`)
    - `termsStatsHits` (replaced with `fieldValuesGroupStats`)
    - `matchCardinality` (replaced with `fieldValuePartitionGroupStats`)
    - `numberRangeHistogram` (no longer used, was a proof of concept of a number filter with a histogram of values - we'll recreate if needed in a simpler way)
    - `percentiles` (replaced with `stats`)
  - [Results]
    - Context no longer wraps everything in `response` - this was an unfortunate, many year old design artifact that is finally removed!
    - Kill `forceExclude`
    - Kill `verbose`
    - Kill `summaryView`
    - Remove duplicated `hit` on results
    - Kill `sortMode` - results will always sort on the notAnalyzed field (other use cases make no sense anyway since you'll get a missing fielddata exception)
  - [Facet]
    - Kill `caseSensitive`, `anyOrder`, `maxWords` which weren't relevant anyway
    - Kill `fieldMode` - facet will now always use the notAnalyzed field if available
    - Kill `cardinality`, which was a proxy for precision_threshold
  - [Number]
    - Don't run stats/percentiles on number unless part of `findBestRange`, improving performance for the most common number filters cases
    - Context no longer includes statistical or percentile info, only bestRange results (and no longer runs an extra extended stats call!)
  - [Terms_Stats]
    - Killed useless `caseSensitive` flag
  - [Text]
    - Killed useless `caseSensitive` flag
  - [Geo]
    - Killed deprecated server-side `geocodeLocation` function
  - [DateHistogram]
    - Killed unused `minDate` and `maxDate` on response
    - Killed unused extendedBounds support
  - [Schema]
    - No longer adds `order: 0` by default (which was a pure UI concern which isn't used by the latest contexture-react usage examples anyway)

## 0.26.0

- fix the npm version issue

## 0.25.0

- add next18Months rolling date type option

## 0.24.1

- Added \_score field to the results type

## 0.24.0

- Added support for half_float,short and byte type.

## 0.23.2

- dateRangeFacet changes - Add timeZone default value.

## 0.23.1

- dateRangeFacet changes for consistency with the facet type output.

## 0.23.0

- Added dateRangeFacet type.

## 0.22.1

- Added support for scaled_float number type.

## 0.22.0

- Add more rolling date types.

## 0.21.0

- Support passing a timezone for rolling dates.
- NOTE: Passing datemath expressions is no longer supported.

## 0.20.0

- [Bool/Exists] hasValue is now based on \_.isBoolean so we do not impact searches if there is no boolean value set

## 0.19.6

- [Facet] Move from `_term` to `_key`

## 0.19.5

- TwoLevelAggregation: Fix bug where zero values were being treated as missing

## 0.19.4

- Include variations fix for highlighting

## 0.19.3

- Allow contexture search trees to override ES highlight section
- Auto include in ES \_.source.includes fields specified in the search highlight override

## 0.19.2

- Refactor slightly the results highlighting

## 0.19.1

- Fix the highlighting to match the fields properly

## 0.19.0

- Add support for inline highlighting to be provided via an object and via `.*` approach

## 0.18.2

- Add css clss to the pre_tags ES config for highlighting.

## 0.18.1

- Order in `term_stats` was missing special case for `value_count`.

## 0.18.0

- Add support for includes on term_stats

## 0.17.1

- Throw error message and object on client search run exception

## 0.17.0

- Add support for "inlineAliases" when dealing with ES highlight response

## 0.16.0

- Restrict results context highlighting to includes unless context.showOtherMatches

## 0.15.2

- Fix typo on `tagsText` example type

## 0.15.1

- Fix scroll for subsequent scroll requests

## 0.15.0

- Globally check for `notAnalyzedField` from field util instead of just results
- Fix scan/scroll on latest core (don't check `config`)
- Support `scroll: true` which now defaults to 2m instead of exploding
- Support tagsText in typeOptions for text fields
- Facet: Add explicit size:0 support (which sets it to es's max integer size of `2^31 - 1`)

## 0.14.2

- Only select field values that are arrays when mapping indices to aliases in copySchemasToAliases

## 0.14.1

- Fixes tagQuery isPhrase

## 0.14.0

- Adds mapping for boolean and integer ES types
- Adds exists as a type option for all fields

## 0.13.1

- For the results example type Determine the sort field path by inspecting the `notAnalyzedField` property in the ES schema for the field in context.

## 0.13.0

- Add `tagsText` example type

## 0.12.3

- Apparently mappings can sometimes be empty, so omit them from schema processing to be safe

## 0.12.2

- Added support for fieldMode on the cardinality type.

## 0.12.1

- Use tagsQuery instead of facet if there is no nested notAnalyzedField

## 0.12.0

- Add geo_point type default on example type mapping

## 0.11.2

- Added tests to the recent highlighting changes.

## 0.11.1

- Fixes to `findBestRange` in number type

## 0.11.0

- Additional highlighted fields should include fields that are missing from the result include array.

## 0.10.2

- Geo filter changes

## 0.10.1

- Avoid object spread in mapping util to make browser usage easier

## 0.10.0

- Format CHANGELOG
- Added `getSchemas`, a utility that reads from es mappings/aliases to automatically generate schemas (complete with field definitions as well)
- Added `exampleTypeSchemaMapping` to map es types to example contexture node types

## 0.9.1

- [terms_stats] Use field mode for terms stats.

## 0.9.0

- Added `tagsQuery` type.

## 0.8.5

- [Number] Number types will now return extended instead of standard stats.

## 0.8.4

- [Number] Number types will interpret interval min or max null values as open left or right boundaries.

## 0.8.3

- Fix regEx for words

## 0.8.2

- Results type will now return verbose data i.e. hits property when include has items so that data values for additional fields is accessible.

## 0.8.1

- Decomission `useRaw` in favor of `isDateTime` flag

## 0.8.0

- forceExclude on the results type allows us to extend any existing exclude value (even if empty) with a default list of forceExclude fields defined at the schema.

## 0.7.2

- [Facet] If includeZeroes, facet should make another search for it's cardinality with query match_all.

## 0.7.1

- Using combinatorics of the received words on regexp includes if optionsFilter is present on the facet example type.

## 0.7.0

- Introducing new example type number range histogram.
- Number now supports find best functionality.
- Geo type now guards against 0 results in geocoder.

## 0.6.9

- Facet can't allow size 0 or empty, so we're sending 10 by default (as before).

## 0.6.8

- Added the context property useRaw to step out of date formattings on the date example type.

## 0.6.7

- Fixed Number type bug where min and max values were ignored if passed as strings.

## 0.6.6

- Added documentation for termsStatsHits

## 0.6.5

- [Facet] Support size 0

## 0.6.4

- [Number] No longer wraps results in a results property.

## 0.6.3

- [Number] Improved number type by providing a configurable interval value for the percentile aggregation.

## 0.6.2

- [Number] Improved number type by providing additional feedback as filtered range aggregations.

## 0.6.1

- Allow min 0 and max undefined to be evaluated as truthy or vice-versa.

## 0.6.0

- [Number] Improved number type by providing feedback as statistics and histogram results.

## 0.5.0

- Added utility function `getSchemaMapping` to get a mapping used for building a schema directly from ES.

## 0.4.1

- [Facet] Removed the last reference of context.data from the facet type.

## 0.4.0

- Removed the root level usage of context.data and context.config, now
  the inner properties can be passed directly to the root object.

## 0.3.0

- [facet, terms_stats, termsStatsHits] Add support for overriding fieldmode behavior for all terms aggregation based types. Schemas can either completely override `getField` or just `modeMap` or `rawFieldName`.
- [facet, terms_stats, termsStatsHits] Use regexp filter intead of wildcard filter/terms include
- [terms_stats, termsStatsHits] Add support for `caseSensitive` flags for options filter
- [terms_stats, termsStatsHits] Move off of `lowercased` and `exact`
- [facet] Remove `anyOrder` support, now is `anyOrder` all the time (powered by bool must)

## 0.2.2

- [Facet] Fix spacing bug on optionsFilter (regex generation)

## 0.2.1

- [Facet] Make filtering work with includeZeroes
- [Facet] Move off of `lowercased` and `exact`
- [Facet] Use term `include` intead of wildcard filter
- [Facet] Add support for `anyOrder` and `caseSensitive` flags for options filter

## 0.2.0

- [Facet] Add `includeZeroes` support to facet type.
- [Facet] Remove `filterJunk`

## 0.1.4

- Removed `__all` from .gitignore.

## 0.1.3

- Using directory metagen instead of include-all.

## 0.1.2

- Added include and exclude to the results type.

## 0.1.1

- Fixed issues with percentileRange type

## 0.1.0

- Using regexp instead of wildcard on the text type.

## 0.0.10

- Passing the headers properly with requestorContext

## 0.0.9

- Fix request config override order

## 0.0.8

- Our use of extendAll was wrong, it expects an array.

## 0.0.7

- Radically reduced ascii folding checks in query example type. Recommended alternative is to use an ascii folding analyzer.

## 0.0.6

- Using Lodash's extend instead of the three dot syntax, so we can
  support Node v8.2.0.

## 0.0.5

- Fix \_.extendAll issue where it should accept an array as a parameter

## 0.0.4

- Fix default type issue

## 0.0.3

- Fix types issue

## 0.0.2

- Add dev tooling for PRs

## 0.0.1

- Initial release
