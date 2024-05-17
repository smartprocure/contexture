import _ from 'lodash/fp.js'
import { PassThrough } from 'stream'
import writeXlsxFile from 'write-excel-file/node'
import readXlsxFile from 'read-excel-file/node'
import { writeStreamData } from './excel.js'

const testDate = new Date()

const HEADER_ROW = [
  {
    value: 'Name',
    fontWeight: 'bold',
  },
  {
    value: 'Date of Birth',
    fontWeight: 'bold',
  },
  {
    value: 'Cost',
    fontWeight: 'bold',
  },
  {
    value: 'Paid',
    fontWeight: 'bold',
  },
]

const DATA_ROW_1 = [
  {
    type: String,
    value: 'John Smith',
  },
  {
    type: Date,
    value: testDate,
    format: 'mm/dd/yyyy',
  },
  {
    type: Number,
    value: 1800,
  },
  {
    type: Boolean,
    value: true,
  },
]

const expectedFileContents = [
  ['Name', 'Date of Birth', 'Cost', 'Paid'],
  ['John Smith', testDate, 1800, true],
]

const excelData = [HEADER_ROW, DATA_ROW_1]

// These are skipped on purpose as they actual write CSVs
describe('Excel Stream Test', () => {
  it('Export to Excel and Validate', async () => {
    const writeStream = new PassThrough()
    const readStream = await writeXlsxFile(excelData)
    await writeStreamData(writeStream, readStream)
    const rows = await readXlsxFile(writeStream)
    console.log(rows)
    console.log(expectedFileContents)
    expect(rows).toStrictEqual(expectedFileContents)
  })
})
