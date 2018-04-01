const path = require('path');

const hoistedLibs = ['react', 'react-native'];

module.exports = {
  extraNodeModules: hoistedLibs.reduce((res, lib) => ({
    ...res,
    [lib]: path.resolve(__dirname, 'node_modules', lib),
  }), {}),
  getProjectRoots() {
    return [
      process.env.FOUNDATION_PROJECT,
      // path.resolve(__dirname, '..', 'demo'),
      path.resolve(__dirname),
    ];
  },
};
