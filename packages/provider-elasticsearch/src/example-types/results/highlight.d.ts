declare enum HighlightBehavior {
  /**
   * Replace source values with highlighted results.
   */
  replaceSource,
}

interface Highlight {
  /**
   * How to handle highlighted results from elastic. Setting this field to a
   * non-empty value will automatically enable highlighting.
   */
  behavior?: HighlightBehavior
  /**
   * Remove non-highlighted items in source arrays when
   * `behavior: "replaceSource"`.
   */
  filterSourceArrays?: boolean
  /**
   * Just like elastic's
   * [pre_tags](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/highlighting.html#highlighting-settings),
   * except we only support one tag for now. The default is `<b class="search-highlight">`.
   */
  pre_tag?: string
  /**
   * Just like elastic's
   * [post_tags](https://www.elastic.co/guide/en/elasticsearch/reference/8.11/highlighting.html#highlighting-settings),
   * except we only support one tag for now. The default is `</b>`.
   */
  post_tag?: string
}
