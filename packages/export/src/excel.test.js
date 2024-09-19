import { vi, describe, expect, it } from 'vitest'
import { PassThrough } from 'stream'
import _ from 'lodash/fp.js'
import excel from './excel.js'

let iterableData = [
  { name: 'record1', value: 1, nestedValue: { value: 'a' } },
  { name: 'record2', value: 2, nestedValue: { value: 'b' } },
  { name: 'record3', value: 3, nestedValue: { value: 'c' } },
]

let headers = ['NAME', 'Value', 'Nested Value']

let transform = [
  { key: 'name', label: 'THE,NAME', display: _.capitalize },
  { key: 'value', label: 'Value', display: _.identity },
  {
    key: 'nestedValue.value',
    label: 'Value RecordName Key TransformLength',
    display: (value, { key, record, transform }) =>
      `${value} ${record.name} ${key} ${transform.length}`,
  },
]

let expectExcelData = [
  [
    { backgroundColor: '#999999', fontWeight: 'bold', value: 'NAME' },
    { backgroundColor: '#999999', fontWeight: 'bold', value: 'Value' },
    {
      backgroundColor: '#999999',
      fontWeight: 'bold',
      value: 'Nested Value',
    },
  ],
  [
    { backgroundColor: '#bbbbbb', value: 'Record1', wrap: true },
    { value: '1', wrap: true },
    { value: 'a record1 nestedValue.value 3', wrap: true },
  ],
  [
    { backgroundColor: '#bbbbbb', value: 'Record2', wrap: true },
    { value: '2', wrap: true },
    { value: 'b record2 nestedValue.value 3', wrap: true },
  ],
  [
    { backgroundColor: '#bbbbbb', value: 'Record3', wrap: true },
    { value: '3', wrap: true },
    { value: 'c record3 nestedValue.value 3', wrap: true },
  ],
]

describe('Excel export tests', () => {
  it('Excel data transformation test', async () => {
    const readStream = new PassThrough()
    const destinationStream = new PassThrough()
    readStream.end('fake data')

    let finalizeData = new Promise((res, rej) => {
      destinationStream.on('data', () => {})
      destinationStream.on('end', () => res())
      destinationStream.on('error', rej)
    })

    let resultData

    let writeData = async (data) => {
      resultData = data
      return readStream
    }

    await excel({
      stream: destinationStream,
      readStreamData: writeData,
      iterableData,
      transform,
      headers,
    })
    await finalizeData
    expect(resultData).toStrictEqual(expectExcelData)
  })
  it('Write stream data test', async () => {
    const readStream = new PassThrough()
    const destinationStream = new PassThrough()
    readStream.end(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`)

    let destinationData = new Promise((res, rej) => {
      let data = ''
      destinationStream.on('data', (chunk) => {
        data += chunk.toString()
      })
      destinationStream.on('end', () => res(data))
      destinationStream.on('error', rej)
    })

    await excel({
      stream: destinationStream,
      readStreamData: () => readStream,
      iterableData,
      transform,
      headers,
    })

    expect(await destinationData)
      .toStrictEqual(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
      sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`)
  })
})
