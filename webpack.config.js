'use strict';

module.exports = {
    entry: './src/container.js',
    output: {
        path: './dist',
        filename: 'container.js',
        library: 'roastr-container',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /(node_modules)/,
            loader: require.resolve('babel-loader'),
            query: {
                presets: [
                    'babel-preset-es2015'
                ].map(require.resolve)
            }
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    }
};