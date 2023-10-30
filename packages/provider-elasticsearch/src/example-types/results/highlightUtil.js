import _ from 'lodash/fp.js'
import F from 'futil'

let highlightContentRegEx = ({ pre_tags, post_tags }) =>
  new RegExp(`(?<=${pre_tags[0]})(.*?)(?=${post_tags[0]})`, 'g')

let getHighlightMatches = _.curry((nodeHighlight, highlight) =>
  highlight.match(highlightContentRegEx(nodeHighlight))
)

let getWordListMatchesRegEx = (words) => new RegExp(words?.join('|'), 'gi')

let highlightWith = ({ pre_tags, post_tags }) =>
  F.highlight(pre_tags[0], post_tags[0])

let findHighlightTagsRegEx = ({ pre_tags, post_tags }) =>
  new RegExp(`${pre_tags[0]}|${post_tags[0]}`, 'gi')

let removeHighlightTags = (nodeHighlight, highlightString) =>
  _.replace(findHighlightTagsRegEx(nodeHighlight), '', highlightString)

let getFieldFromSubField = _.flow(
  F.dotEncoder.decode,
  _.dropRight(1),
  F.dotEncoder.encode
)

export let mergeHitHighlights = (
  { pre_tags, post_tags },
  fields,
  hitHighlights
) => {
  if (!fields) return hitHighlights //nothing to merge
  fields = _.remove(_.isPlainObject, fields)
  return _.reduce(
    (highlights, subField) => {
      let field = _.includes(subField, fields)
        ? getFieldFromSubField(subField)
        : undefined
      if (field && hitHighlights[field] && hitHighlights[subField]) {
        let strippedField = removeHighlightTags(
          { pre_tags, post_tags },
          hitHighlights[field]
        )
        let highlightPostings = F.flowMap(
          _.head,
          getHighlightMatches({ pre_tags, post_tags }),
          getWordListMatchesRegEx,
          (wordList) => F.postings(wordList, strippedField)
        )([hitHighlights[field], hitHighlights[subField]])

        let highlightWord = highlightWith({ pre_tags, post_tags })
        let combined = _.flow(
          _.map(([start, end]) => strippedField.substring(start, end)),
          (highlightWords) => [
            highlightWord(
              getWordListMatchesRegEx(highlightWords),
              strippedField
            ),
          ]
        )(F.mergeRanges(_.flatten(highlightPostings)))
        highlights[field] = combined
      } else {
        highlights[field ? field : subField] = !highlights[subField]
          ? hitHighlights[subField]
          : highlights[subField]
      }
      return highlights
    },
    {},
    _.keys(hitHighlights)
  )
}
