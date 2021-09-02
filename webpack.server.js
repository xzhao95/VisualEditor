const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')

const serverConfig = {
    target: 'node',
    mode: 'development',
    entry: './src/server/app.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build')
    },
}

module.exports = merge(baseConfig, serverConfig);