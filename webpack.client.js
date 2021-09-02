const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/client/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public'),
    },
    module: {
        rule: [{
            test: /\.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                presets: ["@babel/preset-env", "@babel/preset-react"]
            }
        }]
    }

}