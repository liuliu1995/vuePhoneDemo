// 组件自动注册
import Vue from 'vue'
// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1)
// }
//找到components文件夹下以.vue命名的文件
const requireComponent = require.context('.', true, /\.vue$/)
requireComponent.keys().forEach(fileName => {
  const componetConfig = requireComponent(fileName)
  let [path, componetName, _vue] = fileName.split('/')
  // let a = fileName.lastIndexOf('/')
  // fileName = '.' + fileName.slice(a)
  // const componetName = capitalizeFirstLetter(
  //   fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  // )
  _vue = _vue.replace(/\.vue$/, '')
  if (_vue != 'index') {
    componetName = _vue
  }
  Vue.component(componetName, componetConfig.default || componetConfig)
})