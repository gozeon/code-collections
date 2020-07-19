const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
    entry: {
        assest: "./src/assest.js"
    },
    mode: "development", // production || development
    output: {
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    // 'style-loader', // development
                    {
                        loader: MiniCssExtractPlugin.loader, // production 
                        options: {
                            publicPath: 'dist'
                        }
                    },
                    // "file-loader", // production 
                    // "extract-loader", // production 
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [
                    // {
                    //     loader: 'file-loader',
                    //     options: {
                    //         publicPath: 'dist'
                    //     },
                    // },
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            publicPath: 'dist',
                        },
                    }
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'raw-loader'
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader',
                ]
            },
            {
                test: /\.(csv|tsv)$/,
                use: [
                    'csv-loader',
                ]
            },
            {
                test: /\.xml$/,
                use: [
                    'xml-loader',
                ]
            },

        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: 'chunk-[id].css',
        }),
        new OptimizeCssAssetsPlugin({
            canPrint: true,
            cssProcessor: require('cssnano'),
        }),
    ],

}