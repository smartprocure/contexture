import * as esbuild from 'esbuild'

await esbuild.build({
  bundle: true,
  splitting: true,
  packages: 'external',
  platform: 'neutral',
  outdir: 'build',
  entryPoints: [
    { in: './src/types/bool/client.js', out: 'client/bool' },
    { in: './src/types/bool/provider-mongo.js', out: 'provider-mongo/bool' },
    { in: './src/types/exists/client.js', out: 'client/exists' },
    {
      in: './src/types/exists/provider-mongo.js',
      out: 'provider-mongo/exists',
    },
  ],
})
