module.exports = {
  pwa: {
    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      include: [/\.js$/, /\.png$/, /\.css$/, /^index\.html$/, /^manifest\.json$/],
      exclude: [],
    },
  },
};
