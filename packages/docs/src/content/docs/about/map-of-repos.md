---
title: Map of Repositories
---

# Map of Repos

The Contexture framework comes to life through a list of repositories that individually specialize in some needed layer for our architecture. We will be using most (if not all) of these projects in our upcoming pages. Let's explore the repos we have so far:

## Contexture Core

[contexture](https://github.com/smartprocure/contexture/tree/main/packages/server) is where our main DSL processor lives. It is a very small layer that ties everything together. This one receives the information about the different search representations, about the databases involved, and the DSL, then outputs the search results respective to each one of the queries described in a copy of the received DSL.

You can read more about the core [in the repository](https://github.com/smartprocure/contexture/tree/main/packages/server) or with greater detail in our [under the hood docs (Contexture Core section)](../under-the-hood/contexture-core.md).

## Contexture Providers

The Contexture Providers are the interfacing layer that ties the Contexture DSL to the targeted databases. So far, we have only two open source providers:

- [contexture-elasticsearch](https://github.com/smartprocure/contexture/tree/main/packages/provider-elasticsearch)
- [contexture-mongo](https://github.com/smartprocure/contexture/tree/main/packages/provider-mongo)

If you are planning to use either ElasticSearch or MongoDB for your project, the best way to get started is to use those repositories. However, if you need to use Contexture with another database, you will need to implement the provider yourself. We're looking for code contributors, so please don't feel limited to the current available tools. Help us grow together!

You can read more about Contexture Providers with greater detail in our [under the hood docs (Contexture Providers section)](../under-the-hood/building-your-own-provider.md).

## Contexture Client

The Contexture Client is responsible for triggering behaviors on the search interfaces by knowing what causes changes in one or more elements of the search tree. It is the key piece of technology that allows our search interfaces to work in real time.

You can read more about the Contexture Client [in its repository](https://github.com/smartprocure/contexture/tree/main/packages/client) or in our [docs about querying (Contexture Client section)](../querying/interactive-queries/contexture-client.md).

## Contexture React

The Contexture React repository holds a list of components that facilitate building search interfaces. They are mainly graphical representations of the types that exist on our Contexture Providers.

You can read more about Contexture React [in the repository](https://github.com/smartprocure/contexture-client) or in our guide for the [Available React Components for Types](./types/react-components.md).
