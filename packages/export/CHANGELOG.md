# 1.0.0
* Strategies are now native JS async iterables (using async generators)
* BREAKING:
  * Most `exportStrategies` are removed - `bulk`, `page`, `stream`
    * `bulk` can be replicated with `it-all`
    * `stream` and `page` are handled by native `for await` loops
* Cleanup: `CSVStream` overhauled by outsourcing as much as possible to @fast-csv  


# 0.2.10
* `CSVStream` exportStrategy: document `omitFieldsFromResult`, refactoring.

# 0.2.9
* `CSVStream` exportStreategy: allow omitting fields from CSV rows

# 0.2.8
* `results` dataStrategy: spread `_source` onto results items.

# 0.2.7
* Use original record for each field's display function in `formatValues`

# 0.2.6
* Pass `skipCount` to resultConfig in results data strategy so that search provider can skip `count query` if supported

# 0.2.5
* Do not flatten record during display formatting in `formatValues`

# 0.2.4
* Pass record as second argument to field display function in `formatValues` 

# 0.2.3
* Support arbitrary props (like `populate`) to the `result` data strategy

# 0.2.2
* Fix an issue with dataStrategies which prevents mongo exports

# 0.2.1
* Enable support for include in terms stats data strategy.

# 0.2.0
* Add support for `results` nodes which don't wrap their context objects in `response` (like contexture-memory)

# 0.1.10
* Only call display if fn exists.

# 0.1.9
* Fix missing columns issue due to not all columns having results in the first row

# 0.1.8
* Elasticsearch scrolling off by default in results strategy

# 0.1.7
* Better CSV processing.

# 0.1.6
* Fixing missing columns. Now, colums will be added as long as there
  are format rules for them.

# 0.1.5
* Fixed terms_stats getTotalRecords so it doesn't use _.memoize.
  Memoize behaves weirdly with async functions (probably because this
  is compiled).

# 0.1.4
* Fixed terms_stats so that size 0 means get all the results (just like how terms_stats works).

# 0.1.3
* Pass `highlight` to results dataStrategy

# 0.1.2
* Fixed getTotalRecords in the terms_stats dataStrategy.

# 0.1.1
* Exposed formatTree.

# 0.1.0
* This project is now compiled with webpack.

# 0.0.2
* Fixing the main index location in the package.json

# 0.0.1
* Initial release
