const path = require('path'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');

module.exports = {
    devtool: 'inline-source-map',
    target: 'web',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                options: {
                    presets: ['stage-0', 'es2015', 'react'],
                    plugins: [["import", {"libraryName": "antd"}]]
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { sourceMap: true }
                        }, 
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: function() {
                                    return [ require('autoprefixer') ];
                                },
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: { sourceMap: true }
                        }
                    ]
                })
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'postcss-loader',
                        options: {
                            plugins: function() {
                                return [ require('autoprefixer') ];
                            },
                            sourceMap: false
                        }
                    }]
                })
            },
            {
                test: /\.woff(2)?(\?[a-z0-9#=&.]+)?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg|png|jpg|ico)(\?[a-z0-9#=&.]+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles.css'),
        new HtmlWebpackPlugin({
            title: 'Amazon Lofts', 
            template: 'src/index.html'
        }),
        new UglifyJsPlugin({
            beautify: true,
            mangle: { screw_ie8: true, warnings: false },
            compress: { screw_ie8: true, warnings: false },
            comments: true,
            sourceMap: true
        })
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './src'),
        hot: true,
        port: 3000,
        historyApiFallback: true
    }
};