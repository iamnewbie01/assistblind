module.exports = api => {
  api.cache(true);

  const isServer = process.env.BABEL_ENV === 'node'; // For backend detection

  return {
    presets: isServer
      ? [
          ['@babel/preset-env', {targets: {node: 'current'}}], // Node.js backend
          '@babel/preset-typescript',
        ]
      : [
          'module:@react-native/babel-preset', // React Native frontend
          '@babel/preset-typescript',
        ],
    // plugins: [
    //   '@babel/plugin-proposal-class-properties',
    //   '@babel/plugin-proposal-export-default-from',
    // ],
  };
};
