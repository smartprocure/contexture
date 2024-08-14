import fs from 'node:fs/promises'
import glob from 'glob'
import * as esbuild from 'esbuild'
import minimist from 'minimist'
// https://github.com/flex-development/toggle-pkg-type#when-should-i-use-this
import toggleTypeModule from '@flex-development/toggle-pkg-type'

let args = minimist(process.argv.slice(2))

// Fix `loader` argument
if ('loader:' in args) {
  args.loader = Object.entries(args['loader:']).reduce(
    (acc, [k, v]) => ({ ...acc, [`.${k}`]: v }),
    {}
  )
}

delete args['_']
delete args['loader:']

// Clear build directory since esbuild won't do it for us
await fs.rm('dist', { force: true, recursive: true })

let entryPoints = glob.sync('src/**/*.{js,ts,tsx}', {
  ignore: ['src/**/*.{test,stories}.{js,ts,tsx}', 'src/**/{test,stories}/**/*'],
})

// Build project

toggleTypeModule('off')

let format = 'cjs'
let outdir = `dist/${format}`
await esbuild.build({ format, target: 'es2022', outdir, entryPoints, ...args })
await fs.writeFile(`./${outdir}/package.json`, '{ "type": "commonjs" }')

toggleTypeModule('on')

format = 'esm'
outdir = `dist/${format}`
await esbuild.build({ format, target: 'es2022', outdir, entryPoints, ...args })
await fs.writeFile('./dist/esm/package.json', '{ "type": "module" }')
