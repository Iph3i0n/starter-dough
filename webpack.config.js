const Path = require("path");

module.exports = {
  entry: require("glob").sync("./src/components/*.tsx"),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.svg$/,
        loader: "svg-inline-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      Src: Path.resolve(__dirname, "src"),
    },
  },
  output: {
    filename: "bundle.js",
    path: Path.resolve(__dirname, "dist"),
  },
  mode: "development",
};
