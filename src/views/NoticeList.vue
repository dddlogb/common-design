<template>
  <div class="notice-list-page">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <div class="logo-icon">🏢</div>
          <span>企业通知系统</span>
        </div>
        <ul class="nav-menu">
          <li v-for="(item, index) in navItems" :key="index">
            <a 
              :href="item.href" 
              :class="{ active: currentNav === index }"
              @click.prevent="handleNavClick(index, item.href)"
            >
              {{ item.label }}
            </a>
          </li>
        </ul>
        <div class="search-box">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索通知..."
            @keyup.enter="handleSearch"
          >
          <button @click="handleSearch">🔍</button>
        </div>
      </div>
    </header>

    <!-- 面包屑导航 -->
    <div class="breadcrumb-container">
      <div class="breadcrumb">
        <a href="#" @click.prevent="goHome">首页</a>
        <span class="separator">/</span>
        <span class="current">通知公告</span>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="main-container">
      <!-- 左侧通知列表 -->
      <div class="notice-section">
        <div class="section-header">
          <h1 class="section-title">📢 通知公告</h1>
          <div class="filter-tabs">
            <button 
              v-for="(tab, index) in filterTabs" 
              :key="index"
              :class="['filter-tab', { active: currentFilter === index }]"
              @click="currentFilter = index"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- 排序工具栏 -->
        <div class="toolbar">
          <div class="sort-options">
            <span class="label">排序：</span>
            <select v-model="sortBy" @change="sortNotices">
              <option value="date_desc">按发布时间降序</option>
              <option value="date_asc">按发布时间升序</option>
              <option value="views">按阅读量</option>
              <option value="priority">按优先级</option>
            </select>
          </div>
          <div class="view-toggle">
            <button 
              :class="['view-btn', { active: viewMode === 'list' }]"
              @click="viewMode = 'list'"
              title="列表视图"
            >
              ☰
            </button>
            <button 
              :class="['view-btn', { active: viewMode === 'grid' }]"
              @click="viewMode = 'grid'"
              title="网格视图"
            >
              ⊞
            </button>
          </div>
        </div>

        <!-- 通知列表 -->
        <div :class="['notice-list', viewMode]">
          <div 
            v-for="(notice, index) in filteredNotices" 
            :key="index"
            :class="['notice-card', `priority-${notice.priority}`]"
          >
            <div class="card-badge" v-if="notice.badge">{{ notice.badge }}</div>
            <div class="card-date">
              <span class="day">{{ notice.day }}</span>
              <span class="month">{{ notice.month }}</span>
            </div>
            <div class="card-content">
              <h3 class="card-title">
                <a href="#" @click.prevent="viewNoticeDetail(notice)">
                  {{ notice.title }}
                </a>
              </h3>
              <p class="card-excerpt">{{ notice.excerpt }}</p>
              <div class="card-meta">
                <span class="meta-dept">👤 {{ notice.department }}</span>
                <span class="meta-date">📅 {{ notice.publishDate }}</span>
                <span class="meta-views">👁️ {{ formatNumber(notice.views) }}</span>
                <span class="meta-comments">💬 {{ notice.comments }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <button 
            class="page-btn"
            :disabled="currentPage === 1"
            @click="changePage(currentPage - 1)"
          >
            ⬅️ 上一页
          </button>
          <div class="page-numbers">
            <button 
              v-for="page in totalPages" 
              :key="page"
              :class="['page-number', { active: page === currentPage }]"
              @click="changePage(page)"
            >
              {{ page }}
            </button>
          </div>
          <button 
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="changePage(currentPage + 1)"
          >
            下一页 ➡️
          </button>
        </div>
      </div>

      <!-- 右侧边栏 -->
      <aside class="sidebar">
        <!-- 紧急通知 -->
        <div class="widget urgent-widget">
          <h3 class="widget-title">⚠️ 紧急通知</h3>
          <ul class="urgent-list">
            <li v-for="(item, index) in urgentNotices" :key="index">
              <a href="#" @click.prevent="viewNoticeDetail(item)">
                <span class="urgent-dot"></span>
                <span class="urgent-title">{{ item.title }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 阅读排行 -->
        <div class="widget">
          <h3 class="widget-title">🔥 阅读排行</h3>
          <ul class="ranking-list">
            <li v-for="(item, index) in topReads" :key="index">
              <span :class="['rank-num', `rank-${index + 1}`]">{{ index + 1 }}</span>
              <a href="#" @click.prevent="viewNoticeDetail(item)">
                {{ item.title }}
              </a>
              <span class="read-count">{{ formatNumber(item.views) }}</span>
            </li>
          </ul>
        </div>

        <!-- 通知分类 -->
        <div class="widget">
          <h3 class="widget-title">📁 通知分类</h3>
          <div class="category-grid">
            <a 
              v-for="(cat, index) in categories" 
              :key="index"
              href="#"
              class="category-item"
              @click.prevent="filterByCategory(cat.name)"
            >
              <span class="cat-icon">{{ cat.icon }}</span>
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">{{ cat.count }}</span>
            </a>
          </div>
        </div>

        <!-- 归档日历 -->
        <div class="widget">
          <h3 class="widget-title">📅 按月份归档</h3>
          <ul class="archive-list">
            <li v-for="(month, index) in archives" :key="index">
              <a href="#" @click.prevent="filterByMonth(month.period)">
                {{ month.label }}
                <span class="archive-count">{{ month.count }}</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

// 类型定义
interface NavItem {
  label: string
  href: string
}

interface NoticeCard {
  id: number
  title: string
  excerpt: string
  department: string
  publishDate: string
  day: string
  month: string
  views: number
  comments: number
  priority: 'high' | 'medium' | 'low'
  badge?: '紧急' | '重要'
}

interface FilterTab {
  label: string
  value: string
}

interface Category {
  name: string
  icon: string
  count: number
}

interface Archive {
  label: string
  period: string
  count: number
}

// 响应式数据
const currentNav = ref(0)
const currentFilter = ref(0)
const searchQuery = ref('')
const sortBy = ref('date_desc')
const viewMode = ref<'list' | 'grid'>('list')
const currentPage = ref(1)
const pageSize = 10

const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '新闻中心', href: '/news' },
  { label: '通知公告', href: '/notice' },
  { label: '部门动态', href: '/department' },
  { label: '政策法规', href: '/policy' }
]

const filterTabs: FilterTab[] = [
  { label: '全部', value: 'all' },
  { label: '紧急', value: 'urgent' },
  { label: '重要', value: 'important' },
  { label: '普通', value: 'normal' }
]

// 模拟通知数据
const allNotices = reactive<NoticeCard[]>([
  {
    id: 1,
    title: '关于 2024 年清明节放假安排的通知',
    excerpt: '根据国务院办公厅通知精神，结合公司实际情况，现将清明节放假安排通知如下...',
    department: '行政部',
    publishDate: '2024-04-02',
    day: '02',
    month: '4 月',
    views: 1256,
    comments: 23,
    priority: 'high',
    badge: '紧急'
  },
  {
    id: 2,
    title: '关于系统升级维护的公告',
    excerpt: '为提高系统性能，公司将于本周末对办公系统进行升级维护...',
    department: '技术部',
    publishDate: '2024-04-01',
    day: '01',
    month: '4 月',
    views: 892,
    comments: 15,
    priority: 'high',
    badge: '重要'
  },
  {
    id: 3,
    title: '关于开展春季运动会的通知',
    excerpt: '为丰富员工文化生活，增强体质，公司决定举办 2024 年春季运动会...',
    department: '工会',
    publishDate: '2024-03-28',
    day: '28',
    month: '3 月',
    views: 2341,
    comments: 56,
    priority: 'medium',
    badge: '重要'
  },
  // 添加更多数据...
])

const urgentNotices = ref([
  { id: 1, title: '关于清明节放假安排的通知' },
  { id: 2, title: '系统升级维护公告' }
])

const topReads = ref([
  { id: 3, title: '关于开展春季运动会的通知', views: 2341 },
  { id: 1, title: '关于清明节放假安排的通知', views: 1256 },
  { id: 2, title: '关于系统升级维护的公告', views: 892 }
])

const categories = ref<Category[]>([
  { name: '行政通知', icon: '📋', count: 156 },
  { name: '人事通知', icon: '👥', count: 89 },
  { name: '财务通知', icon: '💰', count: 67 },
  { name: '技术通知', icon: '💻', count: 45 },
  { name: '活动通知', icon: '🎉', count: 34 }
])

const archives = ref<Archive[]>([
  { label: '2024 年 4 月', period: '2024-04', count: 23 },
  { label: '2024 年 3 月', period: '2024-03', count: 45 },
  { label: '2024 年 2 月', period: '2024-02', count: 38 }
])

// 计算属性
const filteredNotices = computed(() => {
  let result = [...allNotices]
  
  // 按筛选条件过滤
  if (currentFilter.value === 1) {
    result = result.filter(n => n.priority === 'high')
  } else if (currentFilter.value === 2) {
    result = result.filter(n => n.priority === 'medium')
  } else if (currentFilter.value === 3) {
    result = result.filter(n => n.priority === 'low')
  }
  
  return result
})

const totalPages = computed(() => Math.ceil(filteredNotices.value.length / pageSize))

// 方法
const handleNavClick = (index: number, href: string) => {
  currentNav.value = index
  href = href
  // TODO: 路由跳转
}

const goHome = () => {
  // TODO: 返回首页
  alert('返回首页')
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    alert(`搜索：${searchQuery.value}`)
    // TODO: 实现搜索
  }
}

const sortNotices = () => {
  // TODO: 实现排序逻辑
  console.log('排序方式:', sortBy.value)
}

const viewNoticeDetail = (notice: {title: string}) => {
  // TODO: 跳转到详情页
  alert(`查看通知详情：${notice.title}`)
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  // TODO: 加载对应页面数据
}

const filterByCategory = (categoryName: string) => {
  alert(`筛选分类：${categoryName}`)
  // TODO: 实现分类筛选
}

const filterByMonth = (period: string) => {
  alert(`筛选月份：${period}`)
  // TODO: 实现月份筛选
}
</script>

<style scoped>
.notice-list-page {
  font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #f8f9fa;
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 顶部导航栏 */
.header {
  background: #ffffff;
  border-bottom: 3px solid #3498db;
  padding: 1rem 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.6rem;
  font-weight: bold;
  color: #2c3e50;
  display: flex;
  align-items: center;
}

.logo-icon {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 0.5rem;
}

.nav-menu a {
  color: #2c3e50;
  text-decoration: none;
  padding: 0.6rem 1.3rem;
  border-radius: 5px;
  transition: all 0.3s;
  font-weight: 500;
  white-space: nowrap;
}

.nav-menu a:hover {
  background: #3498db;
  color: white;
}

.nav-menu a.active {
  background: #3498db;
  color: white;
}

.search-box {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 25px;
  padding: 0.4rem 1rem;
  border: 2px solid #e9ecef;
  flex-shrink: 0;
  min-width: 0;
  max-width: 240px;
}

.search-box input {
  border: none;
  background: transparent;
  padding: 0.3rem;
  outline: none;
  width: 100%;
  font-size: 0.9rem;
  min-width: 0;
  flex: 1;
}

.search-box button {
  background: #3498db;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  cursor: pointer;
  transition: background 0.3s;
  flex-shrink: 0;
  margin-left: 8px;
}

/* 面包屑导航 */
.breadcrumb-container {
  background: white;
  padding: 15px 0;
  border-bottom: 1px solid #e9ecef;
}

.breadcrumb {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
}

.breadcrumb a {
  color: #3498db;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #2980b9;
}

.separator {
  color: #bdc3c7;
}

.current {
  color: #7f8c8d;
}

/* 主体容器 */
.main-container {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 30px;
}

/* 通知区域 */
.notice-section {
  background: white;
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.section-header {
  margin-bottom: 30px;
}

.section-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.filter-tabs {
  display: flex;
  gap: 10px;
}

.filter-tab {
  padding: 8px 20px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  color: #7f8c8d;
}

.filter-tab:hover {
  border-color: #3498db;
  color: #3498db;
}

.filter-tab.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ecf0f1;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-options .label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.sort-options select {
  padding: 8px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  background: white;
  color: #7f8c8d;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  gap: 8px;
}

.view-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.3s;
}

.view-btn:hover {
  border-color: #3498db;
  color: #3498db;
}

.view-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

/* 通知列表 */
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.notice-list.list .notice-card {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 5px solid transparent;
  transition: all 0.3s;
  position: relative;
}

.notice-list.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.notice-list.grid .notice-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-top: 5px solid transparent;
  transition: all 0.3s;
  position: relative;
}

.notice-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.notice-card.priority-high {
  border-left-color: #e74c3c;
}

.notice-card.priority-medium {
  border-left-color: #f39c12;
}

.notice-card.priority-low {
  border-left-color: #27ae60;
}

.card-badge {
  position: absolute;
  top: 15px;
  right: 15px;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: bold;
  background: #e74c3c;
  color: white;
}

.card-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  padding: 15px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  border-radius: 12px;
  color: white;
}

.card-date .day {
  font-size: 2rem;
  font-weight: bold;
  line-height: 1;
}

.card-date .month {
  font-size: 0.9rem;
  margin-top: 5px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
}

.card-title a {
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s;
}

.card-title a:hover {
  color: #3498db;
}

.card-excerpt {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 0.85rem;
  color: #95a5a6;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #ecf0f1;
}

.page-btn {
  padding: 10px 20px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  color: #7f8c8d;
}

.page-btn:hover:not(:disabled) {
  border-color: #3498db;
  color: #3498db;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-number {
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecef;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  color: #7f8c8d;
}

.page-number:hover {
  border-color: #3498db;
  color: #3498db;
}

.page-number.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.widget {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.widget-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ecf0f1;
}

/* 紧急通知 */
.urgent-widget {
  border-top: 4px solid #e74c3c;
}

.urgent-list {
  list-style: none;
}

.urgent-list li {
  margin-bottom: 12px;
}

.urgent-list li:last-child {
  margin-bottom: 0;
}

.urgent-list a {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s;
}

.urgent-list a:hover {
  color: #e74c3c;
}

.urgent-dot {
  width: 8px;
  height: 8px;
  margin-top: 6px;
  background: #e74c3c;
  border-radius: 50%;
  flex-shrink: 0;
}

.urgent-title {
  flex: 1;
  font-size: 0.95rem;
}

/* 阅读排行 */
.ranking-list {
  list-style: none;
}

.ranking-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
}

.ranking-list li:hover {
  background: #3498db;
  color: white;
}

.rank-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: white;
  flex-shrink: 0;
}

.rank-1 { background: linear-gradient(135deg, #f1c40f, #f39c12); }
.rank-2 { background: linear-gradient(135deg, #bdc3c7, #95a5a6); }
.rank-3 { background: linear-gradient(135deg, #cd7f32, #d35400); }

.ranking-list a {
  flex: 1;
  color: inherit;
  text-decoration: none;
  font-size: 0.9rem;
}

.read-count {
  font-size: 0.85rem;
  opacity: 0.8;
}

/* 分类网格 */
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s;
}

.category-item:hover {
  background: #3498db;
  color: white;
  transform: translateY(-3px);
}

.cat-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.cat-name {
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 5px;
}

.cat-count {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 归档列表 */
.archive-list {
  list-style: none;
}

.archive-list li {
  margin-bottom: 10px;
}

.archive-list a {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  color: #2c3e50;
  text-decoration: none;
  transition: all 0.3s;
}

.archive-list a:hover {
  background: #3498db;
  color: white;
}

.archive-count {
  background: #ecf0f1;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 0.8rem;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-container {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: 2;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    gap: 15px;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .search-box {
    order: 2;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .filter-tabs {
    flex-wrap: wrap;
  }

  .notice-list.grid {
    grid-template-columns: 1fr;
  }
}
</style>
