### 0.6.9
* Facet can't allow size 0 or empty, so we're sending 10 by default (as before).
### 0.6.8
* Added the context property useRaw to step out of date formattings on the date example type.
### 0.6.7
* Fixed Number type bug where min and max values were ignored if passed as strings.
### 0.6.6
* Added documentation for termsStatsHits
### 0.6.5
* Facet now allows size 0
### 0.6.4
* Number type no longer wraps results in a results property.
### 0.6.3
* Improved number type by providing a configurable interval value for the percentile aggregation.
### 0.6.2
* Improved number type by providing additional feedback as filtered range aggregations.
### 0.6.1
* Allow min 0 and max undefined to be evaluated as truthy or vice-versa.
### 0.6.0
* Improved number type by providing feedback as statistics and histogram results.
### 0.5.0
* Added utility function `getSchemaMapping` to get a mapping used for building a schema directly from ES.
### 0.4.1
* Removed the last reference of context.data from the facet type.
### 0.4.0
* Removed the root level usage of context.data and context.config, now
  the inner properties can be passed directly to the root object.
### 0.3.0
* [facet, terms_stats, termsStatsHits] Add support for overriding fieldmode behavior for all terms aggregation based types. Schemas can either completely override `getField` or just `modeMap` or `rawFieldName`.
* [facet, terms_stats, termsStatsHits] Use regexp filter intead of wildcard filter/terms include
* [terms_stats, termsStatsHits] Add support for `caseSensitive` flags for options filter
* [terms_stats, termsStatsHits] Move off of `lowercased` and `exact`
* [facet] Remove `anyOrder` support, now is `anyOrder` all the time (powered by bool must)
### 0.2.2
* [Facet] Fix spacing bug on optionsFilter (regex generation)
### 0.2.1
* [Facet] Make filtering work with includeZeroes
* [Facet] Move off of `lowercased` and `exact`
* [Facet] Use term `include` intead of wildcard filter
* [Facet] Add support for `anyOrder` and `caseSensitive` flags for options filter
### 0.2.0
* Add `includeZeroes` support to facet type.
### 0.1.4
* Removed `__all` from .gitignore.
### 0.1.3
* Using directory metagen instead of include-all.
### 0.1.2
* Added include and exclude to the results type.
### 0.1.1
* Fixed issues with percentileRange type
### 0.1.0
* Using regexp instead of wildcard on the text type.
### 0.0.10
* Passing the headers properly with requestorContext
### 0.0.9
* Fix request config override order
### 0.0.8
* Our use of extendAll was wrong, it expects an array.
### 0.0.7
* Radically reduced ascii folding checks in query example type. Recommended alternative is to use an ascii folding analyzer.
### 0.0.6
* Using Lodash's extend instead of the three dot syntax, so we can
  support Node v8.2.0.
### 0.0.5
* Fix _.extendAll issue where it should accept an array as a parameter
### 0.0.4
* Fix default type issue
### 0.0.3
* Fix types issue
### 0.0.2
* Add dev tooling for PRs
### 0.0.1
* Initial release
