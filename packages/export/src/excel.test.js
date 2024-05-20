import { PassThrough } from 'stream'
import { writeStreamData } from './excel.js'

const testData = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`
const readStream = new PassThrough()
readStream.end(testData)

const destinationStream = new PassThrough()

describe('Stream write test', () => {
  it('writeStreamData()', async () => {
    let outputData = ''
    // Capture the data written as string
    destinationStream.on('data', (chunk) => {
      outputData += chunk.toString()
    })

    const mockWriteStreamData = async () => readStream
    await writeStreamData(destinationStream, mockWriteStreamData)
    destinationStream.end()

    expect(outputData).toStrictEqual(testData)
  })
})
