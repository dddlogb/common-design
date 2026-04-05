<template>
  <div class="enterprise-website">
    <!-- 顶部导航栏 - 使用组件 -->
    <HeaderNav 
      :nav-items="navItems"
      :current-nav="currentNav"
      :search-query="searchQuery"
      @update:current-nav="currentNav = $event"
      @update:search-query="searchQuery = $event"
      @nav-click="handleNavClick"
      @search="handleSearch"
    />

    <!-- 横幅区域 -->
    <section class="banner">
      <div class="banner-container">
        <div class="banner-text">
          <h1>高效沟通 · 信息直达</h1>
          <p>企业官方信息发布平台，及时传递重要通知与新闻动态</p>
          <a href="#news" class="banner-btn" @click.prevent="scrollToSection('news')">查看详情 →</a>
        </div>
        <div class="banner-stats">
          <div 
            v-for="(stat, index) in statistics" 
            :key="index" 
            class="stat-card"
            :style="{ background: stat.background }"
          >
            <span class="stat-number">{{ stat.number }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 新闻中心 -->
      <section class="news-section" id="news">
        <div class="section-header">
          <h2 class="section-title">新闻中心</h2>
          <a href="#" class="view-more" @click.prevent="viewAllNews">
            查看全部 <span>→</span>
          </a>
        </div>

        <!-- 标签页切换 -->
        <div class="news-tabs">
          <button 
            v-for="(tab, index) in newsTabs" 
            :key="index"
            :class="['tab-btn', { active: currentTab === index }]"
            @click="currentTab = index"
          >
            {{ tab }}
          </button>
        </div>

        <!-- 新闻列表 -->
        <div class="news-list">
          <article 
            v-for="(news, index) in filteredNewsList" 
            :key="index" 
            class="news-card"
          >
            <div class="news-image">{{ news.icon }}</div>
            <div class="news-content">
              <span class="news-category">{{ news.category }}</span>
              <h3>
                <a @click.prevent="viewNewsDetail(news)" style="cursor: pointer;">{{ news.title }}</a>
              </h3>
              <p class="news-excerpt">{{ news.excerpt }}</p>
              <div class="news-meta">
                <span>👤 {{ news.author }}</span>
                <span>📅 {{ news.date }}</span>
                <span>👁️ {{ formatNumber(news.views) }} 阅读</span>
                <span>💬 {{ news.comments }} 评论</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- 侧边栏 -->
      <aside class="sidebar">
        <!-- 通知公告 -->
        <div class="widget" id="notice">
          <h3 class="widget-title">📢 通知公告</h3>
          <ul class="notice-list">
            <li 
              v-for="(notice, index) in notices" 
              :key="index"
              class="notice-item"
            >
              <a href="#" class="notice-link" @click.prevent="viewNoticeDetail(notice)">
                <div 
                  class="priority-dot" 
                  :class="getPriorityClass(notice.priority)"
                ></div>
                <div class="notice-text">
                  <div class="notice-title">
                    {{ notice.title }}
                    <span 
                      v-if="notice.badge" 
                      class="notice-badge" 
                      :class="getBadgeClass(notice.badge)"
                    >
                      {{ notice.badge }}
                    </span>
                  </div>
                  <div class="notice-time">{{ notice.time }}</div>
                </div>
              </a>
            </li>
          </ul>
        </div>

        <!-- 日历组件 -->
        <div class="calendar-widget">
          <div class="calendar-date">{{ currentDate.day }}</div>
          <div class="calendar-day">{{ currentDate.weekday }} · {{ currentDate.month }} {{ currentDate.year }}</div>
          <div class="calendar-events">
            <h4>📅 今日待办</h4>
            <div 
              v-for="(event, index) in todayEvents" 
              :key="index"
              class="event-item"
            >
              {{ event.time }} {{ event.title }}
            </div>
          </div>
        </div>

        <!-- 快速通道 -->
        <div class="widget">
          <h3 class="widget-title">⚡ 快速通道</h3>
          <div class="quick-links-grid">
            <a 
              v-for="(link, index) in quickLinks" 
              :key="index"
              :href="link.href"
              class="quick-link-card"
              @click.prevent="handleQuickLink(link)"
            >
              <span class="quick-link-icon">{{ link.icon }}</span>
              <span class="quick-link-text">{{ link.label }}</span>
            </a>
          </div>
        </div>

        <!-- 联系我们 -->
        <div class="contact-card" id="contact">
          <div class="contact-header">
            <h3>📞 联系我们</h3>
            <p>{{ contactInfo.subtitle }}</p>
          </div>
          <div class="contact-body">
            <div 
              v-for="(item, index) in contactInfo.items" 
              :key="index"
              class="contact-row"
            >
              <div class="contact-row-icon">{{ item.icon }}</div>
              <div>
                <strong>{{ item.title }}</strong><br>
                <small>{{ item.content }}</small>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>

    <!-- 页脚 - 使用组件 -->
    <FooterSection 
      :about-text="aboutText"
      :social-links="socialLinks"
      :footer-sections="footerSections"
      :footer-info="footerInfo"
      @social-click="handleSocialClick"
      @footer-link-click="handleFooterLink"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import FooterSection from '../components/FooterSection.vue'
import { useRouter } from 'vue-router'

// 初始化 Vue Router
const router = useRouter()

// 类型定义
interface NavItem {
  label: string
  href: string
}

interface Statistic {
  number: string
  label: string
  background: string
}

interface NewsItem {
  icon: string
  category: string
  title: string
  excerpt: string
  author: string
  date: string
  views: number
  comments: number
  id?: number // 新闻 ID，用于路由跳转
}

interface NoticeItem {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  badge?: '紧急' | '重要'
  time: string
}

interface QuickLink {
  icon: string
  label: string
  href: string
}

interface SocialLink {
  icon: string
  href: string
  platform: string
}

interface FooterLink {
  label: string
  href: string
}

interface FooterSection {
  title: string
  links: FooterLink[]
}

interface EventItem {
  time: string
  title: string
}

// 响应式数据
const currentNav = ref(0)
const currentTab = ref(0)
const searchQuery = ref('')

const navItems: NavItem[] = [
  { label: '首页', href: '#home' },
  { label: '新闻中心', href: '#news' },
  { label: '通知公告', href: '/notice' },
  { label: '部门动态', href: '/department-news' },
  { label: '数据报表', href: '/data-report' },
  { label: '联系我们', href: '#contact' }
]

const statistics: Statistic[] = [
  { number: '1,234', label: '累计发布通知', background: 'rgba(52, 152, 219, 0.3)' },
  { number: '5,678', label: '新闻动态', background: 'rgba(46, 204, 113, 0.3)' },
  { number: '98%', label: '阅读覆盖率', background: 'rgba(155, 89, 182, 0.3)' },
  { number: '24h', label: '实时更新', background: 'rgba(241, 196, 15, 0.3)' }
]

const newsTabs = ['全部', '公司新闻', '行业动态', '媒体聚焦', '活动公告']

const newsList: NewsItem[] = [
  {
    id: 1,
    icon: '📰',
    category: '公司新闻',
    title: '公司召开 2024 年度战略规划会议，明确未来发展目标',
    excerpt: '本次会议深入分析了当前市场形势，制定了新一年的发展战略和重点工作任务，为公司的可持续发展奠定了坚实基础...',
    author: '行政部',
    date: '2024-04-02',
    views: 1256,
    comments: 45
  },
  {
    id: 2,
    icon: '🤝',
    category: '合作动态',
    title: '公司与多家知名企业签署战略合作协议，共建产业生态圈',
    excerpt: '此次合作标志着公司在业务拓展方面迈出重要一步，将通过资源共享、优势互补，实现多方共赢发展...',
    author: '市场部',
    date: '2024-03-28',
    views: 2089,
    comments: 78
  },
  {
    id: 3,
    icon: '🏆',
    category: '公司荣誉',
    title: '公司荣获"年度创新企业奖",技术创新能力获认可',
    excerpt: '在近日举办的行业盛典上，公司凭借卓越的技术创新能力和优秀的市场表现，从众多参选企业中脱颖而出，荣获此项殊荣...',
    author: '总经办',
    date: '2024-03-20',
    views: 3421,
    comments: 156
  },
  {
    id: 4,
    icon: '🚀',
    category: '产品发布',
    title: '公司新一代智能产品正式发布，引领行业技术革新',
    excerpt: '该产品融合了最新的人工智能技术，在性能、用户体验等方面实现重大突破，将为客户带来全新的使用体验...',
    author: '产品部',
    date: '2024-03-15',
    views: 4567,
    comments: 203
  },
  {
    id: 5,
    icon: '🎓',
    category: '培训发展',
    title: '公司举办中层管理人员能力提升培训班',
    excerpt: '为期三天的培训课程涵盖领导力提升、团队管理、沟通技巧等多个模块，旨在打造高素质的管理人才队伍...',
    author: '人力资源部',
    date: '2024-03-10',
    views: 1890,
    comments: 67
  }
]

const notices: NoticeItem[] = [
  { id: 1, title: '关于清明节放假安排的通知', priority: 'high', badge: '紧急', time: '2 小时前' },
  { id: 2, title: '系统升级维护公告', priority: 'high', badge: '重要', time: '5 小时前' },
  { id: 3, title: '关于开展春季运动会报名的通知', priority: 'medium', time: '1 天前' },
  { id: 4, title: '新版员工手册发布通知', priority: 'medium', time: '2 天前' },
  { id: 5, title: '办公区域节能降耗倡议书', priority: 'low', time: '3 天前' },
  { id: 6, title: '食堂新菜品上线通知', priority: 'low', time: '1 周前' }
]

const quickLinks: QuickLink[] = [
  { icon: '📋', label: '公告查询', href: '#' },
  { icon: '📝', label: '流程审批', href: '#' },
  { icon: '📊', label: '数据报表', href: '#' },
  { icon: '📁', label: '文档下载', href: '#' },
  { icon: '💼', label: '办事指南', href: '#' },
  { icon: '❓', label: '常见问题', href: '#' }
]

const todayEvents: EventItem[] = [
  { time: '09:00', title: '月度经营分析会' },
  { time: '14:00', title: '项目评审会议' },
  { time: '16:00', title: '客户接待' }
]

const currentDate = reactive({
  day: '02',
  weekday: '星期四',
  month: '4 月',
  year: '2024'
})

const contactInfo = reactive({
  subtitle: '有任何问题请随时联系',
  items: [
    { icon: '📍', title: '公司地址', content: '北京市朝阳区建国路 88 号' },
    { icon: '📱', title: '联系电话', content: '010-8888 8888' },
    { icon: '📧', title: '电子邮箱', content: 'contact@company.com' },
    { icon: '🕐', title: '工作时间', content: '周一至周五 9:00-18:00' }
  ]
})

const aboutText = '企业通知系统是 company 官方信息发布平台，致力于为员工、合作伙伴和社会公众提供及时、准确、全面的信息服务。我们秉承专业、高效的服务理念，不断提升信息传播质量和效率。'

const socialLinks: SocialLink[] = [
  { icon: '💬', href: '#', platform: '微信' },
  { icon: '📘', href: '#', platform: 'Facebook' },
  { icon: '🐦', href: '#', platform: 'Twitter' },
  { icon: '📷', href: '#', platform: 'Instagram' }
]

const footerSections: FooterSection[] = [
  {
    title: '快速链接',
    links: [
      { label: '✨ 设为首页', href: '#' },
      { label: '⭐ 加入收藏', href: '#' },
      { label: '📱 手机版', href: '#' },
      { label: '🗺️ 网站地图', href: '#' }
    ]
  },
  {
    title: '信息分类',
    links: [
      { label: '📰 公司新闻', href: '#' },
      { label: '📢 通知公告', href: '#' },
      { label: '🏛️ 政策法规', href: '#' },
      { label: '🎯 部门动态', href: '#' }
    ]
  },
  {
    title: '帮助中心',
    links: [
      { label: '📖 使用指南', href: '#' },
      { label: '❓ 常见问题', href: '#' },
      { label: '🔧 技术支持', href: '#' },
      { label: '📞 联系客服', href: '#' }
    ]
  }
]

const footerInfo = reactive({
  email: 'contact@company.com',
  phone: '010-8888 8888',
  address: '北京市朝阳区建国路 88 号',
  icp: '京 ICP 备 XXXXXXXX 号',
  police: '京公网安备 XXXXXXXXXXXXXX 号'
})

// 计算属性
const filteredNewsList = computed(() => {
  if (currentTab.value === 0) {
    return newsList
  }
  const tabName = newsTabs[currentTab.value]
  return newsList.filter(news => news.category.includes(tabName) || news.category === tabName)
})

// 方法
const handleNavClick = (index: number, href: string) => {
  currentNav.value = index
  
  // 使用 Vue Router 进行跳转
  if (href === '#home') {
    router.push({ name: 'Home' })
  } else if (href === '#news') {
    // 跳转到首页并滚动到新闻中心
    router.push({ name: 'Home' }).then(() => {
      setTimeout(() => {
        const newsSection = document.getElementById('news')
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    })
  } else if (href === '#notice') {
    // 跳转到通知公告列表页
    router.push({ name: 'NoticeList' })
  } else if (href === '/notice') {
    // 跳转到通知公告列表页
    router.push({ name: 'NoticeList' })
  } else if (href === '#department') {
    // 跳转到部门动态页面
    router.push({ name: 'DepartmentNews' })
  } else if (href === '/department-news') {
    // 跳转到部门动态页面
    router.push({ name: 'DepartmentNews' })
  } else if (href === '/data-report') {
    // 跳转到数据报表页面
    router.push({ name: 'DataReport' })
  } else if (href === '#contact') {
    // 跳转到联系我们
    router.push({ name: 'Home' }).then(() => {
      setTimeout(() => {
        const contactSection = document.getElementById('contact')
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    })
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    alert('搜索内容：' + searchQuery.value)
    // TODO: 实现搜索逻辑
  }
}

const viewAllNews = () => {
  alert('跳转到新闻中心页面')
  // TODO: 实现跳转逻辑
}

const viewNewsDetail = (news: NewsItem) => {
  // 跳转到新闻详情页面，使用 Vue Router
  router.push({
    name: 'NewsDetail',
    params: { id: news.id }
  })
}

const viewNoticeDetail = (notice: NoticeItem) => {
  // 跳转到通知公告详情页面，使用 Vue Router
  router.push({
    name: 'NoticeDetail',
    params: { id: notice.id }
  })
}

const handleQuickLink = (link: QuickLink) => {
  console.log(link.label)
  if (link.label === '数据报表') {
    // 跳转到数据报表页面，使用 Vue Router
    router.push({ name: 'DataReport' })
  } else {
    alert(`打开快速通道：${link.label}`)
    // TODO: 实现其他快速通道逻辑
  }
}

const handleSocialClick = (social: SocialLink) => {
  alert(`访问${social.platform}`)
  // TODO: 实现社交链接跳转
}

const handleFooterLink = (link: FooterLink) => {
  alert(`跳转到：${link.label}`)
  // TODO: 实现页脚链接跳转
}

const getPriorityClass = (priority: string) => {
  return `priority-${priority}`
}

const getBadgeClass = (badge: string) => {
  if (badge === '紧急') return 'badge-urgent'
  if (badge === '重要') return 'badge-important'
  return ''
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style scoped>
.enterprise-website {
  font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #ffffff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 横幅区域 */
.banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  color: white;
}

.banner-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
}

.banner-text h1 {
  font-size: 2.8rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.banner-text p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.95;
}

.banner-btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: white;
  color: #3498db;
  text-decoration: none;
  border-radius: 30px;
  font-weight: bold;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.banner-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.banner-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-card {
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
  padding: 25px;
  border-radius: 15px;
  text-align: center;
  border: 2px solid rgba(255,255,255,0.3);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.95rem;
  opacity: 0.9;
}

/* 主要内容区域 */
.main-container {
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 40px;
}

/* 新闻中心 */
.news-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 35px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 3px solid #3498db;
}

.section-title {
  font-size: 1.6rem;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title::before {
  content: '';
  width: 5px;
  height: 30px;
  background: #3498db;
  border-radius: 3px;
}

.view-more {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: gap 0.3s;
}

.view-more:hover {
  gap: 10px;
}

/* 标签页 */
.news-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.tab-btn {
  padding: 0.6rem 1.5rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  color: #7f8c8d;
}

.tab-btn:hover {
  border-color: #3498db;
  color: #3498db;
}

.tab-btn.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

/* 新闻列表 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.news-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.news-image {
  width: 220px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: white;
}

.news-content {
  flex: 1;
  padding: 20px;
}

.news-category {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  background: #3498db;
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
  margin-bottom: 10px;
}

.news-content h3 {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.news-content h3 a {
  color: inherit;
  text-decoration: none;
  transition: color 0.3s;
}

.news-content h3 a:hover {
  color: #3498db;
}

.news-excerpt {
  color: #7f8c8d;
  line-height: 1.7;
  margin-bottom: 15px;
}

.news-meta {
  display: flex;
  gap: 20px;
  font-size: 0.85rem;
  color: #95a5a6;
}

.news-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
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
  padding: 25px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.08);
  border-top: 4px solid #3498db;
}

.widget-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ecf0f1;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 通知列表 */
.notice-list {
  list-style: none;
}

.notice-item {
  padding: 12px 0;
  border-bottom: 1px solid #ecf0f1;
}

.notice-item:last-child {
  border-bottom: none;
}

.notice-link {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #2c3e50;
  text-decoration: none;
  transition: color 0.3s;
}

.notice-link:hover {
  color: #3498db;
}

.priority-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.priority-high { background: #e74c3c; }
.priority-medium { background: #f39c12; }
.priority-low { background: #27ae60; }

.notice-text {
  flex: 1;
}

.notice-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.notice-time {
  font-size: 0.8rem;
  color: #95a5a6;
}

.notice-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 8px;
}

.badge-urgent {
  background: #e74c3c;
  color: white;
}

.badge-important {
  background: #f39c12;
  color: white;
}

/* 快速通道 */
.quick-links-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.quick-link-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s;
  text-align: center;
}

.quick-link-card:hover {
  background: #3498db;
  color: white;
  transform: translateY(-3px);
}

.quick-link-icon {
  font-size: 1.8rem;
  display: block;
  margin-bottom: 8px;
}

.quick-link-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 日历组件 */
.calendar-widget {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  padding: 25px;
  text-align: center;
}

.calendar-date {
  font-size: 3.5rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 5px;
}

.calendar-day {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 15px;
}

.calendar-events {
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}

.calendar-events h4 {
  font-size: 0.95rem;
  margin-bottom: 10px;
  opacity: 0.9;
}

.event-item {
  font-size: 0.85rem;
  padding: 5px 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.event-item:last-child {
  border-bottom: none;
}

/* 联系我们卡片 */
.contact-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 15px rgba(0,0,0,0.08);
}

.contact-header {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  padding: 20px;
  text-align: center;
}

.contact-header h3 {
  font-size: 1.3rem;
  margin-bottom: 5px;
}

.contact-body {
  padding: 20px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  color: #7f8c8d;
}

.contact-row:last-child {
  margin-bottom: 0;
}

.contact-row-icon {
  width: 35px;
  height: 35px;
  background: #3498db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

/* 页脚 */
.footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 50px 0 20px;
  margin-top: 60px;
}

.footer-top {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 40px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.footer-about h3 {
  font-size: 1.4rem;
  margin-bottom: 15px;
  color: white;
}

.footer-about p {
  line-height: 1.8;
  opacity: 0.8;
  margin-bottom: 20px;
}

.social-links {
  display: flex;
  gap: 12px;
}

.social-link {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s;
  font-size: 1.2rem;
}

.social-link:hover {
  background: #3498db;
  transform: translateY(-3px);
}

.footer-links h4 {
  font-size: 1.1rem;
  margin-bottom: 20px;
  color: white;
  position: relative;
  padding-bottom: 10px;
}

.footer-links h4::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 30px;
  height: 2px;
  background: #3498db;
}

.footer-links ul {
  list-style: none;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-links a:hover {
  color: #3498db;
  padding-left: 5px;
}

.footer-bottom {
  background: #1a252f;
  padding: 20px 0;
  text-align: center;
  color: #95a5a6;
  font-size: 0.9rem;
}

.footer-bottom p {
  margin-bottom: 8px;
}

/* 响应式设计 */
@media (max-width: 992px) {
  .banner-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .banner-stats {
    max-width: 500px;
    margin: 0 auto;
  }

  .main-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .banner-text h1 {
    font-size: 2rem;
  }

  .news-card {
    flex-direction: column;
  }

  .news-image {
    width: 100%;
    height: 150px;
  }
}
</style>
