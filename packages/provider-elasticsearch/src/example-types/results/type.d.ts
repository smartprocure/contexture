/**
 * Typings for the result example type.
 */

interface HighlightConfig {
  /**
   * Whether to send highlighting configuration to elastic and merge
   * highlighting results onto source. Defaults to `false`.
   */
  enable?: boolean
  /**
   * Whether to remove non-highlighted items in source arrays. Defaults to
   * `false`.
   */
  filterSourceArrays?: boolean
  /**
   * Just like elastic's
   * [pre_tags](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/highlighting.html#highlighting-settings),
   * except we only support one tag for now. Defaults to `<b class="search-highlight">`.
   */
  pre_tag?: string
  /**
   * Just like elastic's
   * [post_tags](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/highlighting.html#highlighting-settings),
   * except we only support one tag for now. Defaults to `</b>`.
   */
  post_tag?: string
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
