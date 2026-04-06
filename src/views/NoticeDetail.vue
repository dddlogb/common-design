<template>
  <div class="notice-detail-page">
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
          search-scope="notice"
          placeholder="搜索通知公告..."
          @search="handleSearch"
        />
      </template>
    </HeaderNav>

    <!-- 面包屑导航 -->
    <div class="breadcrumb-container">
      <div class="breadcrumb">
        <a href="#" @click.prevent="goBack">首页</a>
        <span class="separator">/</span>
        <a href="#" @click.prevent="goToNoticeList">通知公告</a>
        <span class="separator">/</span>
        <span class="current">通知详情</span>
      </div>
    </div>

    <!-- 通知详情主体 -->
    <div class="notice-content">
      <!-- 通知标题区域 -->
      <div class="notice-header">
        <h1 class="notice-title">{{ notice.title }}</h1>
        <div class="notice-meta">
          <span class="meta-item">
            <span class="icon">📅</span>
            发布时间：{{ notice.publishDate }}
          </span>
          <span class="meta-item">
            <span class="icon">👤</span>
            发布部门：{{ notice.department }}
          </span>
          <span class="meta-item">
            <span class="icon">👁️</span>
            阅读次数：{{ formatNumber(notice.views) }}
          </span>
          <span class="meta-item">
            <span class="icon">💬</span>
            评论数：{{ notice.comments }}
          </span>
        </div>
        <div class="priority-tags">
          <span 
            v-if="notice.priority === 'high'" 
            class="tag priority-high"
          >
            🔴 紧急
          </span>
          <span 
            v-if="notice.priority === 'medium'" 
            class="tag priority-medium"
          >
            🟡 重要
          </span>
          <span 
            v-if="notice.priority === 'low'" 
            class="tag priority-low"
          >
            🟢 普通
          </span>
          <span class="tag category">{{ notice.category }}</span>
        </div>
      </div>


      <!-- 通知正文 -->
      <div class="notice-body">
        <div class="notice-text" v-html="notice.content"></div>
        
        <!-- 图片 gallery -->
        <div v-if="notice.images && notice.images.length > 0" class="notice-images">
          <div 
            v-for="(img, index) in notice.images" 
            :key="index"
            class="image-item"
            @click="previewImage(index)"
          >
            <img :src="img.url" :alt="img.alt" />
          </div>
        </div>
      </div>
      
      <!-- 附件区域 -->
      <div v-if="notice.attachments && notice.attachments.length > 0" class="notice-attachments">
        <div class="attachments-title">📎 附件下载</div>
        <div class="attachment-list">
          <a 
            v-for="(file, index) in notice.attachments" 
            :key="index"
            :href="file.url"
            class="attachment-item"
            @click.prevent="downloadAttachment(file)"
          >
            <span class="file-icon">{{ getFileIcon(file.type) }}</span>
            <span class="file-name">{{ file.name }}</span>
            <span class="file-size">({{ file.size }})</span>
            <span class="download-icon">⬇️</span>
          </a>
        </div>
      </div>

      

      <!-- 相关通知 -->
      <div class="related-notices">
        <h3 class="section-title">📋 相关通知</h3>
        <ul class="related-list">
          <li v-for="(item, index) in relatedNotices" :key="index">
            <a href="#" @click.prevent="viewRelatedNotice(item)">
              <span class="date">{{ item.date }}</span>
              <span class="title">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- 分享和收藏 -->
      <div class="notice-actions">
        <div class="action-buttons">
          <button class="action-btn" @click="shareNotice">
            <span class="btn-icon">📤</span>
            分享
          </button>
          <button class="action-btn" @click="toggleFavorite">
            <span class="btn-icon">{{ isFavorite ? '⭐' : '☆' }}</span>
            {{ isFavorite ? '已收藏' : '收藏' }}
          </button>
          <button class="action-btn" @click="printNotice">
            <span class="btn-icon">🖨️</span>
            打印
          </button>
        </div>
      </div>

      <!-- 评论区 -->
      <div class="comments-section">
        <h3 class="section-title">💬 评论反馈 ({{ comments.length }})</h3>
        
        <!-- 发表评论 -->
        <div class="comment-form">
          <textarea 
            v-model="newComment"
            placeholder="写下您的评论..."
            rows="4"
            @keyup.ctrl.enter="submitComment"
          ></textarea>
          <div class="comment-actions">
            <button class="submit-btn" @click="submitComment">
              发表评论
            </button>
            <span class="hint">Ctrl + Enter 快速提交</span>
          </div>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div 
            v-for="(comment, index) in comments" 
            :key="index"
            class="comment-item"
          >
            <div class="comment-avatar">
              <img :src="comment.avatar" :alt="comment.author" />
            </div>
            <div class="comment-content">
              <div class="comment-header">
                <span class="author">{{ comment.author }}</span>
                <span class="department">{{ comment.department }}</span>
                <span class="time">{{ comment.time }}</span>
              </div>
              <div class="comment-text">{{ comment.content }}</div>
              <div class="comment-footer">
                <button class="reply-btn" @click="toggleReply(comment)">
                  {{ comment.showReply ? '取消' : '回复' }}
                </button>
                <button class="like-btn" @click="likeComment(comment)">
                  👍 {{ comment.likes }}
                </button>
              </div>
              
              <!-- 回复框 -->
              <div v-if="comment.showReply" class="reply-box">
                <input 
                  v-model="comment.replyContent"
                  type="text"
                  placeholder="回复评论..."
                  @keyup.enter="submitReply(comment)"
                />
                <button @click="submitReply(comment)">发送</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 侧边浮动工具栏 -->
    <div class="floating-toolbar">
      <button class="float-btn" @click="scrollToTop" title="返回顶部">
        ⬆️
      </button>
      <button class="float-btn" @click="toggleFontSize" title="调整字体">
        {{ fontSizeIndex === 0 ? 'A+' : fontSizeIndex === 1 ? 'A' : 'A-' }}
      </button>
      <button class="float-btn" @click="shareNotice" title="分享">
        📤
      </button>
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderNav from '../components/HeaderNav.vue'
import NavSearch from '../components/NavSearch.vue'
import FooterSection from '../components/FooterSection.vue'

const router = useRouter()

// 类型定义
interface NavItem {
  label: string
  href: string
}

interface Attachment {
  name: string
  url: string
  type: 'pdf' | 'doc' | 'xls' | 'zip'
  size: string
}

interface NoticeImage {
  url: string
  alt: string
}

interface RelatedNotice {
  id: number
  title: string
  date: string
}

interface Comment {
  id: number
  author: string
  avatar: string
  department: string
  content: string
  time: string
  likes: number
  liked: boolean
  showReply: boolean
  replyContent: string
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


// 响应式数据
const currentNav = ref(2) // 默认高亮"通知公告"（索引为2）
const searchQuery = ref('') // 搜索关键词
const isFavorite = ref(false)
const newComment = ref('')
const fontSizeIndex = ref(0) // 0: 大，1: 中，2: 小

const navItems: NavItem[] = [
  { label: '首页', href: '/' },
  { label: '新闻中心', href: '/news' },
  { label: '通知公告', href: '/notice' },
  { label: '部门动态', href: '/department-news' },
  { label: '数据报表', href: '/data-report' }
]

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

// 通知详情数据
const notice = reactive({
  id: 1,
  title: '关于 2026 年清明节放假安排的通知',
  publishDate: '2026-04-02 10:30',
  department: '行政部',
  views: 1256,
  comments: 23,
  priority: 'high',
  category: '放假通知',
  content: `
    <p>公司各部门：</p>
    
    <p>根据《国务院办公厅关于 2026 年部分节假日安排的通知》精神，结合公司实际情况，现将 2026 年清明节放假安排通知如下：</p>
    
    <h3>一、放假时间</h3>
    <p>2026 年 4 月 4 日（星期四）至 4 月 6 日（星期六）放假调休，共 3 天。4 月 7 日（星期日）上班。</p>
    
    <h3>二、注意事项</h3>
    <ol>
      <li>请各部门妥善安排好工作，确保节前各项工作正常完成。</li>
      <li>放假前请关闭电脑、空调等设备，切断电源，关好门窗。</li>
      <li>节假日期间，如有紧急工作安排，请提前与部门负责人沟通。</li>
      <li>外出请注意人身和财产安全，做好个人防护措施。</li>
    </ol>
    
    <h3>三、值班安排</h3>
    <p>节假日期间公司安排专人值班，如有紧急情况请联系：</p>
    <ul>
      <li>值班电话：010-8888 8888</li>
      <li>应急联系人：张经理 138****8888</li>
    </ul>
    
    <p>特此通知。</p>
    
    <p style="text-align: right; margin-top: 50px;">
      行政部<br>
      2026 年 4 月 2 日
    </p>
  `,
  attachments: [
    { name: '2026 年节假日安排表.pdf', url: '#', type: 'pdf', size: '1.2MB' },
    { name: '清明节值班表.docx', url: '#', type: 'doc', size: '256KB' }
  ] as Attachment[],
  images: [] as NoticeImage[]
})

// 相关通知
const relatedNotices = ref<RelatedNotice[]>([
  { id: 2, title: '关于 2026 年春节放假安排的通知', date: '2026-01-15' },
  { id: 3, title: '关于 2026 年五一劳动节放假的通知', date: '2026-04-20' },
  { id: 4, title: '关于加强节假日安全管理的通知', date: '2026-03-10' }
])

// 评论数据
const comments = ref<Comment[]>([
  {
    id: 1,
    author: '李明',
    avatar: 'https://ui-avatars.com/api/?name=李明&background=3498db&color=fff',
    department: '技术部',
    content: '收到，谢谢行政部的安排！',
    time: '2026-04-02 11:30',
    likes: 12,
    liked: false,
    showReply: false,
    replyContent: ''
  },
  {
    id: 2,
    author: '王芳',
    avatar: 'https://ui-avatars.com/api/?name=王芳&background=e74c3c&color=fff',
    department: '财务部',
    content: '已经安排好值班了，大家节日快乐！',
    time: '2026-04-02 14:20',
    likes: 8,
    liked: false,
    showReply: false,
    replyContent: ''
  }
])

// 方法
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
  } else if (href === '/notices' || href === '#notices') {
    router.push({ name: 'NoticeList' })
  } else if (href === '/departments' || href === '#departments') {
    router.push({ name: 'DepartmentNews' })
  } else if (href === '/data-report' || href === '#data-report') {
    router.push({ name: 'DataReport' })
  }
}

// 搜索处理
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    console.log('搜索通知公告:', searchQuery.value)
    // TODO: 实现通知搜索逻辑
    alert(`搜索通知公告：${searchQuery.value}`)
  }
}

const goBack = () => {
  // 使用 Vue Router 返回上一页
  router.back()
}

const goToNoticeList = () => {
  // 跳转到通知公告列表页
  router.push({ name: 'NoticeList' })
}

// Footer相关事件处理
const handleSocialClick = (social: SocialLink) => {
  alert(`访问${social.platform}`)
  // TODO: 实现社交链接跳转
}

const handleFooterLink = (link: FooterLink) => {
  alert(`跳转到：${link.label}`)
  // TODO: 实现页脚链接跳转
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}

const downloadAttachment = (file: Attachment) => {
  alert(`开始下载：${file.name}`)
  // TODO: 实现文件下载
}

const getFileIcon = (type: string): string => {
  const icons: Record<string, string> = {
    pdf: '📕',
    doc: '📘',
    xls: '📗',
    zip: '📦'
  }
  return icons[type] || '📄'
}

const previewImage = (index: number) => {
  alert(`预览图片 ${index + 1}`)
  // TODO: 实现图片预览功能
}

const viewRelatedNotice = (item: RelatedNotice) => {
  // 跳转到相关通知详情页
  router.push({ 
    name: 'NoticeDetail', 
    params: { id: item.id }
  })
}

const shareNotice = () => {
  if (navigator.share) {
    navigator.share({
      title: notice.title,
      text: notice.title,
      url: window.location.href
    })
  } else {
    // 复制到剪贴板
    navigator.clipboard.writeText(`${notice.title}\n${window.location.href}`)
    alert('链接已复制到剪贴板')
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  alert(isFavorite.value ? '已加入收藏夹' : '已取消收藏')
}

const printNotice = () => {
  window.print()
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleFontSize = () => {
  fontSizeIndex.value = (fontSizeIndex.value + 1) % 3
  const sizes = ['large', 'medium', 'small']
  document.querySelector('.notice-text')?.classList.remove(...sizes)
  document.querySelector('.notice-text')?.classList.add(sizes[fontSizeIndex.value])
}

const submitComment = () => {
  if (!newComment.value.trim()) return
  
  const comment: Comment = {
    id: comments.value.length + 1,
    author: '当前用户',
    avatar: 'https://ui-avatars.com/api/?name=当前用户&background=2ecc71&color=fff',
    department: '当前部门',
    content: newComment.value,
    time: new Date().toLocaleString('zh-CN'),
    likes: 0,
    liked: false,
    showReply: false,
    replyContent: ''
  }
  
  comments.value.unshift(comment)
  newComment.value = ''
  notice.comments++
}

const toggleReply = (comment: Comment) => {
  comment.showReply = !comment.showReply
}

const submitReply = (comment: Comment) => {
  if (!comment.replyContent.trim()) return
  alert(`回复 ${comment.author}: ${comment.replyContent}`)
  comment.showReply = false
  comment.replyContent = ''
}

const likeComment = (comment: Comment) => {
  if (comment.liked) {
    comment.likes--
    comment.liked = false
  } else {
    comment.likes++
    comment.liked = true
  }
}

onMounted(() => {
  // TODO: 从 API 加载通知详情
  console.log('加载通知详情:', notice.id)
})
</script>

<style scoped>
.notice-detail-page {
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

/* 通知内容区域 */
.notice-content {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

/* 通知头部 */
.notice-header {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.notice-title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.4;
}

.notice-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ecf0f1;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.meta-item .icon {
  font-size: 1.1rem;
}

.priority-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.priority-high {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
}

.priority-medium {
  background: linear-gradient(135deg, #f39c12, #f39c12);
  color: white;
}

.priority-low {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: white;
}

.category {
  background: #3498db;
  color: white;
}

/* 附件区域 */
.notice-attachments {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.attachments-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 15px;
}

.attachment-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s;
}

.attachment-item:hover {
  background: #3498db;
  color: white;
  transform: translateX(5px);
}

.file-icon {
  font-size: 1.5rem;
}

.file-name {
  flex: 1;
  font-weight: 500;
}

.file-size {
  color: #95a5a6;
  font-size: 0.85rem;
}

.download-icon {
  font-size: 1.2rem;
}

/* 通知正文 */
.notice-body {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.notice-text {
  font-size: 1rem;
  line-height: 1.8;
  color: #2c3e50;
}

.notice-text p {
  margin-bottom: 20px;
}

.notice-text h3 {
  font-size: 1.3rem;
  color: #2c3e50;
  margin: 30px 0 15px;
  font-weight: 600;
}

.notice-text ol,
.notice-text ul {
  margin: 15px 0;
  padding-left: 30px;
}

.notice-text li {
  margin-bottom: 10px;
}

.notice-text.large {
  font-size: 1.1rem;
}

.notice-text.medium {
  font-size: 1rem;
}

.notice-text.small {
  font-size: 0.9rem;
}

.notice-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 30px;
}

.image-item {
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.image-item:hover {
  transform: scale(1.05);
}

.image-item img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

/* 相关通知 */
.related-notices {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.section-title {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
}

.related-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.related-list li a {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s;
}

.related-list li a:hover {
  background: #3498db;
  color: white;
  transform: translateX(5px);
}

.related-list .date {
  min-width: 100px;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.related-list .title {
  flex: 1;
  font-weight: 500;
}

/* 操作按钮 */
.notice-actions {
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.action-buttons {
  display: flex;
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 25px;
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;
  font-weight: 500;
  color: #7f8c8d;
}

.action-btn:hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 评论区 */
.comments-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #e9ecef;
  border-radius: 10px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.95rem;
  margin-bottom: 15px;
  transition: border-color 0.3s;
}

.comment-form textarea:focus {
  outline: none;
  border-color: #3498db;
}

.comment-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submit-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.4);
}

.hint {
  color: #95a5a6;
  font-size: 0.85rem;
}

/* 评论列表 */
.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s;
}

.comment-item:hover {
  background: white;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 10px;
}

.comment-header .author {
  font-weight: 600;
  color: #2c3e50;
}

.comment-header .department {
  color: #7f8c8d;
  font-size: 0.85rem;
}

.comment-header .time {
  color: #95a5a6;
  font-size: 0.85rem;
  margin-left: auto;
}

.comment-text {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 15px;
}

.comment-footer {
  display: flex;
  gap: 15px;
}

.reply-btn,
.like-btn {
  padding: 6px 15px;
  background: transparent;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.reply-btn:hover,
.like-btn:hover {
  border-color: #3498db;
  color: #3498db;
  background: #f8f9fa;
}

.like-btn.liked {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

/* 回复框 */
.reply-box {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.reply-box input {
  flex: 1;
  padding: 10px 15px;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  font-size: 0.9rem;
}

.reply-box input:focus {
  outline: none;
  border-color: #3498db;
}

.reply-box button {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.reply-box button:hover {
  background: #2980b9;
}

/* 浮动工具栏 */
.floating-toolbar {
  position: fixed;
  right: 30px;
  bottom: 50px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 999;
}

.float-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e9ecef;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.float-btn:hover {
  background: #3498db;
  color: white;
  border-color: #3498db;
  transform: translateY(-3px);
}

/* 响应式设计 */
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

  .notice-title {
    font-size: 1.5rem;
  }

  .notice-header,
  .notice-body,
  .notice-attachments {
    padding: 25px;
  }

  .notice-meta {
    flex-direction: column;
    gap: 10px;
  }

  .comment-item {
    flex-direction: column;
  }

  .floating-toolbar {
    right: 20px;
    bottom: 30px;
  }

  .float-btn {
    width: 45px;
    height: 45px;
  }
}
</style>
