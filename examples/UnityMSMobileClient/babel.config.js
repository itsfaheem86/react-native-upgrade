module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      '@babel/plugin-transform-react-jsx',
      {
        runtime: 'automatic',
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          '@constants': './src/constants',
          '@redux': './src/redux',
          '@assets': './src/assets',
          '@config': './src/config',
          '@theme': './src/theme',
          '@graphql': './src/graphql',
          '@guards': './src/guards',
          '@langs': './src/langs',
          '@providers': './src/providers',
          '@typography': './src/typography',
          '@ui': './src/ui',
          '@utils': './src/utils',
        },
      },
    ],
    'react-native-paper/babel',
    'react-native-worklets/plugin',
  ],
};
