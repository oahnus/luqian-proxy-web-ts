module.exports = {
  // ... your other options
  transpileDependencies: [
    'vuex-module-decorators'
  ],
  devServer: {
    port: 7483,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:12303", //设置调用的接口域名和端口
        changeOrigin: true, //是否跨域
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'O-Porxy';
        args[0].meta = {
          viewport: 'width=device-width,initial-scale=1,user-scalable=no',
          keywords: 'proxy,代理,内网,内网穿透',
          description: '内网代理'
        };
        return args;
      })
  },
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {},
    // 启用 CSS modules for all css / pre-processor files.
    modules: false
  },
}
