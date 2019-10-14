import React from 'react'
import _ from 'lodash/fp'
import { storiesOf } from '@storybook/react'
import { defaultProps } from 'recompose'
import { Grid, GridItem as BaseGridItem } from '.'
import decorator from './stories/decorator'

let GridItem = defaultProps({ className: 'gv-grid-item' })(BaseGridItem)

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
        <GridItem area="header">header</GridItem>
        <GridItem area="footer">footer</GridItem>
        <GridItem area="main">main content</GridItem>
        <GridItem area="right">right sidebar</GridItem>
        <GridItem area="left">left sidebar</GridItem>
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
        <GridItem column={4} row={3}>
          (4, 3)
        </GridItem>
        <GridItem column={4} row={8} width={5}>
          (4, 8); 5w
        </GridItem>
        <GridItem column="7/9" row={2} height={4} placeSelf="center center">
          (7:9, 2); 4h
        </GridItem>
        <GridItem column="3/5" row="4/8">
          (3:5, 4:8)
        </GridItem>
        <GridItem area="2/1/4/3">(1:3, 2:4)</GridItem>
        <GridItem>A</GridItem>
        <GridItem>B</GridItem>
        <GridItem width={2}>C; 2w</GridItem>
      </Grid>
    </>
  ))
  .addWithJSX('Rows/columns shorthand', () => (
    <Grid columns={5} gap={10}>
      {_.times(
        n => (
          <div style={{ border: '2px solid black' }}>{n}</div>
        ),
        20
      )}
    </Grid>
  ))
