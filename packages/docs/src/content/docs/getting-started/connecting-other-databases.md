---
title: Connecting to Other Databases
---

Contexture depends on it's providers to be able to know how to
translate from the Contexture DSL to the specific DSL that each
database needs. Because of this, to connect to other databases you
will need to create a new Provider.

If you want to build your own provider, please follow this detailed
guide: [Building Your Own
Provider](../under-the-hood/contexture-providers/building-your-own-provider.md).
Beware that it might get into the core of contexture, which is not
needed if you can take advantage of the existing providers.
