//

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";


let config = {
  entry: ["babel-polyfill", "./source/index-client.ts", "./resource/style.scss"],
  output: {
    path: path.join(__dirname, "dist"),
    publicPath: process.env["NODE_ENV"] === "production" ? "/FontGeneratorTypescript" : "/",
    filename: "./bundle.js"
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader"
        }
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.js$/,
        enforce: "pre",
        loader: "source-map-loader"
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader"
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  ignoreWarnings: [
    /Failed to parse source map/
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".css"]
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist")
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./resource/client.html",
      title: "Font Preview"
    }),
    new MiniCssExtractPlugin({

    })
  ]
};

export default config;