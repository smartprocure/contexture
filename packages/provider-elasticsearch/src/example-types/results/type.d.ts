/**
 * Typings for the result example type.
 */

type Path = string

interface HighlightConfig {
  /**
   * Whether to not send highlighting configuration to elastic and merge
   * highlighting results onto source. Defaults to `false`.
   */
  disable?: boolean
  /**
   * By default, highlighted fragments are merged into `_source` unless this
   * flat is set to `true`.
   */
  disableMergingOnSource?: boolean
  /**
   * Paths that should be copied from source into the highlighted results.
   *
   * In the case of arrays of objects, nested paths get copied to every
   * highlighted item in the array. For example, assumming `library.books` to
   * be an array of objects and `cover.author` a nested path inside it,
   * setting `copySourcePaths` to `["library.books.cover.author"]` will copy
   * `cover.author` from the source array to every item in the highlighted
   * results for `library.books`.
   */
  copySourcePaths?: Record<Path, Array<Path>>
}

interface Node {
  /**
   * Custom configuration to control highlighting of results. Currently we don't
   * pick up properties from elastic's
   * [highlighting configuration](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting-settings)
   * so including them here won't have any effect.
   */
  highlight: HighlightConfig
}
