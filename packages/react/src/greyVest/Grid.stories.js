import React from 'react'
import { storiesOf } from '@storybook/react'
import { Grid, GridItem } from '.'
import decorator from './stories/decorator'

storiesOf('Components|GreyVest Library/Grid', module)
  .addDecorator(decorator)
  .addWithJSX('Grail Demo', () => (
    <>
      <style>{`
        .gv-grid-item {
          border: 2px solid black;
        }
      `}</style>
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
    </>
  ))
  .addWithJSX('GridItem positioning', () => (
    <>
      <style>{`
        .gv-grid-item {
          padding: 5px;
          background-color: white;
          display: inline-flex;
          flex-flow: column wrap;
          justify-content: center;
          justify-self: stretch;
          text-align: center;
        }
      `}</style>
      <Grid
        columns="repeat(8, 50px)"
        rows="repeat(8, 50px)"
        gap={2}
        style={{ backgroundColor: 'lightgrey', display: 'inline-grid' }}
      >
        <GridItem left={4} top={3}>
          (4, 3)
        </GridItem>
        <GridItem left={4} top={8} width={5}>
          (4, 8); 5w
        </GridItem>
        <GridItem columnStart={7} rowStart={2} height={4} columnEnd={9}>
          (7:9, 2); 4h
        </GridItem>
        <GridItem left={3} top={4} rowEnd={8} columnEnd={5}>
          (3:5, 4:8)
        </GridItem>
        <GridItem area="2 / 1 / 4 / 3">(1:3, 2:4)</GridItem>
        <GridItem>A</GridItem>
        <GridItem>B</GridItem>
        <GridItem columnEnd="span 2">C; 2w</GridItem>
      </Grid>
    </>
  ))
