let { maybeAppend } = require('../../src/utils/futil')
let { expect } = require('chai')

describe('futil canidiates', () => {
  it('maybeAppend should work', () => {
    expect(maybeAppend('.txt', 'file')).to.eql('file.txt')
    expect(maybeAppend('.txt', 'file.txt')).to.eql('file.txt')
  })
})
