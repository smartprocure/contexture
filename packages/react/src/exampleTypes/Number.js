import React from 'react'
import _ from 'lodash/fp'
import { round } from 'lodash'
import Flex from '../layout/Flex'
import { contexturify } from '../utils/hoc'
import { withTheme } from '../utils/theme'

let NumberComponent = _.flow(contexturify, withTheme)(
  ({
    tree,
    node,
    theme: { NumberInput, Button },
    showBestRange = false,
    formatter = _.identity,
    significantDigits,
  }) => (
    <div className="contexture-number">
      <Flex style={{ alignItems: 'center' }}>
        <NumberInput
          value={formatter(node.min) || ''}
          onChange={e =>
            tree.mutate(node.path, {
              min: _.isNumber(significantDigits)
                ? _.toString(round(e.target.value, significantDigits))
                : e.target.value,
            })
          }
        />
        <div className="contexture-number-separator">-</div>
        <NumberInput
          value={formatter(node.max) || ''}
          onChange={e =>
            tree.mutate(node.path, {
              max: _.isNumber(significantDigits)
                ? _.toString(round(e.target.value, significantDigits))
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
                min = round(min, significantDigits)
                max = round(max, significantDigits)
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
)
NumberComponent.displayName = 'Number'

export default NumberComponent
