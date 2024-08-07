# Changelog

## 0.12.24

### Patch Changes

- ac684f83: Use the standard Error class [cause property](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause#providing_structured_data_as_the_error_cause) to add more context about the original elasticsearch error.

## 0.12.23

### Patch Changes

- Updated dependencies [5597cbcc]
  - contexture-util@0.1.2

## 0.12.22

### Patch Changes

- 11186dcd: Bubble up original errors

## 0.12.21

### Patch Changes

- 5b45757d: Add temporary "highlightOtherMatches" flag (default false) to work around performance problems

## 0.12.20

### Patch Changes

- b0f4c7e9: Bump futil and add changeset

## 0.12.19

### Patch Changes

- 3b7125e: Remove publish config and set default config to make yalc linking simpler

## 0.12.18

### Patch Changes

- a25aa61: bump futil

## 0.12.17

### Patch Changes

- 2dc36c8: Republish packages with correct package.json exports field

## 0.12.16

### Patch Changes

- cd3e075: Update yarn.lock on versioning

## 0.12.15

### Patch Changes

- ec5bb50: Fix yarn.lock

## 0.12.14

### Patch Changes

- 4c9602b: Fix package json contexture repo links and move ecosystem links to the monorepo readme

## 0.12.12

- Add exports to package.json so node knows which version of the code to import
- Do not use esbuild to transpile source when running tests. Instead use jest ESM support

## 0.12.11

- Build and publish browser-safe version of this package

## 0.12.10

- Fix package publishing

## 0.12.9

- Thread search options in example types

## 0.12.8

- Use yarn
- Use esbuild for both packaging and test running
- Change github actions to use yarn
- Use import/export syntax instead of CJS
- Co-locate tests with source code

## 0.12.7

- Add coverage to danger

## 0.12.6

- Update the pull-request workflow to better catch test failures

## 0.12.5

- Use the provider specifed on the schema if available.

## 0.12.5

- Ensure \_meta is stripped from filterOnly nodes / nodes without valid context if debug option is falsy

## 0.12.4

- Revert parallelization until we can make it configurable and test more thoroughly

## 0.12.3

- Converted tests to jest

## 0.12.2

- Updated CI to use node16 and npm7
- Updated package-lock.json to version 2

## 0.12.1

- Performance: executing runSearch requests in parallel

## 0.12.0

- Add last 1 Day and last 1 hour to date math calculations

## 0.11.3

- Changed over CI from circleCI to Github Actions.

## 0.11.2

- Cleanup packag-lock.json
- Fix unit test: Date example type test cases - lastCalendarMonth
  - this is a permant fix as it lock the date for the tests
- Refactored date test to make use of bdd-lazy-var

## 0.11.1

- Fix unit test: Date example type test cases - lastCalendarMonth

## 0.11.0

- Export fn to attach \_meta.filters to search nodes

## 0.10.0

- Add next18Months rolling memory date type option

## 0.9.4

- Fix memory date type and add tests

## 0.9.3

- Fix memory facet `exclude` mode & add test

## 0.9.2

- Fix memory exists to work & add test cases for exists & bool types

## 0.9.1

- Memory facet type: handle dotted paths

## 0.9.0

- Memory facet type
  - Unwind results
  - Support non-primitive values when counting results
  - Preserve types of results when filtering them
- Memory results type: do not paginate if pageSize = 0

## 0.8.3

- Bump duti

## 0.8.2

- Fix memory facet type to respect optionsFilter when provided

## 0.8.1

- Fix issue with filter on provider-memory bool type

## 0.8.0

- Add support for date math operations on provider-memory date type

## 0.7.1

- Fix "Desccription" typo to "Description"

## 0.7.0

- Pass the node and path in `onResult`, not the raw context value
- Optimize performance by reducing the number of tree traversals
- Clean up repo by using new `futil` methods instead of local utils
- General refactoring

## 0.6.1

- Fix `raw` function

## 0.6.0

- Add global `raw` example type
- Chore: move from `futil-js` to `futil`

## 0.5.2

- Memory Provider: Fix bug in results type pagination

## 0.5.1

- Documentation: Define DSL

## 0.5.0

- Memory Provider: Add `totalRecords` to `results` example type

## 0.4.2

- Throw Error object instead of just the error message

## 0.4.1

- Pass schemas along in subquery type
- Add missing hasValue functions for subquery and savedSearch

## 0.4.0

- Memory Provider: Add savedSearch type
- Memory Provider: Add subquery type
- Memory Provider: Facet now coerces values to strings (since number options are strings anyway)
- Added facet export data strategy

## 0.3.1

- Refactoring

## 0.3.0

- Add memory provider and tests

## 0.2.1

- Pass `schema` to more step functions

## 0.2.0

- Flatten legacy fields, so `data` and `config` (and their more modern `filterConfig` and `resultConfig` aliases) are merged into the nodes so types can safely ignore the distinction

## 0.1.0

- Supporting `children`.

## 0.0.5

- Ecosystem And Resources readme update (version bump for npm pubishing)

## 0.0.4

- Pass getProvider and getSchema to result functions

## 0.0.3

- Fixed some core bugs, added better tests, and moved to async/await

## 0.0.2

- Add CI configuration and other developer tooling

## 0.0.1

- Initial release
