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

export const searchWithHighlights = (node, search, schema) => async (body) => {
  // Paths for fields to always include regardless of whether the user included
  // them. They will be removed from the response hits so there's no harm done.
  const pathsToAdd = _.flatten(_.values(getArrayOfObjectsPathsMap(schema)))

  // body._source is mutated here
  const addedPaths = addPathsToRequestSource(schema, body._source, pathsToAdd)

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
    const nestedArrayIncludes = node.highlight.nestedArrayIncludes
    transformResponseHighlight(schema, hit, tags, nestedArrayIncludes)
    removePathsFromSource(schema, hit, addedPaths)
    mergeHighlightsOnSource(schema, hit)
  }

  return response
}
