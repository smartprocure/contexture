export let options = [
  { value: 'Field1', field: 'Field1', typeDefault: 'number', label: 'Field 1' },
  { value: 'Field2', field: 'Field2', typeDefault: 'number', label: 'Field 2' },
  {
    value: 'GroupA.FieldA.value',
    field: 'GroupA.FieldA.value',
    typeDefault: 'number',
    label: 'value',
  },
  {
    value: 'GroupA.FieldB.name',
    field: 'GroupA.FieldB.name',
    typeDefault: 'string',
    label: 'name',
  },
  {
    value: 'GroupA.FieldC.value',
    field: 'GroupA.FieldC.value',
    typeDefault: 'number',
    label: 'value',
  },
  {
    value: 'GroupA.FieldC.name',
    field: 'GroupA.FieldC.name',
    typeDefault: 'string',
    label: 'name',
  },
  {
    value: 'GroupA.FieldD',
    field: 'GroupA.FieldD',
    typeDefault: 'number',
    label: 'Field D',
  },
  {
    value: 'GroupA.FieldE',
    field: 'GroupA.FieldE',
    typeDefault: 'number',
    label: 'Field E',
  },
  {
    value: 'GroupA.FieldF',
    field: 'GroupA.FieldF',
    typeDefault: 'number',
    label: 'Field F',
  },
  {
    value: 'GroupA.FieldG',
    field: 'GroupA.FieldG',
    typeDefault: 'number',
    label: 'Field G',
  },
  {
    value: 'GroupA.FieldH',
    field: 'GroupA.FieldH',
    typeDefault: 'number',
    label: 'Field H',
  },
  {
    value: 'GroupA.FieldI',
    field: 'GroupA.FieldI',
    typeDefault: 'number',
    label: 'Field I',
  },
  {
    value: 'GroupA.FieldJ',
    field: 'GroupA.FieldJ',
    typeDefault: 'number',
    label: 'Field J',
  },
  {
    value: 'GroupA.GroupB.FieldB1',
    field: 'GroupA.GroupB.FieldB1',
    typeDefault: 'facet',
    label: 'Field B1',
  },
  {
    value: 'GroupA.GroupB.FieldB2',
    field: 'GroupA.GroupB.FieldB2',
    typeDefault: 'facet',
    label: 'Field B2',
  },
  {
    value: 'GroupA.GroupB.GroupC.FieldC1',
    field: 'GroupA.GroupB.GroupC.FieldC1',
    typeDefault: 'number',
    label: 'Field C1',
  },
  {
    value: 'GroupA.GroupB.GroupC.FieldC2',
    field: 'GroupA.GroupB.GroupC.FieldC2',
    typeDefault: 'number',
    label: 'Field C2',
  },
  // Commonly Used Section Examples
  // Fields with `isCommonlyUsed` set, will show in a group node "Commonly Used Fields" as a flat list regardless of their path nesting.
  // In addition, they will also show in their regular place in the group tree based on their path (with nesting where applicable)
  {
    value: 'GroupA.GroupB.FieldC1',
    field: 'GroupA.GroupB.FieldC1',
    label: 'Commonly Used 1',
    typeDefault: 'number',
    description:
      'I tend to be pretty useful on my good days, but you never know really. I tend to be pretty useful on my good days, but you never know really.',
    isCommonlyUsed: true,
  },
  {
    value: 'GroupF.FieldE1',
    field: 'GroupF.FieldE1',
    label: 'Commonly Used 2',
    description:
      'This is a super-duper useful field, you should totally select it. This is a super-duper useful field, you should totally select it. This is a super-duper useful field, you should totally select it.',
    typeDefault: 'number',
    isCommonlyUsed: true,
  },
  {
    value: 'GroupA.GroupC.FieldD1',
    field: 'GroupA.GroupC.FieldD1',
    label: 'Commonly Used 3',
    typeDefault: 'number',
    description: 'You should pick me or suffer the consequences',
    isCommonlyUsed: true,
  },
]
