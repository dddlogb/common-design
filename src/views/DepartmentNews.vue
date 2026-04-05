<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import NavSearch from '../components/NavSearch.vue'
import FooterSection from '../components/FooterSection.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface DepartmentNewsItem {
  id: number
  department: string
  departmentIcon: string
  title: string
  summary: string
  publishDate: string
  author: string
  views: number
  image?: string
}

const currentNav = ref(3) // 默认高亮"部门动态"（索引为3）
const searchQuery = ref('')
const selectedDepartment = ref<string>('all')

const departmentNewsList: DepartmentNewsItem[] = [
  {
    id: 1,
    department: '行政部',
    departmentIcon: '🏢',
    title: '行政部召开 2024 年第一季度工作总结会议',
    summary: '会议总结了第一季度在行政管理、后勤保障等方面的工作成果，部署了第二季度的重点工作任务。',
    publishDate: '2024-04-01',
    author: '行政部',
    views: 856
  },
  {
    id: 2,
    department: '人力资源部',
    departmentIcon: '👥',
    title: '人力资源部举办 2024 年第一期新员工入职培训',
    summary: '本期培训共有 35 名新员工参加，内容包括企业文化、规章制度、职业素养等多个模块。',
    publishDate: '2024-03-28',
    author: '人力资源部',
    views: 1234
  },
  {
    id: 3,
    department: '技术研发部',
    departmentIcon: '💻',
    title: '技术研发部成功完成新一代产品核心模块开发',
    summary: '经过三个月的攻关，技术团队攻克了多项技术难题，完成了产品核心模块的开发工作。',
    publishDate: '2024-03-25',
    author: '技术研发部',
    views: 2156
  },
  {
    id: 4,
    department: '市场营销部',
    departmentIcon: '📈',
    title: '市场营销部一季度业绩创新高，同比增长 35%',
    summary: '在市场环境复杂多变的情况下，营销团队开拓创新，一季度签约金额突破 5000 万元。',
    publishDate: '2024-03-22',
    author: '市场营销部',
    views: 1876
  },
  {
    id: 5,
    department: '财务部',
    departmentIcon: '💰',
    title: '财务部组织开展 2024 年预算编制培训',
    summary: '为提高各部门预算编制的科学性和准确性，财务部组织了专题培训。',
    publishDate: '2024-03-20',
    author: '财务部',
    views: 945
  },
  {
    id: 6,
    department: '质量管理部',
    departmentIcon: '✅',
    title: '质量管理部通过 ISO9001 质量管理体系复审',
    summary: '经过审核组的严格评审，公司质量管理体系运行情况良好，顺利通过复审认证。',
    publishDate: '2024-03-18',
    author: '质量管理部',
    views: 1123
  },
  {
    id: 7,
    department: '信息技术部',
    departmentIcon: '🔧',
    title: '信息技术部完成办公系统升级，提升工作效率',
    summary: '历时两个月的系统升级改造顺利完成，新增多项实用功能，员工办公效率提升 30%。',
    publishDate: '2024-03-15',
    author: '信息技术部',
    views: 1567
  },
  {
    id: 8,
    department: '客户服务部',
    departmentIcon: '🎧',
    title: '客户服务部客户满意度达 98.5%，创历史新高',
    summary: '通过优化服务流程、加强人员培训等措施，一季度客户满意度调查结果显示满意度达 98.5%。',
    publishDate: '2024-03-12',
    author: '客户服务部',
    views: 1345
  }
]

const navItems = [
  { label: '首页', href: '/' },
  { label: '新闻中心', href: '/news' },
  { label: '通知公告', href: '/notice' },
  { label: '部门动态', href: '/department-news' },
  { label: '数据报表', href: '/data-report' }
]

const aboutText = '企业通知系统是公司官方信息发布平台'
const socialLinks = [
  { icon: '💬', href: '#', platform: '微信' },
  { icon: '📧', href: '#', platform: '邮箱' },
  { icon: '🌐', href: '#', platform: '官网' }
]
const footerSections = [
  {
    title: '快速链接',
    links: [
      { label: '📰 新闻中心', href: '#' },
      { label: '📢 通知公告', href: '#' },
      { label: '🏢 部门动态', href: '#' }
    ]
  },
  {
    title: '帮助中心',
    links: [
      { label: '📖 使用指南', href: '#' },
      { label: '❓ 常见问题', href: '#' },
      { label: '🔧 技术支持', href: '#' }
    ]
  }
]
const footerInfo = {
  email: 'contact@company.com',
  phone: '010-8888 8888',
  address: '北京市朝阳区建国路 88 号',
  icp: '京 ICP 备 XXXXXXXX 号',
  police: '京公网安备 XXXXXXXXXXXXXX 号'
}

const departments = computed(() => {
  const deptSet = new Set(departmentNewsList.map((item: DepartmentNewsItem) => item.department))
  return ['all', ...Array.from(deptSet)]
})

const filteredNews = computed(() => {
  let result = departmentNewsList
  
  if (selectedDepartment.value !== 'all') {
    result = result.filter(n => n.department === selectedDepartment.value)
  }
  
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(n => 
      n.title.toLowerCase().includes(query) ||
      n.department.toLowerCase().includes(query) ||
      n.summary.toLowerCase().includes(query)
    )
  }
  
  return result
})

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatViews = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

const viewNewsDetail = (newsId: number) => {
  router.push({
    name: 'DepartmentNewsDetail',
    params: { id: newsId }
  })
}

const handleNavClick = (index: number, href: string) => {
  currentNav.value = index
  
  if (href === '/' || href === '#home') {
    router.push({ name: 'Home' })
  } else if (href === '/news' || href === '#news') {
    router.push({ name: 'Home' }).then(() => {
      setTimeout(() => {
        const newsSection = document.getElementById('news')
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    })
  } else if (href === '/notice' || href === '#notice') {
    router.push({ name: 'NoticeList' })
  } else if (href === '/department-news' || href === '#department') {
    // 已在当前页面，不做跳转
  } else if (href === '/data-report') {
    router.push({ name: 'DataReport' })
  } else if (href === '#contact') {
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
    // TODO
  }
}

const clearSearch = () => {
  searchQuery.value = ''
}

onMounted(() => {
  window.scrollTo(0, 0)
})
</script>

<template>
  <div class="department-news-page">
    <HeaderNav 
      :nav-items="navItems"
      :current-nav="currentNav"
      :search-query="searchQuery"
      @update:current-nav="currentNav = $event"
      @update:search-query="searchQuery = $event"
      @nav-click="handleNavClick"
      @search="handleSearch"
    >
      <template #search>
        <NavSearch 
          v-model="searchQuery"
          search-scope="department"
          placeholder="搜索部门动态..."
          @search="handleSearch"
        />
      </template>
    </HeaderNav>

    <div class="page-header">
      <div class="header-content">
        <h1>🏢 部门动态</h1>
        <p class="subtitle">展示各部门工作成果，促进内部交流与学习</p>
      </div>
    </div>

    <div class="main-container">
      <div class="filter-bar">
        <div class="filter-group">
          <label>选择部门:</label>
          <select v-model="selectedDepartment" class="filter-select">
            <option value="all">全部部门</option>
            <option v-for="d in departments.filter(str => str !== 'all')" :key="d" :value="d">
              {{ d }}
            </option>
          </select>
        </div>
        <div class="filter-group">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索部门动态..." 
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="clear-btn">✕</button>
        </div>
      </div>

      <div class="stats-bar">
        <span>共 {{ filteredNews.length }} 条动态</span>
        <span v-if="searchQuery"> · 搜索："{{ searchQuery }}"</span>
      </div>

      <div class="news-grid">
        <div 
          v-for="news in filteredNews" 
          :key="news.id"
          class="news-card"
          @click="viewNewsDetail(news.id)"
        >
          <div class="news-image">{{ news.image || '📰' }}</div>
          <div class="news-content">
            <div class="news-header">
              <span class="department-tag">
                {{ news.departmentIcon }} {{ news.department }}
              </span>
              <span class="news-date">{{ formatDate(news.publishDate) }}</span>
            </div>
            <h3 class="news-title">{{ news.title }}</h3>
            <p class="news-summary">{{ news.summary }}</p>
            <div class="news-footer">
              <span class="news-author">👤 {{ news.author }}</span>
              <span class="news-views">👁️ {{ formatViews(news.views) }}</span>
            </div>
          </div>
        </div>

        <div v-if="filteredNews.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-text">暂无符合条件的部门动态</p>
        </div>
      </div>
    </div>

    <FooterSection
      :about-text="aboutText"
      :social-links="socialLinks"
      :footer-sections="footerSections"
      :footer-info="footerInfo"
    />
  </div>
</template>

<style scoped>
.department-news-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px 60px;
  text-align: center;
}

.header-content h1 {
  font-size: 2.5rem;
  margin: 0 0 10px 0;
  font-weight: bold;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.95;
  margin: 0;
}

.main-container {
  max-width: 1200px;
  margin: -40px auto 40px;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.filter-bar {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: #2c3e50;
}

.filter-select {
  padding: 8px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-select:hover {
  border-color: #667eea;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

.search-input {
  padding: 8px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
  width: 250px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.clear-btn {
  background: #95a5a6;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.clear-btn:hover {
  background: #7f8c8d;
}

.stats-bar {
  padding: 15px 20px;
  background: white;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #7f8c8d;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.news-card {
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.news-image {
  height: 180px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
}

.news-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.news-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.department-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.85rem;
  font-weight: 500;
}

.news-date {
  font-size: 0.85rem;
  color: #7f8c8d;
}

.news-title {
  font-size: 1.1rem;
  color: #2c3e50;
  margin: 0 0 10px 0;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-summary {
  line-height: 1.6;
  color: #555;
  margin: 0 0 15px 0;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.news-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #ecf0f1;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.news-author,
.news-views {
  display: flex;
  align-items: center;
  gap: 5px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 10px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 15px;
}

.empty-text {
  color: #7f8c8d;
  font-size: 1.1rem;
  margin: 0;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-input {
    width: 100%;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
  }
  
  .news-image {
    height: 150px;
  }
}
</style>
