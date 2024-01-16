import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: 'Docs',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        alt: 'Contexture',
        replacesTitle: true,
      },
      social: {
        github: 'https://github.com/smartprocure/contexture',
      },
    }),
  ],
})
