import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'


/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes 静态路由
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  //首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/newForm',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '',
        component: () => import('@/views/formTableDesign/newForm'),
        name: '表单设计',
        meta: { title: '表单设计', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/flow',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '',
        component: () => import('@/views/flow/panel'),
        name: '流程设计',
        meta: { title: '流程设计', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/flowStart',
    component: Layout,
    redirect: '/',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/process/initiatingProcess'),
        name: '表单发起',
        meta: { title: '表单发起', icon: 'dashboard', affix: true }
      }
    ]
  },
  // {
  //   path: '/historyProcess',
  //   component: Layout,
  //   redirect: '/',
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/process/historyProcess'),
  //       name: '历史流程',
  //       meta: { title: '历史流程', icon: 'dashboard', affix: true }
  //     },
  //     {
  //       path: 'viewProcess',
  //       component: () => import('@/views/process/viewProcess'),
  //       name: '历史详情',
  //       hidden: true,
  //       meta: { title: '历史详情', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/todoProcess',
  //   component: Layout,
  //   redirect: '/',
  //   children: [
  //     {
  //       path: '',
  //       component: () => import('@/views/process/todoProcess'),
  //       name: '待办流程',
  //       meta: { title: '待办流程', icon: 'dashboard', affix: true }
  //     },
  //     {
  //       path: 'handleProcess',
  //       component: () => import('@/views/process/handleProcess'),
  //       name: '待办详情',
  //       hidden: true,
  //       meta: { title: '待办详情', icon: 'dashboard', affix: true }
  //     }
  //   ]
  // },
  {
    path: '/process',
    component: Layout,
    redirect: '/process/historyProcess',
    alwaysShow: true, 
    name: 'process',
    meta: {
      title: '事项管理',
      icon: 'documentation',
      affix: true
    },
    children: [
      {
        path: 'historyProcess',
        component: () => import('@/views/process/historyProcess'),
        name: '历史流程',
        meta: { title: '历史流程', icon: 'dashboard', affix: true }
      },
      {
        path: 'viewProcess',
        component: () => import('@/views/process/viewProcess'),
        name: '历史详情',
        hidden: true,
        meta: { title: '历史详情', icon: 'dashboard', affix: true }
      },
      {
        path: 'todoProcess',
        component: () => import('@/views/process/todoProcess'),
        name: '待办流程',
        meta: { title: '待办流程', icon: 'dashboard', affix: true }
      },
      {
        path: 'handleProcess',
        component: () => import('@/views/process/handleProcess'),
        name: '待办详情',
        hidden: true,
        meta: { title: '待办详情', icon: 'dashboard', affix: true }
      }
    ]
  },
  //流程发起权限
  {
    path: '/flowStartAccess',
    component: Layout,
    redirect: '/',
    children: [
      {
        path: '',
        component: () => import('@/views/system/access/flowStartAccess'),
        name: '流程发起权限',
        meta: { title: '流程发起权限', icon: 'dashboard', affix: true }
      }
    ]
  },
  //个人中心
   {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: 'profile', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'System',
  //   meta: {
  //     title: '系统管理',
  //     icon: 'documentation',
  //     roles: ['2018113009'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'user',
  //       component: () => import('@/views/system/user/list'),
  //       name: 'User',
  //       meta: {
  //         title: '用户管理',
  //         roles: ['2018113009'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'detail',
  //       hidden: true,
  //       component: () => import('@/views/system/user/detail'),
  //       name: 'detail',
  //       mate: {
  //         title: '用户详情',
  //         roles: ['2018113009']
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/system/role'),
  //       name: 'Role',
  //       meta: {
  //         title: '角色管理',
  //         roles: ['2018113009'] // or you can only set roles in sub nav
  //       }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
