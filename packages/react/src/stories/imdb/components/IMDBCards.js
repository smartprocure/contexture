import _ from 'lodash/fp.js'
import React from 'react'
import { Flex } from '../../../greyVest/index.js'
import { contexturify } from '../../../utils/hoc.js'

let IMDBCards = ({ node }) => (
  <Flex style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
    {_.map(
      ({ _id, _source: { title, poster } }) => (
        <div key={_id} style={{ margin: '5px', textAlign: 'center' }}>
          <img src={poster} width="180" height="270" />
          <div
            style={{ width: '180px' }}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>
      ),
      node.context.response.results
    )}
  </Flex>
)

export default contexturify(IMDBCards)
