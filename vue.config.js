module.exports = {
  lintOnSave: false,
  productionSourceMap: false,
  transpileDependencies: ["vuetify"],
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Graba tu voz';
        return args;
      })
  },
  pwa: {
    name: 'Graba tu voz',
    themeColor: '#FFFFFF',
    msTileColor: '#FFFFFF',
    manifestOptions: {
      background_color: '#FFFFFF'
    }
  }
};