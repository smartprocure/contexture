import _ from 'lodash/fp.js'

export let generationTagInputs = _.flow(
    _.map('word'),
    // Removing numbers from the list of words to generate keywords from as
    // number throw off the keyword generation in most cases. 
    _.remove((word) => !isNaN(word) && !isNaN(parseFloat(word)))
  )