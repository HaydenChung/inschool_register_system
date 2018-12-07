const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', 'whatwg-fetch', './inschool_register/src/index.js'],
    output: {
        path: path.resolve(__dirname, 'inschool_register/dist'),
        publicPath: './inschool_register/assets',
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    devServer: {
        historyApiFallback: {
            index: '/index.php'
        }
    },
    // plugins: [
    //     new CompressionPlugin({
    //         asset: '[path].gz[query]',
    //         algorithm: 'gzip',
    //         test: /\.(js|css|ttf|svg|eot)$/,
    //         threshold: 10240,
    //         minRatio: 0.8,
    //     })
    // ]
}