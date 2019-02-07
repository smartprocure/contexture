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
