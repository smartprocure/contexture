import _ from 'lodash/fp.js'
import { sanitizeTagInputs } from '../../src/utils/keywordGenerations.js'

describe('keywordGenerations', () => {
    it('should handle positive cases', () => {  
        let result = sanitizeTagInputs(
            [
                {word: '1234567890'}, 
                {word: '0'}, 
                {word: '1'}, 
                {word: '1.1'}, 
                {word: '-1'}, 
                {word: '-1.2354'}, 
                {word: '-1234567890'}, 
                {word: '0x1'}
            ]
        )
        expect(result).toEqual([])
    })

    it('should handle negative cases', () => {
        let result =  sanitizeTagInputs(
            [
                {word: '1..1'},
                {word: '1,1'},
                {word: '-32.1.12'},
                {word: 'false'},
                {word: 'true'},
                {word: 'null'},
                {word: 'undefined'},
                {word: 'NaN'},
            ]
        )
        expect(result).toEqual(
            ['1..1', '1,1', '-32.1.12', 'false', 'true', 'null', 'undefined', 'NaN']
        )
    })
})