module.exports = {
    outputDir: 'vueThree',  //build输出目录  默认不需要配置
    publicPath: './',
    devServer: {
        open: true, //是否自动弹出浏览器页面
        // host: "localhost",
        port: '8080',
        https: false,  //是否使用https协议
        hotOnly: false, //是否开启热更新
        proxy: {
            'api': {
                target: 'https://api.weixin.qq.com/cgi-bin',
                ws: true,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}