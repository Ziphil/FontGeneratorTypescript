//

import HtmlWebpackPlugin from "html-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import path from "path";


let config = {
  entry: ["babel-polyfill", "./source/index-client.ts", "./resource/style.css"],
  output: {
    path: path.join(__dirname, "dist", "client"),
    publicPath: "/",
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
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", ".css"]
  },
  devServer: {
    port: 3003,
    contentBase: path.join(__dirname, "dist", "client")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./resource/client.html",
      title: "Font Preview"
    }),
    new MiniCssExtractPlugin()
  ]
};

export default config;