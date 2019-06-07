module.exports = function (api) {
  api.cache(true);
  return {
    babelrcRoots: [
      '.'
    ],
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-transform-runtime',
      '@babel/plugin-syntax-dynamic-import'
    ],
    env: {
      test: {
        plugins: [
          'istanbul'
        ]
      }
    }
  }
}
