import React from 'react'
import Flex from '../../layout/Flex'
import ResultPager from '../../exampleTypes/ResultPager'
import ResultTable from '../../exampleTypes/ResultTable'

let PagedResultTable = ({ tree, node, path, ...props }) => (
  <>
    <ResultTable {...{ tree, node, path, ...props }} />
    <Flex style={{ justifyContent: 'space-around', padding: '10px' }}>
      <ResultPager {...{ tree, node, path }} />
    </Flex>
  </>
)
export default PagedResultTable
