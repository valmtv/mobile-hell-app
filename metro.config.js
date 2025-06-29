const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Add react-dom → react-native alias
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    'react-dom': path.resolve(__dirname, 'node_modules/react-native')
  }
};

module.exports = withNativeWind(config, { input: './global.css' });