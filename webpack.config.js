const Path = require("path");

const is_dev = process.env.NODE_ENV !== "production";

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "css-loader",
            options: {
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
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
    publicPath: "dist/",
  },
  mode: is_dev ? "development" : "production",
  watch: is_dev,
};
