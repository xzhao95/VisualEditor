module.exports = {
    module: {
        rules: [{
            test: /\.js?$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            options: {
                presets: ["@babel/preset-env", "@babel/preset-react"]
            }
        }, {
            test: /\.tsx?$/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                },
                {
                    loader: 'ts-loader',
                    options: {
                        compilerOptions: {
                          noEmit: false,
                        },
                      },
                }
            ],
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
}