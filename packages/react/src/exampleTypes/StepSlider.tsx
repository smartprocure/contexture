import React, { FC, useState } from 'react'
import _ from 'lodash/fp.js'
import {
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Box,
  Tooltip,
  Text,
  HStack,
  Stack,
} from '@chakra-ui/react'
import { contexturify } from '../utils/hoc'
import { toNumber } from '../utils/format'
import { FormatterFn, Node, Tree } from '../types/contexture'

/** This theme is an initial step towards looking further
 * at the tokenization to be set by our design system. */
const theme = {
  color: {
    blue: { 100: '#CCE7FF', 500: '#0076DE', 700: '#005199' },
    gray: { 50: '#FFFFFF', 100: '#E7EAEE' },
    container: { border: { sm: '#E7EAEE' } },
    text: {
      body: {
        primary: '#495569',
        tertiary: '#697996',
      },
    },
  },
  radius: { base: { xs: '8px' } },
  font: { size: { xs: '10px', md: '14px' } },
}

export type UnknownRec = Record<string, unknown>

type NodeProps = {
  range: number[]
  steps: number[]
}

type ContextProps = {
  recordsCount: number
}

interface StepSliderProps {
  node: Node<NodeProps, ContextProps>
  formatter: FormatterFn
  path: string
  tree: Tree<NodeProps>
}

const getDefaultRange = (steps: number[], range: number[]): number[] => {
  if (range.length === 0) return [0, steps.length - 1]
  const minStep = steps.findIndex((step: number) => step === range[0])
  const maxStep = steps.findIndex((step: number) => step === range[1])
  return [minStep, maxStep]
}

const getRealValue = (steps: number[], value: number): number => {
  return steps[value]
}

const StepSlider: FC<StepSliderProps> = ({
  tree,
  node,
  formatter = toNumber,
}) => {
  const formatValue = (value: number): string => {
    const realValue = getRealValue(steps, value)
    const lastStepValue = steps[steps.length - 1]
    if (realValue === lastStepValue) return `${formatter(realValue)}+`
    return formatter(realValue).toString()
  }

  const steps = node.steps
  const count = node.context.recordsCount ?? 0
  const defaultRange = getDefaultRange(steps, node.range)
  const [rangeValues, setRangeValues] = useState(defaultRange)

  const onRangeUpdated = (range: number[]) => {
    const realRange = [
      getRealValue(steps, range[0]),
      getRealValue(steps, range[1]),
    ]
    tree.mutate(node.path, { range: realRange })
  }

  const realFormattedMin = formatValue(rangeValues[0])
  const realFormattedMax = formatValue(rangeValues[1])
  const rangeLabel = `${realFormattedMin} -  ${realFormattedMax}`
  const currentCount = formatter(count).toString()

  return (
    <Box>
      <HStack paddingX="4px" justifyContent="space-between">
        <Label value={rangeLabel} label="Range" />
        <Label value={currentCount} label="Results" alignment="right" />
      </HStack>
      {/** This padding exists because of contexture native margins.
       * When the slider thumb is encapsulated on the filter UI,
       * part of it gets cut if no padding is applied. */}
      <Box marginTop="6px" paddingX="11px">
        <RangeSlider
          aria-label={['min', 'max']}
          min={steps[0]}
          max={steps.length - 1}
          minStepsBetweenThumbs={1}
          onChange={setRangeValues}
          onChangeEnd={onRangeUpdated}
          defaultValue={defaultRange}
          marginTop={2}
        >
          <RangeSliderTrack background={theme.color.gray[100]}>
            <RangeSliderFilledTrack background={theme.color.blue[500]} />
          </RangeSliderTrack>

          <SliderThumb index={0} label={realFormattedMin} />
          <SliderThumb index={1} label={realFormattedMax} />
        </RangeSlider>
      </Box>
    </Box>
  )
}

interface SliderThumbProps {
  index: number
  label: string
}

const SliderThumb: FC<SliderThumbProps> = ({ index, label }) => (
  <Tooltip
    label={label}
    placement="top"
    paddingX="12px"
    boxShadow="0"
    borderWidth="1px"
    borderRadius={theme.radius.base.xs}
    background={theme.color.gray[50]}
    borderColor={theme.color.container.border.sm}
    color={theme.color.text.body.primary}
    closeDelay={1000}
  >
    <RangeSliderThumb
      index={index}
      borderWidth="2px"
      background={theme.color.gray[50]}
      borderColor={theme.color.blue[500]}
      _hover={{ borderColor: theme.color.blue[700] }}
      _focus={{ boxShadow: `0 0 0 3px ${theme.color.blue[100]}` }}
      _active={{ borderColor: theme.color.blue[700] }}
    />
  </Tooltip>
)

interface LabelProps {
  value: string
  label: string
  alignment?: 'left' | 'right'
}

const Label: FC<LabelProps> = ({ value, label, alignment = 'left' }) => {
  const cssAlignment = alignment === 'left' ? 'flex-start' : 'flex-end'
  return (
    <Stack alignItems={cssAlignment}>
      <Text
        color={theme.color.text.body.primary}
        fontSize={theme.font.size.md}
        lineHeight={theme.font.size.md}
        fontWeight={700}
      >
        {value}
      </Text>
      <Text
        color={theme.color.text.body.tertiary}
        fontSize={theme.font.size.xs}
        lineHeight={theme.font.size.xs}
      >
        {label}
      </Text>
    </Stack>
  )
}

export default contexturify(StepSlider)
