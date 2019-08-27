import _ from 'lodash/fp'
import React from 'react'
import Flex from '../../../src/greyVest/Flex'
import { contexturify } from '../../../src/utils/hoc'

let IMDBCards = contexturify(({ node }) => (
  <Flex style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
    {_.map(
      ({ _id, _source: { title, poster } }) => (
        <div key={_id} style={{ margin: '5px', textAlign: 'center' }}>
          <img src={poster} width="180" height="270" />
          <div style={{ width: '180px' }}>{title}</div>
        </div>
      ),
      node.context.response.results
    )}
  </Flex>
))
IMDBCards.displayName = 'IMDBCards'

export default IMDBCards
