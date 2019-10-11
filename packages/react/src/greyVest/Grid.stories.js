import React from 'react'
import { storiesOf } from '@storybook/react'
import { Grid, GridItem } from '.'
import decorator from './stories/decorator'

storiesOf('Components|GreyVest Library/Grid', module)
  .addDecorator(decorator)
  .addDecorator(Story => (
    <>
      <style>{`
      .gv-grid-item {
        border: 2px solid black;
      }
    `}</style>
      <Story />
    </>
  ))
  .addWithJSX('Grail Demo', () => (
    <Grid
      gap="20px 30px"
      areas={[
        'header header header',
        'left main right',
        'footer footer footer',
      ]}
      rows="2fr 5fr 1fr"
      columns="1fr 3fr 1fr"
    >
      <GridItem area="header" middle center>
        header
      </GridItem>
      <GridItem area="footer" middle center>
        footer
      </GridItem>
      <GridItem area="main">main content</GridItem>
      <GridItem area="right" center>
        right sidebar
      </GridItem>
      <GridItem area="left" center>
        left sidebar
      </GridItem>
    </Grid>
  ))
