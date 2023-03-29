---
'contexture-client': patch
---

Sync computed group fields (markedForUpdate, updating) in cases where runUpdate doesn't run on the whole tree (self-updating events with disableAutoUpdate). This fixes the bug introduced with the recent contexture-react change to drive search buttons from root `markedForUpdate` which caused search buttons to stay active indefinitely when dispatching self-updating changes (like results pageSize and paused mutations)
