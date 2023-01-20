import fs from 'fs/promises'
import glob from 'glob'
import esbuild from 'esbuild'
// https://github.com/flex-development/toggle-pkg-type#when-should-i-use-this
import toggleTypeModule from '@flex-development/toggle-pkg-type'

// Clear build directory since esbuild won't do it for us
await fs.rm('dist', { force: true, recursive: true })

let entryPoints = glob.sync('src/**/*.js', {
  ignore: ['src/**/*.stories.*', 'src/**/stories/*'],
})

// Build project

toggleTypeModule('off')

await esbuild.build({
  platform: 'browser',
  format: 'cjs',
  target: 'es2022',
  outdir: 'dist/cjs',
  loader: { '.js': 'jsx' },
  entryPoints,
})

await fs.writeFile('./dist/cjs/package.json', '{ "type": "commonjs" }')

toggleTypeModule('on')

await esbuild.build({
  platform: 'browser',
  format: 'esm',
  target: 'es2022',
  outdir: 'dist/esm',
  loader: { '.js': 'jsx' },
  entryPoints,
})

await fs.writeFile('./dist/esm/package.json', '{ "type": "module" }')
