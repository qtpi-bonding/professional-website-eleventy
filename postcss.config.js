module.exports = {
  plugins: [
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        minifySelectors: true,
        minifyParams: true,
        minifyFontValues: true,
        colormin: true,
        convertValues: true,
        reduceIdents: false, // Keep CSS custom properties intact
        zindex: false, // Don't optimize z-index values
        autoprefixer: false // We're not using autoprefixer
      }]
    })
  ]
};