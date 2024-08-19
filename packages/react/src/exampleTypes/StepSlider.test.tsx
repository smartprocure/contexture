import React from 'react'

import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { act, screen, within } from '@testing-library/react'

import StepSlider from './StepSlider'

import testTree from './stories/testTree'
import { renderWithProviders } from '../utils/test'

describe('StepSlider', () => {
  beforeEach(() => {
    renderWithProviders(<StepSlider tree={testTree()} path={['step']} />)
  })

  it('renders range slider', async () => {
    const rangeSlider = await screen.getByTestId('chakra-range-slider-track')
    const rangeSliderThumbs = await screen.getAllByRole('slider')
    expect(rangeSlider).toBeInTheDocument()
    expect(rangeSliderThumbs).toHaveLength(2)
  })

  it('renders min and max values', async () => {
    const rangeLabel = await screen.queryByText('Range')
    const rangeValue = await screen.queryByText('0 - 1,000')
    expect(rangeLabel).toBeInTheDocument()
    expect(rangeValue).toBeInTheDocument()
  })

  it('renders results', async () => {
    const countLabel = await screen.queryByText('Results')
    const countValue = await screen.queryByText('400,000')
    expect(countLabel).toBeInTheDocument()
    expect(countValue).toBeInTheDocument()
  })

  /** Testing this behavior was not feasible */
  it.skip('slides between steps', async () => {
    const [_, maxThumb] = await screen.getAllByRole('slider')

    /** None strategies applied were successful.
     *  Approaches: fireEvent, keyboard type,
     *  pointer simulation */
    await act(async () => {
      await userEvent.pointer([
        { target: maxThumb, keys: '[MouseLeft>]' },
        { target: maxThumb, coords: { offsetX: 500 } },
      ])
    })

    const minAndMaxLabel = await screen.queryByText('0 - 5,000')
    expect(minAndMaxLabel).toBeInTheDocument()
  })
})
