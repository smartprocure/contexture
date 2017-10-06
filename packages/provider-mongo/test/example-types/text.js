let { expect } = require('chai')
let text = require('../../src/example-types/text')

describe('text', () => {
  it('should check for values', () => {
    expect(
      !!text.hasValue({
        type: 'text',
        field: 'test',
        data: {
          values: ['asdf'],
        },
      })
    ).to.be.true
    expect(
      !!text.hasValue({
        type: 'text',
        field: 'test',
        data: {
          values: [],
        },
      })
    ).to.be.false
  })
  describe('filter', () => {
    var laserjetPrinterText = operator =>
      text.filter({
        key: 'test',
        type: 'text',
        field: 'description',
        data: {
          join: 'any',
          operator: operator,
          values: ['laserjet', 'printer'],
        },
      })
    it('containsWord', () => {
      expect(laserjetPrinterText('containsWord')).to.deep.equal({
        $or: [
          {
            description: {
              $regex: 'laserjet',
              $options: 'i',
            },
          },
          {
            description: {
              $regex: 'printer',
              $options: 'i',
            },
          },
        ],
      })
    })
    it('containsExact', () => {
      expect(laserjetPrinterText('containsExact')).to.deep.equal({
        $or: [
          {
            description: {
              $regex: '\\blaserjet\\b',
              $options: 'i',
            },
          },
          {
            description: {
              $regex: '\\bprinter\\b',
              $options: 'i',
            },
          },
        ],
      })
    })
    it('startsWith', () => {
      expect(laserjetPrinterText('startsWith')).to.deep.equal({
        $or: [
          {
            description: {
              $regex: '^laserjet',
              $options: 'i',
            },
          },
          {
            description: {
              $regex: '^printer',
              $options: 'i',
            },
          },
        ],
      })
    })
    it('endsWith', () => {
      expect(laserjetPrinterText('endsWith')).to.deep.equal({
        $or: [
          {
            description: {
              $regex: 'laserjet$',
              $options: 'i',
            },
          },
          {
            description: {
              $regex: 'printer$',
              $options: 'i',
            },
          },
        ],
      })
    })
    it('is', () => {
      expect(laserjetPrinterText('is')).to.deep.equal({
        $or: [
          {
            description: {
              $regex: '^laserjet$',
              $options: 'i',
            },
          },
          {
            description: {
              $regex: '^printer$',
              $options: 'i',
            },
          },
        ],
      })
    })
    it('wordStartsWith', () => {
      expect(laserjetPrinterText('wordStartsWith')).to.deep.equal({
        $or: [
          {
            description: {
              $regex: '\\blaserjet',
              $options: 'i',
            },
          },
          {
            description: {
              $regex: '\\bprinter',
              $options: 'i',
            },
          },
        ],
      })
    })
    it('wordEndsWith', () => {
      expect(laserjetPrinterText('wordEndsWith')).to.deep.equal({
        $or: [
          {
            description: {
              $regex: 'laserjet\\b',
              $options: 'i',
            },
          },
          {
            description: {
              $regex: 'printer\\b',
              $options: 'i',
            },
          },
        ],
      })
    })
  })
})
