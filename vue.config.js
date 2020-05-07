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
  }
}
