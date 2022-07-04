module.exports = {
  entry: require("glob").sync("./components/**/*.js"),
  output: {
    filename: "bundle.js",
    path: require("path").resolve(__dirname, "dist"),
  },
};
