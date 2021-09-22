const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const theme = require('./package.json').theme

const serverConfig = {
    target: 'node',
    mode: 'development',
    entry: './src/server/app.tsx',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/server')
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    { loader: 'isomorphic-style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: theme,
                            // javascriptEnabled: true
                        }
                    },
                ]
            },
        ]
    }
}

module.exports = merge(baseConfig, serverConfig);