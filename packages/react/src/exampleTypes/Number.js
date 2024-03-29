import React from 'react'
import _ from 'lodash/fp.js'
import l from 'lodash'
import { Flex } from '../greyVest/index.js'
import { contexturify } from '../utils/hoc.js'

let NumberComponent = ({
  tree,
  node,
  showBestRange = false,
  formatter = _.identity,
  significantDigits,
  theme: { NumberInput, Button },
}) => (
  <div className="contexture-number" data-path={node.path}>
    <Flex style={{ alignItems: 'center' }}>
      <NumberInput
        value={formatter(node.min) || ''}
        onChange={(e) =>
          tree.mutate(node.path, {
            min: _.isNumber(significantDigits)
              ? _.toString(l.round(e.target.value, significantDigits))
              : e.target.value,
          })
        }
      />
      <div className="contexture-number-separator">-</div>
      <NumberInput
        value={formatter(node.max) || ''}
        onChange={(e) =>
          tree.mutate(node.path, {
            max: _.isNumber(significantDigits)
              ? _.toString(l.round(e.target.value, significantDigits))
              : e.target.value,
          })
        }
      />
    </Flex>
    {showBestRange && (
      <div className="contexture-number-best-range">
        <Button
          style={{ width: '100%' }}
          onClick={async () => {
            // Calculate best range
            await tree.mutate(node.path, { findBestRange: true })
            let { min, max } = _.get('context.bestRange', node)
            if (_.isNumber(significantDigits)) {
              min = l.round(min, significantDigits)
              max = l.round(max, significantDigits)
            }
            // Disable best range so the calculation isn't run anymore
            tree.mutate(node.path, {
              findBestRange: false,
              min,
              max,
            })
          }}
        >
          Find best range
        </Button>
      </div>
    )}
  </div>
)

NumberComponent.displayName = 'Number'

export default contexturify(NumberComponent)
