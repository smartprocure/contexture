import { dirname, join } from "path";
export default {
  addons: [getAbsolutePath("@storybook/addon-links"), getAbsolutePath("@storybook/addon-essentials")],
  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },
  docs: {
    autodocs: 'tag',
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
      directory: '../src/stories/imdb',
      titlePrefix: 'Live Demos/IMDB',
    },
    {
      directory: '../src/stories/explorer',
      titlePrefix: 'Live Demos/Index Explorer',
    },
  ],
}

function getAbsolutePath(value) {
  return dirname(require.resolve(join(value, "package.json")));
}
