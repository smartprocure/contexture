let text = require('../../src/example-types/text')

describe('text', () => {
  describe('text.hasValue', () => {
    it('should detect a value', () => {
      expect(
        !!text.hasValue(
          {
            type: 'text',
            field: 'test',
            values: ['asdf'],
          },
          {}
        )
      ).toBe(true)
    })
    it('should detect if values is empty', () => {
      expect(
        !!text.hasValue(
          {
            type: 'text',
            field: 'test',
            values: [],
          },
          {}
        )
      ).toBe(false)
    })
    it('should detect if values only contains an empty string', () => {
      expect(
        !!text.hasValue(
          {
            type: 'text',
            field: 'test',
            values: [''],
          },
          {}
        )
      ).toBe(false)
    })
    it('should detect if value is the empty string', () => {
      expect(
        !!text.hasValue(
          {
            type: 'text',
            field: 'test',
            value: '',
          },
          {}
        )
      ).toBe(false)
    })
  }),
    describe('text.filter', () => {
      describe('should check for values', () => {
        var laserjetPrinterText = operator =>
          text.filter({
            key: 'test',
            type: 'text',
            field: 'description',
            join: 'any',
            operator,
            values: ['laserjet', 'printer'],
          })
        it('containsWord', () => {
          expect(laserjetPrinterText('containsWord')).toEqual({
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
          expect(laserjetPrinterText('containsExact')).toEqual({
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
          expect(laserjetPrinterText('startsWith')).toEqual({
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
          expect(laserjetPrinterText('endsWith')).toEqual({
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
          expect(laserjetPrinterText('is')).toEqual({
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
          expect(laserjetPrinterText('wordStartsWith')).toEqual({
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
          expect(laserjetPrinterText('wordEndsWith')).toEqual({
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
})
