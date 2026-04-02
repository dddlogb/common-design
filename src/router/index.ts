import { createRouter, createWebHashHistory } from 'vue-router'
import EnterpriseWebsite from '../views/EnterpriseWebsite.vue'
import DataReport from '../views/DataReport.vue'
import NewsDetail from '../views/NewsDetail.vue'
import DepartmentNews from '../views/DepartmentNews.vue'
import DepartmentNewsDetail from '../views/DepartmentNewsDetail.vue'
import NoticeList from '../views/NoticeList.vue'
import NoticeDetail from '../views/NoticeDetail.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: EnterpriseWebsite,
    meta: { title: '企业官网通知系统 - 首页' }
  },
  {
    path: '/data-report',
    name: 'DataReport',
    component: DataReport,
    meta: { title: '数据报表 - 企业官网通知系统' }
  },
  {
    path: '/news-detail/:id',
    name: 'NewsDetail',
    component: NewsDetail,
    props: true, // 允许将路由参数作为 props 传递给组件
    meta: { title: '新闻详情 - 企业官网通知系统' }
  },
  {
    path: '/department-news',
    name: 'DepartmentNews',
    component: DepartmentNews,
    meta: { title: '部门动态 - 企业官网通知系统' }
  },
  {
    path: '/department-news-detail/:id',
    name: 'DepartmentNewsDetail',
    component: DepartmentNewsDetail,
    props: true, // 允许将路由参数作为 props 传递给组件
    meta: { title: '部门动态详情 - 企业官网通知系统' }
  },
  {
    path: '/notice',
    name: 'NoticeList',
    component: NoticeList,
    meta: { title: '通知公告 - 企业官网通知系统' }
  },
  {
    path: '/notice/:id',
    name: 'NoticeDetail',
    component: NoticeDetail,
    props: true, // 允许将路由参数作为 props 传递给组件
    meta: { title: '通知详情 - 企业官网通知系统' }
  }
]

const router = createRouter({
  history: createWebHashHistory(), // 使用 hash 模式，兼容旧服务器
  routes
})

// 全局前置守卫：可以在这里设置页面标题等
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title as string || '企业官网通知系统'
  
  // 继续导航
  next()
})

export default router
