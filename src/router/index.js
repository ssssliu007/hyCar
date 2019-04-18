import Vue from 'vue'
import Router from 'vue-router'
import home from '@/pages/home'
import detail from '@/pages/detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta:{
        isKeepAlive: !!1
      }
    },
    {
      path: '/detail/:ids',
      name: 'detail',
      component: detail
    },
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // },
    // {
    //   path: '/',
    //   name: 'Hello',
    //   component: Hello
    // },
  ],
  // scrollBehavior (to, from, savedPosition) {
  //   // 从第二页返回首页时savedPosition为undefined
  //   if (savedPosition || typeof savedPosition === 'undefined') {
  //     // 只处理设置了路由元信息的组件
  //     from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : false
  //     to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : true
  //     if (savedPosition) {
  //       console.log(savedPosition)
  //       return savedPosition
  //     }
  //   } else {
  //     from.meta.isKeepAlive = typeof from.meta.isKeepAlive === 'undefined' ? undefined : true
  //     to.meta.isKeepAlive = typeof to.meta.isKeepAlive === 'undefined' ? undefined : false
  //   }
  // }
})
