## contexture-react

[![CircleCI](https://circleci.com/gh/smartprocure/contexture-react.svg?style=svg)](https://circleci.com/gh/smartprocure/contexture-react)
[![Greenkeeper badge](https://badges.greenkeeper.io/smartprocure/contexture-react.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/contexture-react.svg)](https://badge.fury.io/js/contexture-react)
![dependencies](https://david-dm.org/smartprocure/contexture-react.svg)

[![Storybook](https://img.shields.io/badge/BUILT_WITH-STORYBOOK-f1618c.svg?style=for-the-badge)](https://smartprocure.github.io/contexture-react)

React components for building contexture interfaces

# Documentation

* [Storybook](https://smartprocure.github.io/contexture-react)

The most complete example is the [`SearchRoot` multifield story](https://smartprocure.github.io/contexture-react/?selectedKind=SearchRoot&selectedStory=Multiple%20Filters)

Warning: we currently support a very alpha and unstable theming API that is bound to change without notice. Use it like:
```js
import { Provider } from 'mobx-react'
<Provider theme={ ... }>
    ...
</Provider>
```
Documentation around overridable components is coming later...

# Version History/Changelog

See our
[changelog](https://github.com/smartprocure/contexture-react/blob/master/CHANGELOG.md)

# Installing

`npm i contexture-react`

# Notes on this repository

This project was scaffolded generally following this link:
https://medium.com/@efreyreg/create-react-component-libraries-with-storybook-and-styled-jsx-8999f423f06b

In general, the two directories of interset are `/src` which contains the
component source, and `/stories` which contain the storybook stories (which also
function as snapshot tests)

# Cross Browser Testing

Cross browser testing is done using BrowserStack thanks to their awesome support for open source projects!

[![BrowserStack](https://p14.zdusercontent.com/attachment/1015988/jKFhzb4Aj7J0lTB0zLpzYpFzs?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..kRqEzKpnuMPlCW73WjIR2g.721XUudT3iSydu0vWxcM3LWbPRpr3SYQwZBkzIPmL4ffyYG2Sqa99fKq8dREp6vRd5EUeW8Yfzp3Vyx79eFYT5jpXWNv8EeeqmmaPb-Eg9YzJSdxhfmBnOc553RWhFjo6pz8UqqU7BlVo2IVnOY6Tkt82TqscBvCJQAp0KG5kgIzcHr5Q5v6CNobhIT0I2cwisx5qqsEX-cCE-FIOg-fVR_qxKDC6n9HotXYuIfucF8KWGUl3a-346pIFtLtaVKDtNNazLIq1v5TOVSPZTRvG59i9kKK9j5f43DGwuO3R_Q.8ZT1ToTcXfhc5cwpj_kB1w)](http://browserstack.com/)
