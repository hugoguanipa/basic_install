const postcssMixins = require("postcss-mixins");

module.exports = {
    plugins: [
        'postcss-simple-vars',
        'postcss-nested',
        'autoprefixer',
        'postcss-import',
        'cssnano',
        'postcss-mixins',
        'postcss-calc',
        'postcss-hexrgba'
    ],
  };