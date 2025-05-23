import step from './step.js'
import { expect, describe, it } from 'vitest'

const { hasValue, filter, buildQuery } = step

describe('step', () => {
  const input = {
    type: 'step',
    field: 'test',
    min: 0,
    max: 500,
    steps: [0, 500, 1000],
  }

  it('checks if range is present and not empty', () => {
    let inputWithoutRange = { type: 'step', field: 'test' }
    expect(!!hasValue(input)).toBe(true)
    expect(!!hasValue(inputWithoutRange)).toBe(false)
  })

  it('returns proper elastic query', () => {
    let expectedValue = { range: { test: { gte: 0, lte: 500 } } }
    expect(filter(input)).toEqual(expectedValue)
  })

  it('removes upper bound when upper bound is null', () => {
    const inputWithNewRange = {
      ...input,
      min: 0,
      max: null,
    }
    let expectedValue = { range: { test: { gte: 0 } } }
    expect(filter(inputWithNewRange)).toEqual(expectedValue)
  })

  it('returns proper elastic DSL', async () => {
    let expectedDSL = {
      aggs: {
        rangeFilter: {
          filter: { range: { test: { gte: 0, lte: 500 } } },
        },
      },
    }
    let output = buildQuery(input.field, input.min, input.max)
    expect(output).toEqual(expectedDSL)
  })
})
