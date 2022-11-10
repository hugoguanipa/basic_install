const currentTask = process.env.npm_lifecycle_event
const path = require("path")
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const fse = require('fs-extra')

let cssConfig = {
    test: /\.css$/i,
    use: [{ loader: 'css-loader', options: { importLoaders: 1 } },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [postcssPresetEnv({ stage: 4 })],
        },
      },
    }]
}

class RunAfterCompile {
    apply(compiler) {
        compiler.hooks.done.tap('Copy images', function(){
            fse.copySync('./app/assets/images', './docs/assets/images')
        })
    }
}

let pages = fse.readdirSync('./app').filter(function(file) {
    return file.endsWith('.html')
}).map(function(page) {
    return new HtmlWebpackPlugin({
        filename: page,
        template: `./app/${page}`
    })
})

let config = {
    entry: './app/assets/scripts/App.js',
    plugins: pages,
    module: {
        rules: [
            cssConfig
        ]
    }
}

if(currentTask == 'dev') {
    cssConfig.use.unshift('style-loader')
    config.output = {
        filename: 'bundled.js',
        path: path.resolve(__dirname, 'app')
    }
    config.devServer = {
        watchFiles: ('./app/**/*.html'),
        static: {
            directory: path.join(__dirname, 'app'),
        },
        compress: true,
        hot: true,
        port: 3000,
        host: '0.0.0.0'
    }
    config.mode = 'development'

} 

if(currentTask == 'build') {
    cssConfig.use.unshift(MiniCssExtractPlugin.loader)
    config.output = {
        filename: 'bundled/[name].js',
        path: path.resolve(__dirname, 'docs')
    }
    config.mode = 'production'
    config.optimization = {
        splitChunks: {chunks: 'all'}
    }
    config.plugins.push(
        new CleanWebpackPlugin(), 
        new MiniCssExtractPlugin({filename: 'styles.[chunkhash].css'}),
        new RunAfterCompile()
        )
} 

module.exports = config