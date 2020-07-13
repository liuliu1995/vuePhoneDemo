const ThreeExamples = require('import-three-examples')

module.exports = {
    outputDir: 'test',  //build输出目录  默认不需要配置
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
    },
    chainWebpack: config => {
        ThreeExamples.forEach((v) => {
            if (~v.use.indexOf('imports')) {
                config.module
                    .rule(`${v.test}_i`)
                    .test(require.resolve(v.test))
                    .use(v.use)
                    .loader(v.use)
            } else {
                config.module
                    .rule(`${v.test}_e`)
                    .test(require.resolve(v.test))
                    .use(v.use)
                    .loader(v.use)
            }
        })
    }
}