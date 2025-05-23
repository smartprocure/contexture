﻿# Changelog

## 1.3.2

### Patch Changes

- 43b4eecc: revert defaults on `step` type
- Updated dependencies [43b4eecc]
  - contexture-client@2.57.0

## 1.3.1

### Patch Changes

- Updated dependencies [bf80fccc]
  - contexture-client@2.56.0

## 1.3.0

### Minor Changes

- 2be8a442: Add a new export strategy for the contexture-elasticsearch fieldValueGroupStats node.

## 1.2.0

### Minor Changes

- f0e5c73a: Enable Excel Export Option

## 1.1.3

### Patch Changes

- 5b45757d: Add temporary "highlightOtherMatches" flag (default false) to work around performance problems
- Updated dependencies [5b45757d]
  - contexture-client@2.53.7

## 1.1.2

### Patch Changes

- b0f4c7e9: Bump futil and add changeset
- Updated dependencies [b0f4c7e9]
  - contexture-client@2.53.6

## 1.1.1

### Patch Changes

- ec0276ec: Await onWrite callback

## 1.1.0

### Minor Changes

- 09f3ec5: Pivot: adding support for pivot table export

## 1.0.16

### Patch Changes

- 3b7125e: Remove publish config and set default config to make yalc linking simpler

## 1.0.15

### Patch Changes

- a25aa61: bump futil

## 1.0.14

### Patch Changes

- 2dc36c8: Republish packages with correct package.json exports field

## 1.0.13

### Patch Changes

- cd3e075: Update yarn.lock on versioning

## 1.0.12

### Patch Changes

- ec5bb50: Fix yarn.lock

## 1.0.11

### Patch Changes

- 4afa762: Fix package json contexture repo links

## 1.0.9

- Add exports to package.json so node knows which version of the code to import
- Make sure default exports work when using this library from CommonJS
- Do not use esbuild to transpile source when running tests. Instead use jest ESM support

## 1.0.8

- Use yarn
- ESM source
- Use esbuild to build before publishing

## 1.0.7

- Add coverage to danger and other cleanup

## 1.0.6

- Update the pull-request workflow to better catch test failures

## 1.0.5

- Updated CI to use node16 and npm7
- Updated package-lock.json to version 2

## 1.0.4

- Fixed bug preventing terms_stats from passing values through correctly

## 1.0.3

- Adjust how `terms_stats` handles unexpected return from the service, no longer
  throws an error while iterating and returns `undefined`

## 1.0.2

- Fixed bug preventing `highlight: false` from being passed to the service.

## 1.0.1

- Changed from CircleCI to github actions

## 1.0.0

- Strategies are now native JS async iterables (using async generators)
- BREAKING:
  - Most `exportStrategies` are removed - `bulk`, `page`, `stream`
    - `bulk` can be replicated with `it-all`
    - `stream` and `page` are handled by native `for await` loops
  - `CSVStream` removed by outsourcing as much as possible to @fast-csv
- Added `schemaToCSVTransforms` to make `fast-csv` schema aware
- Added `andGroup` util

## 0.2.10

- `CSVStream` exportStrategy: document `omitFieldsFromResult`, refactoring.

## 0.2.9

- `CSVStream` exportStreategy: allow omitting fields from CSV rows

## 0.2.8

- `results` dataStrategy: spread `_source` onto results items.

## 0.2.7

- Use original record for each field's display function in `formatValues`

## 0.2.6

- Pass `skipCount` to resultConfig in results data strategy so that search provider can skip `count query` if supported

## 0.2.5

- Do not flatten record during display formatting in `formatValues`

## 0.2.4

- Pass record as second argument to field display function in `formatValues`

## 0.2.3

- Support arbitrary props (like `populate`) to the `result` data strategy

## 0.2.2

- Fix an issue with dataStrategies which prevents mongo exports

## 0.2.1

- Enable support for include in terms stats data strategy.

## 0.2.0

- Add support for `results` nodes which don't wrap their context objects in `response` (like contexture-memory)

## 0.1.10

- Only call display if fn exists.

## 0.1.9

- Fix missing columns issue due to not all columns having results in the first row

## 0.1.8

- Elasticsearch scrolling off by default in results strategy

## 0.1.7

- Better CSV processing.

## 0.1.6

- Fixing missing columns. Now, colums will be added as long as there
  are format rules for them.

## 0.1.5

- Fixed terms*stats getTotalRecords so it doesn't use *.memoize.
  Memoize behaves weirdly with async functions (probably because this
  is compiled).

## 0.1.4

- Fixed terms_stats so that size 0 means get all the results (just like how terms_stats works).

## 0.1.3

- Pass `highlight` to results dataStrategy

## 0.1.2

- Fixed getTotalRecords in the terms_stats dataStrategy.

## 0.1.1

- Exposed formatTree.

## 0.1.0

- This project is now compiled with webpack.

## 0.0.2

- Fixing the main index location in the package.json

## 0.0.1

- Initial release
