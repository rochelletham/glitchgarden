const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devtool: 'source-map',
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/glitchgarden/'
    : '/',
    chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          isCustomElement: tag => tag.includes('HorizontalSlider') || tag.includes('vertical-slider') || tag.includes('vertical-slider-input') ||
                                  tag.includes('customButton')
        }
      }))
  }
})