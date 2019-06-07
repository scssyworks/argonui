const precss = require('precss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    precss,
    autoprefixer({
      browsers: ['>0.5%', 'last 2 versions', 'not ie <= 10']
    })
  ]
}
