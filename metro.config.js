const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    blacklistRE: exclusionList([
      /server\/.*/, // Exclude backend server files
      // /node_modules\/.*/, // Prevent unnecessary node modules from being bundled
    ]),
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
