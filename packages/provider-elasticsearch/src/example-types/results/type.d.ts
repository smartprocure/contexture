/**
 * Typings for the result example type.
 */

type Path = string

interface HighlightConfig {
  /**
   * Whether to send highlighting configuration to elastic and merge
   * highlighting results onto source. Defaults to `false`.
   */
  enable?: boolean
  /**
   * Nested paths in arrays of objects that should be copied from source into
   * highlighted results.
   *
   * For example `{ "library.books": ["cover.author"] }` will make it so
   * `cover.author` is copied over from the source array to the highlighted
   * results for the `library.books` array. The motivation being that sometimes
   * arrays are large and it's expensive to include the whole thing in the
   * hits source but some of the array items fields are needed to correctly
   * display the array.
   */
  nestedArrayIncludes?: Record<Path, Array<Path>>
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
