# contexture-react

React components for building contexture interfaces https://smartprocure.github.io/contexture-react

<!---
Comment this out once we enable greenkeeper
[![Greenkeeper badge](https://badges.greenkeeper.io/smartprocure/contexture-react.svg)](https://greenkeeper.io/)
--->
[![CircleCI](https://circleci.com/gh/smartprocure/contexture-react.svg?style=svg)](https://circleci.com/gh/smartprocure/contexture-react)
[![npm version](https://badge.fury.io/js/contexture-react.svg)](https://badge.fury.io/js/contexture-react)
![dependencies](https://david-dm.org/smartprocure/contexture-react.svg)
[![Storybook](https://img.shields.io/badge/BUILT_WITH-STORYBOOK-f1618c.svg?style=for-the-badge)](https://smartprocure.github.io/contexture-react)

## Installation

To install with `npm`:

```
$ npm i contexture-react
```

## Structure & Usage

Contexture-react includes the following:

1. *React components for building contexture interfaces*, known simply as **search components** throughout our documentation

2. The GreyVest **component library**

3. Some pre-made **themes** for our search components, including a GreyVest theme

4. Utility functions for building contexture interfaces, theming, and more

5. [Storybook stories](https://smartprocure.github.io/contexture-react) for documenting and testing our components

Here is a quick guide to the directory structure: 

| Folder | Description |
| --- | --- |
| `src/exampleTypes` | Contains React components for the set of example node types included in contexture-client. Exported as `exampleTypes`. |
| `src/greyVest` | Contains the Grey Vest component library, which is exported as `greyVest` and consists of basic React components.  Used by the Grey Vest theme. |
| `src/themes` | Contains the Grey Vest, Blueberry, Material, and base themes, hopefully with more soon to come. Exported as `themes`. |
| `src/purgatory` | Neither search components nor library components -- they just have nowhere else to go. |
| everything else | 

## Documentation

Documentation lives in our [Storybook](https://smartprocure.github.io/contexture-react). Stories of interest include:
- [Theming documentation](https://smartprocure.github.io/contexture-react/?path=/story/developer-notes-docs--theme-api)
- A [Live Demo](https://smartprocure.github.io/contexture-react/?path=/story/live-demos-imdb-search--dynamic-search-layout) using IMDB data
- [Changelog](https://github.com/smartprocure/contexture-react/blob/master/CHANGELOG.md)

## Notes on this repository

This project was scaffolded generally following this link: https://medium.com/@efreyreg/create-react-component-libraries-with-storybook-and-styled-jsx-8999f423f06b

## Cross Browser Testing

Cross browser testing is done using BrowserStack thanks to their awesome support for open source projects!

[![BrowserStack](https://p14.zdusercontent.com/attachment/1015988/jKFhzb4Aj7J0lTB0zLpzYpFzs?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..kRqEzKpnuMPlCW73WjIR2g.721XUudT3iSydu0vWxcM3LWbPRpr3SYQwZBkzIPmL4ffyYG2Sqa99fKq8dREp6vRd5EUeW8Yfzp3Vyx79eFYT5jpXWNv8EeeqmmaPb-Eg9YzJSdxhfmBnOc553RWhFjo6pz8UqqU7BlVo2IVnOY6Tkt82TqscBvCJQAp0KG5kgIzcHr5Q5v6CNobhIT0I2cwisx5qqsEX-cCE-FIOg-fVR_qxKDC6n9HotXYuIfucF8KWGUl3a-346pIFtLtaVKDtNNazLIq1v5TOVSPZTRvG59i9kKK9j5f43DGwuO3R_Q.8ZT1ToTcXfhc5cwpj_kB1w)](http://browserstack.com/)
