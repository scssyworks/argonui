module.exports = {
  linting: {
    command: 'npm run eslint && npm run sasslinter'
  },
  lintingDev: {
    command: 'npm run eslintDev && npm run sasslinterDev'
  },
  karmaTests: {
    command: 'npm run test'
  },
  karmaTestsProd: {
    command: 'npm run test -- --mode=production'
  },
  webpackProd: {
    command: 'npm run prod'
  },
  webpackDev: {
    command: 'npm run dev'
  },
  removeChunkHash: {
    command: 'npm run removeHash'
  }
}
