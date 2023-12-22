---
title: Simple Search Box
---

Building a simple search box consists of a single input field tied to
any of the fields that any record might have in the specified database
or index. To be able to make this text input tied to the search
structure, we will need to bring `contexture-client` in. With that in
mind, and the knowledge we already have of contexture, we can define
the following tasks:

1. Create a New Contexture Search Function.
2. Create a Web Server With a Search Endpoint
3. Write a Search Tree.
4. Make the Search Tree Aware of Contexture.
5. Write a Text Input.

Let's dive in.

### 1. Creating a New Conteture Search Function

Just as how we saw in the previous pages, creating a new Contexture
search function is about setting up the `contexture` package's default
export with `schemas` and `providers`. In this case, we'll use the
contexture-mongo approach in the following file (let's call it
`search.js`):

```javascript
let Contexture = require('contexture')
let provider = require('contexture-mongo')
let types = require('contexture-mongo/types')
let MongoClient = require('mongodb').MongoClient

let schemas = {
  collectionNameSchema: {
    mongo: {
      collection: 'collectionName',
    },
  },
}

module.exports = {}

MongoClient.connect('mongodb://localhost:27017', function (err, client) {
  module.exports.search = Contexture({
    schemas,
    providers: {
      mongo: provider({
        getClient: () => client,
        types: types(),
      }),
    },
  })
})
```

Note that we're now exporting the search function with
`module.exports.search = Contexture(...`. You can also note that we
specified the schema's name to be `collectionNameSchema`, and that any
search using this schema will be using MongoDb's `collectionName`
collection.

### 2. Create a Web Server With a Search Endpoint

If we want to separate the direct access to the database from the
client, the previous code should live in the server. Our next step is
to expose a `/search` endpoint so our future client can reach this
function. In this section, we'll write a simple web server with
`express` to satisfy our needs.

#### 2.1. Installing the Dependencies

You'll need to install `express` and `body-parser` at the root of your
project, as follows:

    npm install --save express body-parser

#### 2.2. Writing the Web Server

Once you have the dependencies installed, you can set up the server
with the following code:

```javascript
let express = require('express')
let bodyParser = require('body-parser')
let search = require('./search')
let app = express()

// create application/json parser
lete jsonParser = bodyParser.json()

app.post('/search', jsonParser, (req, res) => {
  if (!req.body || !req.body.search) return res.sendStatus(400)
  search(req.body.search).then((err, result) => {
    if (err) return res.send(401, err)
    res.send(200, result)
  })
})

app.listen(3000)
```

You can read more about these topics in the following links:

- [Express Documentation](https://expressjs.com/en/api.html).
- [body-parser repository](https://github.com/expressjs/body-parser).

### 3. Writing a Search Tree

Having the DSL processor available through a web server endpoint, we
can follow up with the structure of the search interface itself. We'll
conceptualize this by writing the Contexture DSL itself.

Let's use the same `sarchTree` that we used in [our frist
script](first-script.md):

```javascript
let searchTree = {
  key: 'root',
  type: 'group',
  schema: 'collectionNameSchema',
  children: [
    {
      key: 'namequery',
      type: 'text',
      field: 'name',
      operator: 'containsWord',
      value: 'text we want to match on the field name',
    },
    {
      key: 'results',
      type: 'results',
    },
  ],
}
```

Keep in mind that we'll be using `collectionNameSchema` since we
already defined a schema with that name on the server's `search.js`
file.

You can read more about writing Contexture DSL queries in our
[Querying](../querying/README.md) documentation.

### 4. Make the Search Tree Aware of Contexture

Having a search tree, we will need `contexture-client` to make it
smart enough for the user interface. Let's make sure we have it
available in our project with:

    npm install --save contexture-client

We will also use MobX to make it easier to notify our component that
the state has changed. For that purpose, we will need to install
`mobx` using NPM:

    npm install --save mobx

Since we're heavy users of MobX, `contexture-client` already
provides an adapter that we can use out of the box. Knowing this,
let's prepare our `contexture-client` to work well with
`mobx`, as follows:

```javascript
let ContextureClient = require('contexture-client')
let ContextureMobx = require('contexture-react/dist/utils/contexture-mobx')

let types = ContextureClient.exampleTypes
let service = async (search) => ({
  data: await postData('/sarch', { search }),
})

let Contexture = ContextureMobx({
  types,
  service,
})
```

Note that our service function will be the one responsible for sending
the `searchTree` we previously defined to the DSL processor, we can
wrap the search tree into a smart object that will later react to both
the user input, and the search results.

```javascript
let contextureSearchTree = Contexture(searchTree)
```

You can read more about these topics here:

- [MobX](https://mobx.js.org/).
- [MobX Observers](https://mobx.js.org/refguide/observer-component.html).
- [Managing the Contexture Search Tree State with MobX](../managing-state/mobx.md).
- [Managing the Contexture Search Tree State with MobX](../managing-state/mobx.md).
- [Introduction to the Contexture Client for Easy Querying](../querying/interactive-queries/contexture-client.md).
- [Introduction to the Contexture Client for Easy Querying](../querying/interactive-queries/contexture-client.md).
- [Contexture Client in Detail](../under-the-hood/contexture-client.md).

### 5. Writing a Text Input

Having the search tree ready allows us to write a `mobx` observer
component that will receive the tree and react to the result changes
immediately. Here's an example:

```
let { observer } = require('mobx')
let SearchQuery = observer(({ tree }) =>
  <input
    value={tree.getNode(['root', 'namequery']).value}
    onChange={e => {
      tree.getNode(['root', 'namequery']).value = e.target.value
    }}
  />

let SearchResults = observer(({ tree }) => (
  <div>
    {JSON.stringify(tree.getNode(['root', 'results']).context.response.results)}
  </div>
))
```

Which we would render this way:

```javascript
<SearchQuery tree={contextureSearchTree} />
<SearchResults tree={contextureSearchTree} />
```

This will generate a text input that will trigger a new search every
time the contents of the input change. This new search will get the
results and show the results in a JSON form (because of the
`JSON.stringify` part). Ideally, you will not render them in a JSON
form, but render them using a list component or table.

More information here:

- [Interactive Queries](../interactive-queries/README.md).
- [Available React Components for our Available Types](../types/react-components.md).
- [Managing State](../managing-state/README.md).
- [Recommendations](../recommendations/README.md).
