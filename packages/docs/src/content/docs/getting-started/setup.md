---
title: Setup
---

The whole Contexture Framework is available through NPM. It doesn't
have any extra dependency besides Node 9 and some NPM repositories. In
this quick guide, we'll achieve the following goals:

- [Install Node 9 and NPM](./setup.md#installing-node-9-and-npm)
- [Install Contexture](./setup.md#installing-contexture)
- [Install Contexture Client](./setup.md#installing-contexture-client)
- [Install Contexture ElasticSearch](./setup.md#installing-contexture-elasticsearch)
- [Install Contexture Mongo](./setup.md#installing-contexture-mongo)
- [Install Contexture React](./setup.md#installing-contexture-react)

**Note:** as you progress through our documentation, you'll discover
that in some cases, you will need only one or two of these
repositories. This page just provides the fastest way to start that we
couldcome up with.

## Installing Node 9 and NPM

NodeJS 9 and NPM can be installed through [the list of previous
releases of NodeJS](https://nodejs.org/en/download/releases/). You
might get it working with Node 10 (if so, let us know). We haven't
fully upgraded to Node 10 yet, so until then, we encourage you to at
least have a working version of Node 9 in hand.

An easy way to move from one version to another is with
[nvm](https://github.com/creationix/nvm). Here's a command you can run
to install nvm:

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

Please follow [nvm's README](https://github.com/creationix/nvm/blob/master/README.md) for more information.

## Installing Contexture

Once you have NodeJS and NPM installed, you'll need either a new
folder for your new project with Contexture, or to go to an existing
project, then run:

    npm install --save contexture

## Installing Contexture Client

To install the `contexture-client` you can run the following
command in your project's root folder:

    npm install --save contexture-client

## Installing Contexture ElasticSearch

To install the `contexture-elasticsearch` you can also run the
following command in your project's root folder:

    npm install --save contexture-elasticsearch

## Installing Contexture Mongo

To install the `contexture-mongo` you can also run the following
command in your project's root folder:

    npm install --save contexture-mongo

## Installing Contexture React

To install the `contexture-react` you can also run the following
command in your project's root folder:

    npm install --save contexture-react
