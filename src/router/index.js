import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import home from '../components/home'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Domain from '../components/user/Domain.vue'

Vue.use(Router)

// export default new Router({
//   routes: [
//     { path: '/', redirect: '/login' },
//     { path: '/login', component: Login },
//     { path: '/home', component: home }
//   ]
// })

// 每个路由地址必须以斜线开头
const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: home,
      // 重定向
      redirect: '/welcome',
      // 子路由, path目录 不能乱写，点击实际跳转到哪个目录，就写那个目录
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/domain', component: Domain }
      ]
    }
  ]
})

// 在暴露路由对象之前,挂载路由导航守卫
// 挂载路由导航守卫, 前端的权限控制, beforeEatch就是导航守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数，表示放行
  //  用法1：next() 放行; 用法2: next('/login') 强制跳转

  // 如果访问的是登录页，直接放行
  if (to.path === '/login') return next()
  // 从sessionstorage 中获取到 保存的 token 值
  const tokenStr = window.sessionStorage.getItem('token')
  // 如果么有token, 强制跳转到登录页
  if (!tokenStr) return next('/login')
  next()
})

// 暴露路由对象
export default router
