module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '7.0.5',
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
    debug: 0
  },
  useSharedDBForAllJestWorkers: false
};
