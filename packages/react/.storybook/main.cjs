/* eslint-env node */

module.exports = {
  addons: [
    '@storybook/addon-essentials',
    {
      name: '@storybook/addon-docs',
      options: {
        transcludeMarkdown: true,
      },
    },
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  stories: [
    {
      directory: '../src',
      files: '*.stories.@(js|mdx)',
      titlePrefix: 'Search Components',
    },
    {
      directory: '../src/themes',
      titlePrefix: 'Theming',
    },
    {
      directory: '../src/queryWizard',
      titlePrefix: 'Search Components',
    },
    {
      directory: '../src/purgatory',
      titlePrefix: 'Search Components/Internals',
    },
    {
      directory: '../src/queryBuilder',
      titlePrefix: 'Search Components/Query Builder',
    },
    {
      directory: '../src/greyVest',
      titlePrefix: 'GreyVest Library',
    },
    {
      directory: '../src/exampleTypes',
      titlePrefix: 'Example Types',
    },
    {
      directory: '../src/stories/docs',
      titlePrefix: 'Docs',
    },
    {
      directory: '../src/stories/imdb',
      titlePrefix: 'Live Demos/IMDB',
    },
    {
      directory: '../src/stories/explorer',
      titlePrefix: 'Live Demos/Index Explorer',
    },
  ],
}
