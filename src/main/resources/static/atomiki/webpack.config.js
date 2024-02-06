const path = require('path');

module.exports = {
    entry: {
        atomiki: './src/index.tsx'
    },
    output: {
        path: path.resolve(__dirname, './static/js'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: "webpack-preprocessor-loader",
                        options: {
                            debug: false,
                            directives: {},
                            params: {
                                ENV: process.env.NODE_ENV,
                            },
                            verbose: false,
                        }
                    }
                ],
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
    },
    devtool: "inline-source-map",
    mode: "development"
    //devtool: false,
    //mode: "production"
};
