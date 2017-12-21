### 0.2.1
* [Facet] Make filtering work with includeZeroes
* [Facet] Move off of `lowercased` and `exact`
* [Facet] Use term `include` intead of wildcard filter

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
