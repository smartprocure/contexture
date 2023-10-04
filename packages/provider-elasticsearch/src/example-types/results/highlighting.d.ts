/*
 * Unfortunately we do not support Typescript in this repo yet, but types are
 * still very useful for documentation purposes.
 *
 * # Links of interest
 *
 * - Elastic's [canonical documentation on highlighting](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html)
 */

/** Can end in a wildcard (`*`) */
type FieldName = string

/** Should not end in a wildcard */
type LiteralFieldName = string

/**
 * Highlighting configuration set on schemas
 */
type SchemaHighlightConfig = {
  /**
   * Names of fields that should be replaced by their highlighted results. For
   * example, given `inline=["name"]`, `_source.name` will be replaced by
   * `highlight.name` in the following elasticsearch hit
   *
   * ```
   * {
   *   _source: { name: "Johny", hobby: "Fishing" },
   *   highlight: { name: "<em>Joh</em>ny" },
   * }
   * ```
   *
   * If a field name ends in a wildcard, all fields with the same prefix as
   * the former will be replaced by their highlighted result.
   *
   * If a field is listed here, is highlighted (present in `hit.highlight`), and
   * not present in the result node's `include` array, it will be added to
   * `additionalFields` in the hit. For example, given `include=["name", "hobby"]`
   * the following hit
   *
   * ```
   * {
   *   _source: { name: "Johny", hobby: "Fishing" },
   *   highlight: { address: "123 <em>Ave</em>nue" },
   * }
   * ```
   *
   * will be mapped to
   *
   * ```
   * {
   *   _source: { name: "Johny", hobby: "Fishing" },
   *   highlight: { address: "123 <em>Ave</em>nue" },
   *   additionalFields: [{ label: "address", value: "123 <em>Ave</em>nue" }]
   * }
   * ```
   */
  inline: Array<FieldName>

  /**
   * Used to replace inline highlighted results in unrelated `_source` fields.
   *
   * Keys are `_source` fields and values are `highlight` results. For example,
   * given `inlineAliases={"name":"address"}` the following hit
   *
   * ```
   * {
   *   _source: { name: "Johny", hobby: "Fishing" },
   *   highlight: { address: "123 <em>Ave</em>nue" },
   * }
   * ```
   *
   * will be mapped to
   *
   * ```
   * {
   *   _source: { name:"123 <em>Ave</em>nue", hobby: "Fishing" },
   *   highlight: { address: "123 <em>Ave</em>nue" },
   * }
   * ```
   *
   * `inline` has priority, so `inlineAliases` only applies if the field is not
   * in `inline` OR if there's no highlight result for the `inline` field.
   */
  inlineAliases: Record<LiteralFieldName, LiteralFieldName>

  /**
   * Fields in this list will be copied from a hit's `highlight` to
   * `additionalFields`. For example, given `additional=["name"]`, the following
   * elasticsearch hit
   *
   * ```
   * {
   *   _source: { name: "Johny", hobby: "Fishing" },
   *   highlight: { name: "<em>Joh</em>ny" },
   * }
   * ```
   *
   * will be mapped to
   *
   * ```
   * {
   *   _source: { name: "Johny", hobby: "Fishing" },
   *   highlight: { name: "<em>Joh</em>ny" },
   *   additionalFields: [{ label: "name", value: "123 <em>Joh</em>ny" }]
   * }
   * ```
   *
   * Fields in `inline`, `nested`, or `additionalExclusions` will not be copied
   * over to `additionalFields` even if included here.
   */
  additional: Array<FieldName | RegExp>

  /**
   * Fields in this list will be omitted from `additionalFields` even if they
   * are included in `additional`.
   */
  additionalExclusions: Array<FieldName | RegExp>

  /**
   * @deprecated
   * This is not currently used for anything
   */
  additionalFields: any

  /**
   * In the following context, a nested field is a field contained inside of an
   * array field.
   *
   * Highlighting results inside of an array field is tricky because elastic
   * only returns highlighted items instead of all items of the array field and
   * it provides no way of knowing the highlighted items indexes in the array.
   * This is the behavior even when
   * [number_of_fragments](https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#highlighting-settings)
   * is set to 0. There are two known solutions:
   *
   *   1. Change the type of the array field to `nested` and send a
   *      [nested query](https://www.elastic.co/guide/en/elasticsearch/reference/current/inner-hits.html#nested-inner-hits)
   *      and elastic will include the array index in the results. Also see
   *      [this comment](https://github.com/elastic/elasticsearch/issues/7416#issuecomment-1650617883).
   *      Keep in mind that changing a field type to `nested` will index each item
   *      in the array, so it is costly to make big arrays `nested`.
   *   2. For every item in the array, replace field value with highlighted
   *      value if their text content matches. Notice that `number_of_fragments`
   *      has to 0 to be able to compare items in full.
   *
   * See https://github.com/elastic/elasticsearch/issues/7416 for more info.
   *
   * Fields listed here will be assumed to be inside of an array field and
   * approach 2. will be used to inline the highlighted results in the original
   * array value.
   *
   * NOTE: Currently, all fields specified here should belong to the same array.
   * In the future we may make the API more flexible to handle for multiple
   * array fields.
   */
  nested: Array<FieldName | RegExp>

  /**
   * Name for the array field containing all the `nested` fields. Required when
   * `nested` is provided.
   */
  nestedPath: string

  /**
   * Whether to remove non-highlighted values from the `_source` array field
   * after inline substitution of highlighted results is done.
   */
  filterNested: boolean
}

type Schema = {
  elasticsearch: {
    highlight: SchemaHighlightConfig
  }
}

// https://www.elastic.co/guide/en/elasticsearch/reference/current/highlighting.html#override-global-settings
type ElasticHighlightConfig = any

type Node = {
  // TODO
  showOtherMatches: boolean
  /**
   * Per-node highlighting configuration. If `false`, highlighting is disabled.
   */
  highlight:
    | false
    | {
        fields: Record<FieldName, ElasticHighlightConfig>
        /** Override schema's `elasticsearch.highlight` with this */
        override: SchemaHighlightConfig
      }
}
