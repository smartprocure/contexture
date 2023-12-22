import _ from 'lodash/fp.js'
import F from 'futil'
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

let tags = {
  pre: '<b class="search-highlight">',
  post: '</b>',
}

export let searchWithHighlights = (node, search, schema) => async (body) => {
  // Paths for fields to always include regardless of whether the user included
  // them. They will be removed from the response hits so there's no harm done.
  let pathsToAdd = _.flatten(_.values(getArrayOfObjectsPathsMap(schema)))
  let { addedPaths, ...source } = addPathsToRequestSource(
    schema,
    body._source,
    pathsToAdd
  )

  let response = await search({
    ...body,
    _source: F.omitBlank(source),
    highlight: {
      pre_tags: [tags.pre],
      post_tags: [tags.post],
      number_of_fragments: 0,
      fields: getRequestHighlightFields(schema, node),
    },
  })

  for (let hit of response.hits.hits) {
    let nestedArrayIncludes = node.highlight?.nestedArrayIncludes
    transformResponseHighlight(schema, hit, tags, nestedArrayIncludes)
    removePathsFromSource(schema, hit, addedPaths)
    mergeHighlightsOnSource(schema, hit)
  }

  return response
}
