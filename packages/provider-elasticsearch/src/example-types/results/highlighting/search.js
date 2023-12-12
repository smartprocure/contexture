import _ from 'lodash/fp.js'
import { getArrayOfObjectsPathsMap } from './util.js'
import {
  addPathsToRequestSource,
  getRequestHighlightFields,
} from './request.js'
import {
  mergeHighlightsOnSource,
  removePathsFromSource,
  transformResponseHighlight,
} from './response.js'

const tags = {
  pre: '<b class="search-highlight">',
  post: '</b>',
}

export const wrapSearch = (node, search, schema) => async (body) => {
  body._source ??= {}
  const addedPaths = addPathsToRequestSource(
    schema,
    body._source,
    // Paths for all fields we'd like to retrieve no matter what.
    // Currently only paths for fields in arrays of objects.
    _.flatten(_.values(getArrayOfObjectsPathsMap(schema)))
  )
  const response = await search({
    ...body,
    highlight: {
      pre_tags: [tags.pre],
      post_tags: [tags.post],
      number_of_fragments: 0,
      fields: getRequestHighlightFields(schema, node),
    },
  })
  for (const hit of response.hits.hits) {
    transformResponseHighlight(schema, hit, tags, node.highlight.arrayIncludes)
    removePathsFromSource(schema, hit, addedPaths)
    mergeHighlightsOnSource(schema, hit)
  }
  return response
}
