import React from 'react'
import { contexturify } from '../utils/hoc'

let getValue = (value, either) => _.isBoolean(value)
  ? value
  : either ? null : false

let Exists = ({
  tree,
  node,
  display = () => ['Exists', 'Does Not Exist', 'Either'],
  theme: { RadioList },
}) => {
  let [exists, doesNotExist, either] = display()
  return (
    <div className="contexture-exists">
      <RadioList
        value={getValue(node.value, either)}
        onChange={value => {
          tree.mutate(node.path, {
            value: getValue(value, either)
          })
        }}
        options={[
          { label: exists, value: true }, 
          { label: doesNotExist, value: false }, 
          ...(either ? [{ label: either, value: null}] : [])
        ]}
      />
    </div>
  )
}

export default contexturify(Exists)
