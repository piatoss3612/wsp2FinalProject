module.exports = {
  pwa: {
    workboxPluginMode: "GenerateSW",
    // precache *.js, *,png, *.css, index.html, manifest.json
    workboxOptions: {
      include: [
        /\.js$/,
        /\.png$/,
        /\.css$/,
        /^index\.html$/,
        /^manifest\.json$/,
      ],
      exclude: [],
    },
  },
};
