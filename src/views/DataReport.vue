<template>
  <div class="data-report-page">
    <!-- 顶部导航栏 - 使用 HeaderNav 组件 -->
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
          search-scope="all"
          placeholder="搜索报表..."
          @search="handleSearch"
        />
      </template>
    </HeaderNav>

    <!-- 页面标题 -->
    <section class="page-header">
      <div class="page-header-content">
        <h1>📊 数据报表</h1>
        <p>企业数据统计与分析报表中心</p>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 报表分类筛选 -->
      <div class="report-filters">
        <div class="filter-group">
          <label>报表类型:</label>
          <select v-model="selectedType" class="filter-select">
            <option value="all">全部报表</option>
            <option value="notice">通知统计</option>
            <option value="news">新闻数据</option>
            <option value="department">部门排行</option>
            <option value="user">用户分析</option>
          </select>
        </div>
        <div class="filter-group">
          <label>时间范围:</label>
          <select v-model="selectedTimeRange" class="filter-select">
            <option value="week">最近 7 天</option>
            <option value="month">最近 30 天</option>
            <option value="quarter">最近季度</option>
            <option value="year">最近一年</option>
          </select>
        </div>
        <div class="filter-group">
          <button class="export-btn" @click="handleExport">
            📥 导出报表
          </button>
        </div>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div 
          v-for="(stat, index) in reportStats" 
          :key="index"
          class="stat-card"
          :style="{ background: stat.background }"
          @click="handleStatClick(stat)"
        >
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-info">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-section">
        <div class="chart-row">
          <div class="chart-card large">
            <h3 class="chart-title">📈 通知发布趋势</h3>
            <div ref="trendChartRef" class="chart-container"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">📊 部门发布排行</h3>
            <div ref="rankingChartRef" class="chart-container"></div>
          </div>
        </div>
        <div class="chart-row">
          <div class="chart-card">
            <h3 class="chart-title">📋 通知类型分布</h3>
            <div ref="typeChartRef" class="chart-container"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">👁️ 阅读情况统计</h3>
            <div ref="readChartRef" class="chart-container"></div>
          </div>
          <div class="chart-card">
            <h3 class="chart-title">⏰ 发布时段分析</h3>
            <div ref="timeChartRef" class="chart-container"></div>
          </div>
        </div>
      </div>

      <!-- 详细数据表格 -->
      <div class="data-table-section">
        <h3 class="table-title">📄 详细数据列表</h3>
        <div class="table-controls">
          <input 
            type="text" 
            v-model="searchTableQuery"
            placeholder="搜索报表..."
            class="table-search"
          >
          <select v-model="tablePageSize" class="page-size-select">
            <option :value="10">10 条/页</option>
            <option :value="20">20 条/页</option>
            <option :value="50">50 条/页</option>
          </select>
        </div>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>序号</th>
                <th>报表名称</th>
                <th>类型</th>
                <th>生成时间</th>
                <th>数据量</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in paginatedTableData" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>
                  <span :class="['type-tag', 'type-' + item.type]">
                    {{ item.typeLabel }}
                  </span>
                </td>
                <td>{{ item.createTime }}</td>
                <td>{{ item.dataSize }}</td>
                <td>
                  <span :class="['status-tag', 'status-' + item.status]">
                    {{ item.statusLabel }}
                  </span>
                </td>
                <td>
                  <button class="action-btn" @click="handleViewReport(item)">查看</button>
                  <button class="action-btn" @click="handleDownloadReport(item)">下载</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- 分页控件 -->
        <div class="pagination">
          <button 
            class="page-btn"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            上一页
          </button>
          <span class="page-info">
            第 {{ currentPage }} 页 / 共 {{ totalPages }} 页
          </span>
          <button 
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
    
    <!-- 页脚 -->
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
import { ref, computed, reactive, onMounted, nextTick} from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import HeaderNav from '../components/HeaderNav.vue'
import NavSearch from '../components/NavSearch.vue'
import FooterSection from '../components/FooterSection.vue'

// 初始化 Vue Router
const router = useRouter()

// 类型定义
interface NavItem {
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


// 导航数据 - 完整的导航菜单
const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '新闻中心', href: '/news' },
  { label: '通知公告', href: '/notice' },
  { label: '部门动态', href: '/department-news' },
  { label: '数据报表', href: '/data-report' }
]

const currentNav = ref(4) // 默认高亮"数据报表"（索引为4）
const searchQuery = ref('') // 导航栏搜索关键词
const selectedType = ref('all')
const selectedTimeRange = ref('month')
const searchTableQuery = ref('')
const tablePageSize = ref(10)
const currentPage = ref(1)

// Footer相关数据
const aboutText = '企业通知系统是公司官方信息发布平台，致力于及时、准确、全面地传递企业信息，促进内部沟通与交流。'

const socialLinks: SocialLink[] = [
  { icon: '💬', href: '#', platform: '微信' },
  { icon: '📧', href: '#', platform: '邮箱' },
  { icon: '🌐', href: '#', platform: '官网' }
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
      { label: '🎯 部门动态', href: '#' },
      { label: '📊 数据报表', href: '#' }
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

// 返回首页

// 处理导航点击
const handleNavClick = (index: number, href: string) => {
  currentNav.value = index
  
  // 使用 Vue Router 进行跳转
  if (href === '/' || href === '#home') {
    router.push({ name: 'Home' })
  } else if (href === '/news' || href === '#news') {
    // 跳转到首页并滚动到新闻中心
    router.push({ name: 'Home' }).then(() => {
      setTimeout(() => {
        const newsSection = document.getElementById('news')
        if (newsSection) {
          newsSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    })
  } else if (href === '/notice' || href === '#notice') {
    // 跳转到通知公告列表页
    router.push({ name: 'NoticeList' })
  } else if (href === '/department-news' || href === '#department') {
    // 跳转到部门动态页面
    router.push({ name: 'DepartmentNews' })
  } else if (href === '/data-report') {
    // 已在当前页面，不做跳转
  } else if (href === '#contact') {
    // 跳转到首页并滚动到联系我们
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

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索报表:', searchQuery.value)
    // TODO: 实现报表搜索逻辑
    alert(`搜索数据报表：${searchQuery.value}`)
  }
}

// 统计数据
const reportStats = reactive([
  { icon: '📊', number: '2,456', label: '总报表数', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { icon: '📈', number: '1,234', label: '通知统计', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { icon: '📉', number: '856', label: '新闻数据', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { icon: '👥', number: '366', label: '部门排行', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }
])

// 表格数据
const tableData = reactive([
  { name: '2024 年 3 月通知发布统计', type: 'notice', typeLabel: '通知统计', createTime: '2024-04-01 09:30', dataSize: '1,234 条', status: 'completed', statusLabel: '已完成' },
  { name: 'Q1 季度新闻阅读量分析', type: 'news', typeLabel: '新闻数据', createTime: '2024-04-01 10:15', dataSize: '5,678 条', status: 'completed', statusLabel: '已完成' },
  { name: '部门发布数量排行榜', type: 'department', typeLabel: '部门排行', createTime: '2024-04-01 14:20', dataSize: '156 条', status: 'updating', statusLabel: '更新中' },
  { name: '用户活跃度分析报告', type: 'user', typeLabel: '用户分析', createTime: '2024-04-01 16:45', dataSize: '2,345 条', status: 'completed', statusLabel: '已完成' },
  { name: '2024 年 2 月通知发布统计', type: 'notice', typeLabel: '通知统计', createTime: '2024-03-01 09:00', dataSize: '1,089 条', status: 'completed', statusLabel: '已完成' },
  { name: '热门新闻 TOP50 排行榜', type: 'news', typeLabel: '新闻数据', createTime: '2024-03-28 11:30', dataSize: '50 条', status: 'completed', statusLabel: '已完成' },
  { name: '行政部月度工作报告', type: 'department', typeLabel: '部门排行', createTime: '2024-03-25 15:00', dataSize: '45 条', status: 'completed', statusLabel: '已完成' },
  { name: '用户行为分析报表', type: 'user', typeLabel: '用户分析', createTime: '2024-03-20 10:20', dataSize: '3,456 条', status: 'failed', statusLabel: '失败' },
  { name: '2024 年 1 月通知统计', type: 'notice', typeLabel: '通知统计', createTime: '2024-02-01 09:15', dataSize: '987 条', status: 'completed', statusLabel: '已完成' },
  { name: '企业新闻传播效果分析', type: 'news', typeLabel: '新闻数据', createTime: '2024-02-28 16:30', dataSize: '4,567 条', status: 'completed', statusLabel: '已完成' },
  { name: '技术部项目进度报告', type: 'department', typeLabel: '部门排行', createTime: '2024-02-25 14:00', dataSize: '67 条', status: 'completed', statusLabel: '已完成' },
  { name: '用户增长趋势分析', type: 'user', typeLabel: '用户分析', createTime: '2024-02-20 11:45', dataSize: '2,890 条', status: 'completed', statusLabel: '已完成' }
])

// 计算属性
const filteredTableData = computed(() => {
  let data = tableData
  
  // 按类型筛选
  if (selectedType.value !== 'all') {
    data = data.filter(item => item.type === selectedType.value)
  }
  
  // 按搜索词筛选
  if (searchTableQuery.value) {
    const query = searchTableQuery.value.toLowerCase()
    data = data.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.typeLabel.toLowerCase().includes(query)
    )
  }
  
  return data
})

const totalPages = computed(() => Math.ceil(filteredTableData.value.length / tablePageSize.value))

const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * tablePageSize.value
  const end = start + tablePageSize.value
  return filteredTableData.value.slice(start, end)
})

// 图表实例
let trendChartInstance: echarts.ECharts | null = null
let rankingChartInstance: echarts.ECharts | null = null
let typeChartInstance: echarts.ECharts | null = null
let readChartInstance: echarts.ECharts | null = null
let timeChartInstance: echarts.ECharts | null = null

const trendChartRef = ref<HTMLDivElement | null>(null)
const rankingChartRef = ref<HTMLDivElement | null>(null)
const typeChartRef = ref<HTMLDivElement | null>(null)
const readChartRef = ref<HTMLDivElement | null>(null)
const timeChartRef = ref<HTMLDivElement | null>(null)

// 初始化图表
onMounted(() => {
  // 滚动到顶部
  window.scrollTo(0, 0)
  
  nextTick(() => {
    initTrendChart()
    initRankingChart()
    initTypeChart()
    initReadChart()
    initTimeChart()
    
    // 窗口大小改变时重新渲染图表
    window.addEventListener('resize', () => {
      trendChartInstance?.resize()
      rankingChartInstance?.resize()
      typeChartInstance?.resize()
      readChartInstance?.resize()
      timeChartInstance?.resize()
    })
  })
})

// 初始化通知趋势图
const initTrendChart = () => {
  if (!trendChartRef.value) return
  
  trendChartInstance = echarts.init(trendChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '发布数量',
      type: 'line',
      smooth: true,
      data: [120, 132, 101, 134, 90, 230, 210],
      itemStyle: {
        color: '#3498db'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(52, 152, 219, 0.3)' },
          { offset: 1, color: 'rgba(52, 152, 219, 0.01)' }
        ])
      }
    }]
  }
  trendChartInstance.setOption(option)
}

// 初始化部门排行图
const initRankingChart = () => {
  if (!rankingChartRef.value) return
  
  rankingChartInstance = echarts.init(rankingChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: ['技术部', '市场部', '财务部', '人力资源部', '行政部']
    },
    series: [{
      name: '发布数量',
      type: 'bar',
      data: [76, 87, 95, 128, 156],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#667eea' },
          { offset: 1, color: '#764ba2' }
        ])
      },
      barWidth: '60%'
    }]
  }
  rankingChartInstance.setOption(option)
}

// 初始化通知类型分布图
const initTypeChart = () => {
  if (!typeChartRef.value) return
  
  typeChartInstance = echarts.init(typeChartRef.value)
  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: '通知类型',
      type: 'pie',
      radius: '60%',
      data: [
        { value: 1048, name: '公司公告' },
        { value: 735, name: '部门通知' },
        { value: 580, name: '紧急通知' },
        { value: 484, name: '会议通知' },
        { value: 300, name: '其他' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  typeChartInstance.setOption(option)
}

// 初始化阅读情况统计图
const initReadChart = () => {
  if (!readChartRef.value) return
  
  readChartInstance = echarts.init(readChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['已读', '未读', '收藏', '转发']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '数量',
      type: 'bar',
      data: [18203, 2348, 2903, 10497],
      itemStyle: {
        color: function(params: any) {
          const colors = ['#3498db', '#e74c3c', '#f39c12', '#27ae60']
          return colors[params.dataIndex % colors.length]
        }
      }
    }]
  }
  readChartInstance.setOption(option)
}

// 初始化发布时段分析图
const initTimeChart = () => {
  if (!timeChartRef.value) return
  
  timeChartInstance = echarts.init(timeChartRef.value)
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0-6 点', '6-10 点', '10-12 点', '12-14 点', '14-18 点', '18-22 点', '22-24 点']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '发布数量',
      type: 'bar',
      data: [120, 532, 401, 334, 590, 230, 110],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#f093fb' },
          { offset: 1, color: '#f5576c' }
        ])
      }
    }]
  }
  timeChartInstance.setOption(option)
}

// 事件处理方法
const handleExport = () => {
  alert('正在导出报表，请稍候...')
  // TODO: 实现导出逻辑
}

const handleStatClick = (stat: any) => {
  alert(`查看 ${stat.label}: ${stat.number}`)
  // TODO: 实现详情查看
}

const handleViewReport = (item: any) => {
  alert(`查看报表：${item.name}`)
  // TODO: 实现查看逻辑
}

const handleDownloadReport = (item: any) => {
  alert(`下载报表：${item.name}`)
  // TODO: 实现下载逻辑
}

const handleSocialClick = (social: SocialLink) => {
  alert(`访问${social.platform}`)
  // TODO: 实现社交链接跳转
}

const handleFooterLink = (link: FooterLink) => {
  alert(`跳转到：${link.label}`)
  // TODO: 实现页脚链接跳转
}

</script>

<style scoped>
.data-report-page {
  font-family: 'Segoe UI', 'Microsoft YaHei', Arial, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  background-color: #f8f9fa;
  min-height: 100vh;
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

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  color: white;
  text-align: center;
}

.page-header-content h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.page-header-content p {
  font-size: 1.1rem;
  opacity: 0.95;
}

/* 主要内容区域 */
.main-content {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

/* 报表筛选 */
.report-filters {
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.08);
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: #7f8c8d;
}

.filter-select {
  padding: 0.6rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s;
}

.filter-select:hover {
  border-color: #3498db;
}

.export-btn {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 3px 15px rgba(0,0,0,0.08);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-icon {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.95rem;
  color: rgba(255,255,255,0.9);
}

/* 图表区域 */
.charts-section {
  margin-bottom: 30px;
}

.chart-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.08);
  transition: transform 0.3s;
}

.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

.chart-card.large {
  grid-column: span 2;
}

.chart-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ecf0f1;
}

.chart-container {
  height: 300px;
  width: 100%;
}

/* 数据表格区域 */
.data-table-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.08);
  margin-bottom: 40px;
}

.table-title {
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #ecf0f1;
}

.table-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 15px;
  flex-wrap: wrap;
}

.table-search {
  flex: 1;
  min-width: 200px;
  padding: 0.6rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
}

.table-search:focus {
  outline: none;
  border-color: #3498db;
}

.page-size-select {
  padding: 0.6rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table thead {
  background: #f8f9fa;
}

.data-table th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
}

.data-table td {
  padding: 15px;
  border-bottom: 1px solid #ecf0f1;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.type-tag, .status-tag {
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.type-notice { background: #e3f2fd; color: #1976d2; }
.type-news { background: #e8f5e9; color: #388e3c; }
.type-department { background: #fff3e0; color: #f57c00; }
.type-user { background: #f3e5f5; color: #7b1fa2; }

.status-completed { background: #e8f5e9; color: #388e3c; }
.status-updating { background: #fff3e0; color: #f57c00; }
.status-failed { background: #ffebee; color: #d32f2f; }

.action-btn {
  padding: 0.4rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  margin-right: 8px;
  transition: background 0.3s;
}

.action-btn:hover {
  background: #2980b9;
}

/* 分页控件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 2px solid #ecf0f1;
}

.page-btn {
  padding: 0.6rem 1.5rem;
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #3498db;
  color: #3498db;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #7f8c8d;
  font-size: 0.9rem;
}

/* 页脚 */
.footer {
  background: #2c3e50;
  color: #ecf0f1;
  padding: 30px 0;
  margin-top: 60px;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.footer-bottom p {
  margin-bottom: 10px;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    gap: 15px;
  }

  .nav-menu {
    width: 100%;
    justify-content: center;
  }

  .page-header-content h1 {
    font-size: 1.8rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .chart-row {
    grid-template-columns: 1fr;
  }

  .chart-card.large {
    grid-column: span 1;
  }

  .report-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
  }

  .filter-select {
    flex: 1;
  }

  .table-controls {
    flex-direction: column;
  }

  .table-search {
    width: 100%;
  }

  .data-table {
    font-size: 0.85rem;
  }

  .data-table th,
  .data-table td {
    padding: 10px 8px;
  }

  .action-btn {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }
}
</style>
