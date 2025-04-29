const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    os: require.resolve('os-browserify/browser'),
    crypto: require.resolve('crypto-browserify'),
    path: require.resolve('path-browserify'),
    stream: require.resolve('stream-browserify'),
    fs: false, 
  };
  return config;
};
