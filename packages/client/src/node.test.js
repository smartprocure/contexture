import { vi } from 'vitest'
import { describe, expect, it } from 'vitest'
import { observable } from 'mobx'
import { hasResults } from './node.js'

describe('hasResults()', () => {
  describe('plain traversables', () => {
    it('should return false for empty nested objects', () => {
      const actual = hasResults({
        context: {
          a: null,
          b: '',
          c: undefined,
          d: [null, '', undefined],
        },
      })
      expect(actual).toEqual(false)
    })

    it('should return true for empty nested objects with at least one non-empty value', () => {
      const actual = hasResults({
        context: {
          a: null,
          b: '',
          c: undefined,
          d: 'Leah',
          e: [null, '', undefined],
        },
      })
      expect(actual).toEqual(true)
    })
  })

  describe('mobx traversables', () => {
    it('should return false for empty nested objects', () => {
      const actual = hasResults(
        observable({
          context: {
            a: null,
            b: '',
            c: undefined,
            d: [null, '', undefined],
          },
        })
      )
      expect(actual).toEqual(false)
    })

    it('should return true for empty nested objects with at least one non-empty value', () => {
      const actual = hasResults(
        observable({
          context: {
            a: null,
            b: '',
            c: undefined,
            d: 'Leah',
            e: [null, '', undefined],
          },
        })
      )
      expect(actual).toEqual(true)
    })
  })
})
