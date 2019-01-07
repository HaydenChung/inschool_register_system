const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = env => ({
    entry: ['babel-polyfill', 'whatwg-fetch', './inschool_register/src/index.js'],
    output: {
        path: path.resolve(__dirname, 'inschool_register/dist'),
        publicPath: (typeof env != 'undefined' && env.php_development) ? 'http://localhost:8080/inschool_register/assets' : path.resolve(__dirname, 'inschool_register/assets'),
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
})