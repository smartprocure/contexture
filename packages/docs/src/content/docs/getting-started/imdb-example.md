---
title: First Script
---

In our Contexture React repository, we've created a Storybook live
example that uses Contexture (with no server whatsoever, everything in
the client) to query and discover a public ElasticSearch index with
data similar to the data that IMDB might contain.

- [Contexture React Repository](https://github.com/smartprocure/contexture-react).
- More information about [Storybook](https://github.com/storybooks/storybook).
- [The IMDB Live Index Explorer with Contexture](https://smartprocure.github.io/contexture-react/?selectedKind=Index%20Explorer&selectedStory=Advanced%20Search).
- [The IMDB Live Index Explorer Source Code](https://smartprocure.github.io/contexture-react/?selectedKind=Index%20Explorer&selectedStory=Advanced%20Search).

Let's see how we can use this tool.

### Picking a Field

The tool initially shows you a button named `Pick a Field`:

![](https://i.imgur.com/CWz4Moy.png)

This button will allow you to select any field on which you might want
to run a search. If you click it, you'll see the following fields:

![](https://i.imgur.com/RR6vMP1.png)

If we pick `Actors`, for example, the search will trigger and results
will appear:

![](https://i.imgur.com/kep1LIo.png)

Now, let's click on `Select Type` and click on `Facet`. A moment
afterwards, we will get a list of checkboxes with the most common
actors among the results:

![](https://i.imgur.com/2Gq5FEh.png)

We can see that the actor that has made the most movies (among the
ones idexed) is Naveen Andrews. We can also see the number of movies
this and other actors have made, and the total actors in the database
(of which we can only see 10 in this screenshot). Under this list of
actors, you'll see a text saying `View More`. If you click it, the
next 10 actors will appear (in order).

At the bottom of the page, you'll see a button labeled `Add Filter`.
Clicking it will add another interactive component to the website,
which will say `Click to add AND`.

![](https://i.imgur.com/sRHN04n.png)

Clicking the `Click to add AND` button will show us again a `Pick a
Field` button:

![](https://i.imgur.com/oA4LOEK.png)

So we can start again. Let's say we pick the `Genre` field, and we
click for the `Facet` type again. A bit later, the list of ordered
genres will appear:

![](https://i.imgur.com/nfbVlQ2.png)

And that's it! We're discovering the database with a very simple and
unpolished interface. By this point you might be curious on what
components we're using to do all this magic. There's really no trick,
just follow us through the tutorial. You can also skip some steps if
you're particularly interested in:

- [Contexture React Repository](https://github.com/smartprocure/contexture-react).
- [Available React Components for Types](../types/react-components.md).

[↪ Next: Querying](../querying/README.md)
