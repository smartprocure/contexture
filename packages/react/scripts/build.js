import fs from 'fs/promises'
import glob from 'glob'
import esbuild from 'esbuild'

// Clear build directory since esbuild won't do it for us
await fs.rm('dist', { force: true, recursive: true })

let entryPoints = glob.sync('src/**/*.js', {
  ignore: ['src/**/*.stories.*', 'src/**/stories/*'],
})

await esbuild.build({
  platform: 'browser',
  format: 'esm',
  target: 'es2022',
  outdir: 'dist/esm',
  loader: { '.js': 'jsx' },
  entryPoints,
})

await fs.writeFile('./dist/esm/package.json', '{ "type": "module" }')
