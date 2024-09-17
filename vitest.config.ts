import { defineProject } from 'vitest/config'

// 1. TODO: separate into projects/workspaces
// For example, this global setup is only for mongo
// 2. TODO: remove all jest related stuff
// 3. TODO
// stderr | packages/client/src/index.test.js
// The MobX package does not have a default export. Use 'import { thing } from "mobx"' (recommended) or 'import * as mobx from "mobx"' instead."

// stderr | packages/client/src/_mobx.test.js
// The MobX package does not have a default export. Use 'import { thing } from "mobx"' (recommended) or 'import * as mobx from "mobx"' instead."

// stderr | packages/client/src/listeners.test.js
// The MobX package does not have a default export. Use 'import { thing } from "mobx"' (recommended) or 'import * as mobx from "mobx"' instead."

// stderr | packages/client/src/node.test.js
// The MobX package does not have a default export. Use 'import { thing } from "mobx"' (recommended) or 'import * as mobx from "mobx"' instead."
// 4. TODO
//   Snapshots  4 obsolete
//              ↳ packages/export/src/nodes/pivot.test.js
//                · pivot retrieves records 1
//              ↳ packages/export/src/nodes/results.test.js
//                · results  with contexts not wrapped in `response` retrieves records 1
//                · results  with contexts wrapped in `response` retrieves records 1
//              ↳ packages/export/src/nodes/terms_stats.test.js
//                · terms_stats retrieves records 1

export default defineProject({
  test: {
    globalSetup: './packages/provider-mongo/jest/globalSetup.js',
  },
})
