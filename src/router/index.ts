import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    meta: {
      requiresAuth: true,
      title: '首页'
    },
    children: [
      {
        path: '',
        name: 'home',
        // component: () => import(/* webpackChunkName: 'home' */ '@/views/home/index.vue'),
        component: () => import(/* webpackChunkName: 'home' */ '@/views/course/index.vue'),
        meta: { title: '首页' }
      },
      {
        path: '/role',
        name: 'role',
        component: () => import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
        meta: { title: '角色管理' }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () => import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
        meta: { title: '菜单管理' }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource/index.vue'),
        meta: { title: '资源管理' }
      },
      {
        path: '/resource-category',
        name: 'resource-category',
        component: () => import(/* webpackChunkName: 'resource' */ '@/views/resource-category/index.vue'),
        meta: { title: '资源分类管理' }
      },
      {
        path: '/course',
        name: 'course',
        component: () => import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
        meta: { title: '课程管理' }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import(/* webpackChunkName: 'user' */ '@/views/user/index.vue'),
        meta: { title: '用户管理' }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () => import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue'),
        meta: { title: '广告列表' }
      },
      {
        path: '/advert-create',
        name: 'advert-create',
        component: () => import(/* webpackChunkName: 'advert-create' */ '@/views/advert/create.vue'),
        meta: { title: '添加广告' }
      },
      {
        path: '/advert/:advertId/edit',
        name: 'advert-edit',
        component: () => import(/* webpackChunkName: 'advert-edit' */ '@/views/advert/edit.vue'),
        props: true,
        meta: { title: '编辑广告' }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () => import(/* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue'),
        meta: { title: '广告位列表' }
      },
      {
        path: '/advert-space-create',
        name: 'advert-space-create',
        component: () => import(/* webpackChunkName: 'advert-space-create' */ '@/views/advert-space/create.vue'),
        meta: { title: '添加广告位' }
      },
      {
        path: '/advert-space/:advertSpaceId/edit',
        name: 'advert-space-edit',
        component: () => import(/* webpackChunkName: 'advert-space-edit' */ '@/views/advert-space/edit.vue'),
        props: true,
        meta: { title: '编辑广告位' }
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue'),
        meta: { title: '添加菜单' }
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () => import(/* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue'),
        meta: { title: '编辑菜单' }
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'),
        props: true, // 将路由路径参数映射到组件的 props 中
        meta: { title: '分配菜单' }
      },
      {
        path: '/role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: () => import(/* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-resource.vue'),
        props: true, // 将路由路径参数映射到组件的 props 中
        meta: { title: '分配资源' }
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () => import(/* webpackChunkName: 'course-create' */ '@/views/course/create.vue'),
        meta: { title: '添加课程' }
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () => import(/* webpackChunkName: 'course-edit' */ '@/views/course/edit.vue'),
        props: true,
        meta: { title: '编辑课程' }
      },
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () => import(/* webpackChunkName: 'course-section' */ '@/views/course/section.vue'),
        props: true,
        meta: { title: '内容管理' }
      },
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () => import(/* webpackChunkName: 'course-video' */ '@/views/course/video.vue'),
        props: true,
        meta: { title: '上传视频' }
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () => import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 全局前置守卫：任何页面访问都要经过这里
// to：要去哪里的路由信息
// from：从哪里来的路由信息
// next：通行的标志
router.beforeEach((to, from, next) => {
  // to.matched 是一个数组（匹配到的路由记录）
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        name: 'login',
        query: {
          redirect: to.fullPath // 把登录成功需要返回的页面告诉登录页面
        }
      })
    } else {
      next()
    }
  } else {
    next()
  }

  // 路由守卫中一定要调用 next，否则页面无法展示
  // next()
})

export default router
