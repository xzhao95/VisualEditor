const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base')
const theme = require('./package.json').theme

const clientConfig = {
    mode: 'development',
    entry: './src/client/index.tsx',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    { loader: 'style-loader' },
                    { loader: 'css-loader' },
                    { loader: 'postcss-loader' },
                    {
                        loader: 'less-loader',
                        options: {
                            modifyVars: theme,
                            javascriptEnabled: true
                        }
                    },
    
                ]
            },
        ]
    }
}

module.exports = merge(baseConfig, clientConfig);