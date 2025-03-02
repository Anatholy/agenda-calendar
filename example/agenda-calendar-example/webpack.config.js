const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['agenda-calendar']
    }
  }, argv);

  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      'react-native-web': path.resolve(__dirname, 'node_modules/react-native-web'),
      'agenda-calendar': path.resolve(__dirname, '../../src'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
      'react': path.resolve(__dirname, 'node_modules/react'),
    },
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', ...config.resolve.extensions],
  };

  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    include: [
      path.resolve('../../src'),
    ],
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['babel-preset-expo'],
      },
    },
  });

  return config;
}; 