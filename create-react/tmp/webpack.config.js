const path = require('path');

const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const InlineManifestPlugin = require('inline-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const { TsConfigPathsPlugin } = require('awesome-typescript-loader');

const ROOT_PATH = path.resolve(__dirname);
const SRC_PATH = path.resolve(__dirname, 'src');
const DIST_PATH = path.resolve(__dirname, 'dist');
const NM_PATH = path.resolve(__dirname, 'node_modules');

let WebpackConfig = {};
// dev, build:dev, build
const target = process.env.npm_lifecycle_event;

// -------------------- Common Config --------------------
const Rule_PostcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: () => [
      require('autoprefixer'),
      require('cssnano')
    ]
  }
};

const ImageDirectories = [
  path.resolve(SRC_PATH, 'components'),
  path.resolve(SRC_PATH, 'assets/images')
];

// -------------------- Base Config --------------------
const BaseConfig = {
  entry: {
    vendor: ['tslib', 'es6-promise', 'axios', 'react', 'react-dom', 'react-router-dom', 'react-loadable', 'insert-css']
  },
  output: {
    path: DIST_PATH
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    modules: [SRC_PATH, NM_PATH],
    unsafeCache: /node_modules/,
    alias: {
      'tslib': path.resolve(NM_PATH, 'tslib/tslib.es6.js'),
      'react-loadable': path.resolve(NM_PATH, 'react-loadable/lib/index.js'),
      'insert-css': path.resolve(NM_PATH, 'insert-css/index.js')
    },
    plugins: [ new TsConfigPathsPlugin() ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'string-replace-loader',
            options: {
              search: '_import',
              replace: 'import',
              flags: 'g'
            }
          },
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: 'src/tsconfig.json' }
          }
        ]
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve(SRC_PATH, 'components'),
        use: [
          { loader: 'raw-loader' },
          Rule_PostcssLoader
        ]
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(NM_PATH, 'mdbootstrap/css'),
          path.resolve(SRC_PATH, 'assets/styles')
        ],
        // loaders: ['style-loader', 'css-loader']
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: { importLoaders: 1 }
            },
            Rule_PostcssLoader
          ]
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        include: path.resolve(NM_PATH, 'mdbootstrap/img'),
        loader: 'url-loader',
      },
      {
        test: /\.(eot|ttf|woff2?)$/,
        loader: 'file-loader',
        options: { name: 'font/roboto/[name].[ext]' }
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor', 'manifest']
    })
  ],
  watchOptions: { ignored: /node_modules/ }
};

// -------------------- Develop Config --------------------
// -d --debug --devtool=eval-cheap-module-source-map --output-pathinfo
const DevelopmentConfig = {
  entry: {
    main: [
      'react-hot-loader/patch',
      path.resolve(SRC_PATH, 'main-hot.tsx')
    ]
  },
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].js',
    publicPath: 'http://localhost:8080/'
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        include: ImageDirectories,
        loader: 'file-loader',
        options: { name: 'images/[name].[ext]' }
      }
    ]
  },
  devServer: {
    contentBase: DIST_PATH,
    compress: true,
    historyApiFallback: true,
    hot: true,
    proxy: {
      '/v1': 'http://139.219.190.149:3001'
    }
  },
  resolve: {
    alias: {
      'bootstrap.css': path.resolve(NM_PATH, 'mdbootstrap/css/bootstrap.css'),
      'mdb.css': path.resolve(NM_PATH, 'mdbootstrap/css/mdb.css'),
      'es6-promise': path.resolve(NM_PATH, 'es6-promise/dist/es6-promise.js'),
      'axios': path.resolve(NM_PATH, 'axios/dist/axios.js'),
      'react': path.resolve(NM_PATH, 'react/dist/react.js'),
      'react-dom': path.resolve(NM_PATH, 'react-dom/dist/react-dom.js'),
      'history': path.resolve(NM_PATH, 'history/umd/history.js'),
      'react-router': path.resolve(NM_PATH, 'react-router/umd/react-router.js'),
      'react-router-dom': path.resolve(NM_PATH, 'react-router-dom/umd/react-router-dom.js')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new ExtractTextPlugin('css/base.css'),
    new HtmlPlugin({ template: path.resolve(SRC_PATH, 'index.html') })
  ]
};

// -------------------- Production Config --------------------
// -p --optimize-minimize --define process.env.NODE_ENV="production"
const ProductionConfig = {
  devtool: 'source-map',
  entry: { main: path.resolve(SRC_PATH, 'main.tsx') },
  output: {
    hashDigestLength: 8,
    filename: 'js/[name]_[chunkhash].js',
    chunkFilename: 'js/[name]_[chunkhash].js',
    publicPath: '/' // default
  },
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        include: ImageDirectories,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'images/[name].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { quality: 80 },
              optipng: { optimizationLevel: 4 },
              pngquant: { quality: "65-90", speed: 4 },
              gifsicle: { optimizationLevel: 2 }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: {
      // use min.css|js for small size
      'bootstrap.css': path.resolve(NM_PATH, 'mdbootstrap/css/bootstrap.min.css'),
      'mdb.css': path.resolve(NM_PATH, 'mdbootstrap/css/mdb.min.css'),
      'es6-promise': path.resolve(NM_PATH, 'es6-promise/dist/es6-promise.min.js'),
      'axios': path.resolve(NM_PATH, 'axios/dist/axios.min.js'),
      'react': path.resolve(NM_PATH, 'react/dist/react.min.js'),
      'react-dom': path.resolve(NM_PATH, 'react-dom/dist/react-dom.min.js'),
      // use es modules for tree shaking
      'history': path.resolve(NM_PATH, 'history/es'),
      'react-router': path.resolve(NM_PATH, 'react-router/es'),
      'react-router-dom': path.resolve(NM_PATH, 'react-router-dom/es')
    }
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new WebpackChunkHash(),
    new ExtractTextPlugin('css/base_[contenthash:8].css'),
    new HtmlPlugin({
      template: path.resolve(SRC_PATH, 'index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new InlineManifestPlugin()
  ]
}

if (target === 'dev') {
  BaseConfig.module.rules[0].use.unshift('react-hot-loader/webpack');
  WebpackConfig = merge(BaseConfig, DevelopmentConfig);
}

if (target === 'build' || target === 'build:dev') {
  WebpackConfig = merge(BaseConfig, ProductionConfig);
}

module.exports = WebpackConfig;
