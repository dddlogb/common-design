<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import NavSearch from '../components/NavSearch.vue'
import FooterSection from '../components/FooterSection.vue'
import { useRouter, useRoute } from 'vue-router'

// 初始化 Vue Router
const router = useRouter()
const route = useRoute()

// 类型定义
interface NewsItem {
  id: number
  icon: string
  category: string
  title: string
  excerpt: string
  content: string
  author: string
  department: string
  date: string
  views: number
  comments: number
  likes: number
  tags: string[]
  relatedNews?: RelatedNewsItem[]
}

interface RelatedNewsItem {
  id: number
  title: string
  date: string
  views: number
}

interface Comment {
  id: number
  author: string
  department: string
  avatar: string
  content: string
  date: string
  likes: number
  replies: Reply[]
  isPinned?: boolean // 是否置顶
}

interface Reply {
  id: number
  author: string
  content: string
  date: string
  isAuthor: boolean
}

// Props
const props = defineProps<{
  newsId?: number | string
}>()

// Emits
const emit = defineEmits<{
  (e: 'back'): void
}>()

// 从路由参数获取新闻 ID
const getNewsId = () => {
  // 优先使用路由参数
  if (route.params.id) {
    return Number(route.params.id)
  }
  // 其次使用 props
  if (props.newsId) {
    return typeof props.newsId === 'string' ? parseInt(props.newsId) : props.newsId
  }
  // 默认为 1
  return 1
}

// 模拟新闻数据 - 实际项目中应该从 API 获取
const newsData = ref<NewsItem>({
  id: getNewsId(),
  icon: '📰',
  category: '公司新闻',
  title: '公司召开 2024 年度战略规划会议，明确未来发展目标',
  excerpt: '本次会议深入分析了当前市场形势，制定了新一年的发展战略和重点工作任务，为公司的可持续发展奠定了坚实基础...',
  content: `
    <p>2024 年 3 月 28 日，公司在总部大楼多功能会议厅召开了 2024 年度战略规划会议。公司董事长、总经理、各部门负责人及业务骨干共计 150 余人参加了此次会议。</p>
    
    <h2>一、会议背景</h2>
    <p>本次会议是在公司面临新的市场机遇和挑战的背景下召开的。随着行业的快速发展和市场竞争的加剧，公司需要明确新的发展战略，优化业务结构，提升核心竞争力。</p>
    
    <h2>二、主要内容</h2>
    <p><strong>1. 董事长致辞</strong></p>
    <p>董事长在致辞中回顾了公司过去一年的发展历程，对全体员工付出的辛勤努力表示感谢。他指出，2023 年公司取得了令人瞩目的成绩，营业收入同比增长 25%,市场份额稳步提升。</p>
    
    <p><strong>2. 总经理工作报告</strong></p>
    <p>总经理作了题为《凝心聚力、开拓创新，推动公司高质量发展》的工作报告。报告从经营业绩、市场开拓、技术创新、管理提升等方面总结了 2023 年的工作，并部署了 2024 年的重点任务。</p>
    
    <p><strong>3. 战略规划解读</strong></p>
    <p>战略发展部负责人详细解读了公司《2024-2026 年三年发展战略规划》。规划明确提出，到 2026 年，公司要实现以下目标:</p>
    <ul>
      <li>营业收入突破 10 亿元，年均增长率不低于 20%</li>
      <li>研发投入占营业收入比重达到 8% 以上</li>
      <li>新增专利 50 项以上，核心技术达到行业领先水平</li>
      <li>客户满意度保持在 95% 以上</li>
      <li>员工满意度达到 90% 以上</li>
    </ul>
    
    <p><strong>4. 签订目标责任书</strong></p>
    <p>会上，公司总经理与各部门负责人签订了 2024 年度目标责任书，明确了各部门的年度考核指标和工作任务。</p>
    
    <h2>三、分组讨论</h2>
    <p>下午，参会人员分成 5 个小组，围绕总经理工作报告和战略规划进行了深入讨论。大家结合各自工作实际，就如何落实会议精神、完成目标任务提出了意见建议。</p>
    
    <h2>四、会议总结</h2>
    <p>会议最后，董事长作了总结讲话。他强调，全体干部员工要:</p>
    <ol>
      <li>统一思想，提高认识，切实增强责任感和使命感</li>
      <li>聚焦目标，突出重点，全力抓好各项工作落实</li>
      <li>勇于创新，敢于担当，不断提升工作能力和水平</li>
      <li>团结协作，形成合力，共同推动公司发展迈上新台阶</li>
    </ol>
    
    <p>此次会议的召开，为公司新一年的发展指明了方向，明确了路径。相信在公司领导班子的带领下，在全体员工的共同努力下，公司一定能够实现既定目标，创造更加辉煌的业绩!</p>
  `,
  author: '行政部',
  department: '总裁办',
  date: '2024-04-02 09:30',
  views: 1256,
  comments: 45,
  likes: 328,
  tags: ['战略规划', '年度会议', '发展目标', '企业经营'],
  relatedNews: [
    { id: 2, title: '公司与多家知名企业签署战略合作协议', date: '2024-03-28', views: 2089 },
    { id: 3, title: '公司研发中心正式投入使用', date: '2024-03-25', views: 1567 },
    { id: 4, title: '公司荣获"行业创新企业"称号', date: '2024-03-20', views: 1823 },
    { id: 5, title: '公司举办 2024 年春季校园招聘活动', date: '2024-03-15', views: 1234 }
  ]
})

// 评论数据
const comments = ref<Comment[]>([
  {
    id: 1,
    author: '张三',
    department: '技术部',
    avatar: '👨‍💼',
    content: '这次会议让我们对公司的未来发展充满了信心！作为技术部的一员，我会努力工作，为公司的发展贡献自己的力量。',
    date: '2024-04-02 10:15',
    likes: 25,
    replies: [
      {
        id: 1,
        author: '李四',
        content: '张工说得对！我们一起加油！',
        date: '2024-04-02 10:30',
        isAuthor: false
      }
    ],
    isPinned: true // 置顶评论
  },
  {
    id: 2,
    author: '王五',
    department: '市场部',
    avatar: '👩‍💼',
    content: '战略目标很清晰，关键是要落实到位。市场部一定会全力以赴完成年度目标!',
    date: '2024-04-02 11:20',
    likes: 18,
    replies: [],
    isPinned: false
  },
  {
    id: 3,
    author: '赵六',
    department: '行政部',
    avatar: '👨‍💼',
    content: '会议组织得很好，内容充实，收获很大。希望公司越来越好!',
    date: '2024-04-02 14:05',
    likes: 12,
    replies: [],
    isPinned: false
  }
])

// 响应式数据
const currentNav = ref(1) // 默认高亮"新闻中心"（索引为1）
const searchQuery = ref('')
const showCommentForm = ref(false)
const newComment = ref('')
const likedComments = ref<number[]>([])
const replyingTo = ref<{ commentId: number; commentAuthor: string } | null>(null)
const newReplyContent = ref('')

// 导航数据
const navItems = [
  { label: '首页', href: '#home' },
  { label: '新闻中心', href: '#news' },
  { label: '通知公告', href: '/notice' },
  { label: '部门动态', href: '/department-news' },
  { label: '数据报表', href: '/data-report' },
  { label: '联系我们', href: '#contact' }
]

// 页脚数据
const aboutText = '企业通知系统是公司官方信息发布平台，致力于及时、准确、全面地传递企业信息，促进内部沟通与交流。'
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
      { label: '🏢 部门动态', href: '#' },
      { label: '📋 政策法规', href: '#' }
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
const footerInfo = {
  email: 'contact@company.com',
  phone: '010-8888 8888',
  address: '北京市朝阳区建国路 88 号',
  icp: '京 ICP 备 XXXXXXXX 号',
  police: '京公网安备 XXXXXXXXXXXXXX 号'
}

// 计算属性
const formattedViews = computed(() => {
  return newsData.value.views.toLocaleString()
})

const formattedLikes = computed(() => {
  return newsData.value.
  likes.toLocaleString()
})

const formattedComments = computed(() => {
  return newsData.value.comments.toLocaleString()
})

// 排序后的评论列表 (置顶的在前)
const sortedComments = computed(() => {
  return [...comments.value].sort((a, b) => {
    // 置顶的排在前面
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    // 都不是置顶，按原顺序
    return 0
  })
})

// 方法
const handleBack = () => {
  // 返回首页，使用 Vue Router
  router.push({ name: 'Home' })
}

const handleNavClick = (index: number, href: string) => {
  currentNav.value = index
  
  // 根据导航链接跳转到不同位置
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
  }
}

const handleLike = () => {
  newsData.value.likes++
}

const handleCommentLike = (commentId: number) => {
  const index = likedComments.value.indexOf(commentId)
  if (index === -1) {
    comments.value.find(c => c.id === commentId)!.likes++
    likedComments.value.push(commentId)
  } else {
    comments.value.find(c => c.id === commentId)!.likes--
    likedComments.value.splice(index, 1)
  }
}

const submitComment = () => {
  if (!newComment.value.trim()) return
  
  const comment: Comment = {
    id: comments.value.length + 1,
    author: '当前用户',
    department: '所在部门',
    avatar: '😊',
    content: newComment.value,
    date: new Date().toLocaleString('zh-CN'),
    likes: 0,
    replies: []
  }
  comments.value.push(comment) // 应被添加到末尾
  newComment.value = ''
  showCommentForm.value = false
  newsData.value.comments++
}

// 开始回复某条评论
const startReply = (commentId: number, commentAuthor: string) => {
  replyingTo.value = { commentId, commentAuthor }
  newReplyContent.value = ''
}

// 取消回复
const cancelReply = () => {
  replyingTo.value = null
  newReplyContent.value = ''
}

// 提交回复
const submitReply = () => {
  if (!newReplyContent.value.trim() || !replyingTo.value) return
  
  const commentIndex = comments.value.findIndex(c => c.id === replyingTo.value!.commentId)
  if (commentIndex === -1) return
  
  const comment = comments.value[commentIndex]
  
  const reply: Reply = {
    id: comment.replies.length + 1,
    author: '当前用户',
    content: newReplyContent.value,
    date: new Date().toLocaleString('zh-CN'),
    isAuthor: false
  }
  
  // 使用 splice 方法确保响应式更新，将新回复追加到回复列表的末尾
  comment.replies.splice(comment.replies.length, 0, reply)
  
  // 清空输入框并关闭回复表单
  newReplyContent.value = ''
  replyingTo.value = null
}

const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

// 组件挂载时和路由参数变化时滚动到顶部
onMounted(() => {
  // 立即滚动到顶部
  window.scrollTo(0, 0)
})

// 监听路由参数变化
watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    // 路由参数变化时，滚动到顶部
    window.scrollTo(0, 0)
  }
}, { immediate: true })

</script>

<template>
  <div class="news-detail-page">
    <!-- 顶部导航栏 -->
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
          search-scope="news"
          placeholder="搜索新闻中心..."
          @search="handleSearch"
        />
      </template>
    </HeaderNav>

    <!-- 页面标题 -->
    <section class="page-header">
      <div class="page-header-content">
        <button class="back-btn" @click="handleBack">
          ← 返回主页
        </button>
        <span class="category-tag">{{ newsData.category }}</span>
        <h1>{{ newsData.title }}</h1>
        <div class="news-meta">
          <span>👤 {{ newsData.author }} ({{ newsData.department }})</span>
          <span>📅 {{ newsData.date }}</span>
          <span>👁️ {{ formattedViews }} 阅读</span>
          <span>💬 {{ formattedComments }} 评论</span>
          <span>❤️ {{ formattedLikes }} 点赞</span>
        </div>
      </div>
    </section>

    <!-- 主要内容区域 -->
    <div class="main-container">
      <!-- 新闻内容 -->
      <article class="news-content-wrapper">
        <div class="news-content-text" v-html="newsData.content"></div>
        
        <!-- 标签 -->
        <div class="news-tags">
          <span class="tag-label">标签:</span>
          <span 
            v-for="(tag, index) in newsData.tags" 
            :key="index"
            class="tag-item"
          >
            #{{ tag }}
          </span>
        </div>

        <!-- 点赞按钮 -->
        <div class="action-bar">
          <button class="like-btn" @click="handleLike">
            ❤️ 点赞 ({{ formattedLikes }})
          </button>
          <button class="share-btn">
            🔗 分享
          </button>
        </div>

        <!-- 评论区 -->
        <div class="comments-section">
          <h3 class="comments-title">💬 评论 ({{ formattedComments }})</h3>
          
          <!-- 发表评论 -->
          <div class="comment-form-wrapper">
            <button 
              v-if="!showCommentForm" 
              class="write-comment-btn"
              @click="showCommentForm = true"
            >
              ✍️ 发表评论
            </button>
            <div v-else class="comment-form">
              <textarea 
                v-model="newComment"
                placeholder="写下你的评论..."
                rows="4"
                class="comment-input"
              ></textarea>
              <div class="comment-actions">
                <button class="cancel-btn" @click="showCommentForm = false">取消</button>
                <button class="submit-btn" @click="submitComment">发表</button>
              </div>
            </div>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
            <div 
              v-for="comment in sortedComments" 
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-avatar">{{ comment.avatar }}</div>
              <div class="comment-body">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-department">{{ comment.department }}</span>
                  <span class="comment-date">{{ comment.date }}</span>
                  <!-- 置顶标识 (仅展示) -->
                  <span 
                    v-if="comment.isPinned"
                    class="pin-badge"
                  >
                    📌 置顶
                  </span>
                </div>
                <p class="comment-text">{{ comment.content }}</p>
                <div class="comment-footer">
                  <button 
                    class="comment-like-btn"
                    :class="{ liked: likedComments.includes(comment.id) }"
                    @click="handleCommentLike(comment.id)"
                  >
                    👍 {{ comment.likes }}
                  </button>
                  <button class="reply-btn" @click="startReply(comment.id, comment.author)">
                    回复
                  </button>
                </div>

                <!-- 回复输入框 -->
                <div v-if="replyingTo && replyingTo.commentId === comment.id" class="reply-form">
                  <textarea 
                    v-model="newReplyContent"
                    :placeholder="`回复给 ${replyingTo.commentAuthor}...`"
                    rows="3"
                    class="reply-input"
                  ></textarea>
                  <div class="reply-actions">
                    <button class="cancel-reply-btn" @click="cancelReply">取消</button>
                    <button class="submit-reply-btn" @click="submitReply">发表回复</button>
                  </div>
                </div>

                <!-- 回复列表 -->
                <div v-if="comment.replies.length > 0" class="replies-list">
                  <div 
                    v-for="reply in comment.replies" 
                    :key="reply.id"
                    class="reply-item"
                    :class="{ 'reply-author': reply.isAuthor }"
                  >
                    <span class="reply-author-name">{{ reply.author }}:</span>
                    <span class="reply-content">{{ reply.content }}</span>
                    <span class="reply-date">{{ reply.date }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>

      <!-- 侧边栏 -->
      <aside class="sidebar">
        <!-- 相关新闻 -->
        <div class="widget related-news">
          <h3 class="widget-title">📰 相关新闻</h3>
          <ul class="related-list">
            <li 
              v-for="news in newsData.relatedNews" 
              :key="news.id"
              class="related-item"
            >
              <a href="#" class="related-link">
                <span class="related-title">{{ news.title }}</span>
                <span class="related-meta">
                  <span>{{ news.date }}</span>
                  <span>👁️ {{ formatNumber(news.views) }}</span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <!-- 热门标签 -->
        <div class="widget hot-tags">
          <h3 class="widget-title">🏷️ 热门标签</h3>
          <div class="tags-cloud">
            <span 
              v-for="tag in newsData.tags" 
              :key="tag"
              class="tag-cloud-item"
            >
              #{{ tag }}
            </span>
            <span class="tag-cloud-item">#企业发展</span>
            <span class="tag-cloud-item">#团队建设</span>
            <span class="tag-cloud-item">#企业文化</span>
          </div>
        </div>
      </aside>
    </div>

    <!-- 页脚 -->
    <FooterSection 
      :about-text="aboutText"
      :social-links="socialLinks"
      :footer-sections="footerSections"
      :footer-info="footerInfo"
      @social-click="() => {}"
      @footer-link-click="() => {}"
    />
  </div>
</template>

<style scoped>
.news-detail-page {
  min-height: 100vh;
  background: #f5f6fa;
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px 60px;
  color: white;
}

.page-header-content {
  max-width: 1200px;
  margin: 0 auto;
}

.back-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.back-btn:hover {
  background: rgba(255,255,255,0.3);
}

.category-tag {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  margin-bottom: 15px;
}

.page-header h1 {
  font-size: 2rem;
  line-height: 1.4;
  margin-bottom: 20px;
}

.news-meta {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 主内容区 */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 30px;
}

/* 新闻内容 */
.news-content-wrapper {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.news-content-text {
  line-height: 2;
  color: #2c3e50;
}

.news-content-text p {
  margin-bottom: 20px;
  text-align: justify;
}

.news-content-text h2 {
  color: #3498db;
  margin: 30px 0 15px;
  font-size: 1.5rem;
  border-left: 4px solid #3498db;
  padding-left: 15px;
}

.news-content-text ul,
.news-content-text ol {
  margin: 15px 0;
  padding-left: 30px;
}

.news-content-text li {
  margin-bottom: 10px;
}

/* 标签 */
.news-tags {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ecf0f1;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.tag-label {
  color: #7f8c8d;
  font-weight: bold;
}

.tag-item {
  background: #3498db;
  color: white;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
}

/* 操作栏 */
.action-bar {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #ecf0f1;
  display: flex;
  gap: 15px;
}

.like-btn,
.share-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.like-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.like-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
}

.share-btn {
  background: #ecf0f1;
  color: #2c3e50;
}

.share-btn:hover {
  background: #bdc3c7;
}

/* 评论区 */
.comments-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 3px solid #ecf0f1;
}

.comments-title {
  font-size: 1.4rem;
  color: #2c3e50;
  margin-bottom: 25px;
}

.comment-form-wrapper {
  margin-bottom: 30px;
}

.write-comment-btn {
  width: 100%;
  padding: 12px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.write-comment-btn:hover {
  background: #2980b9;
}

.comment-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 5px;
}

.comment-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: border-color 0.3s;
}

.comment-input:focus {
  outline: none;
  border-color: #3498db;
}

.comment-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 15px;
}

.cancel-btn,
.submit-btn {
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.cancel-btn {
  background: #ecf0f1;
  color: #7f8c8d;
}

.cancel-btn:hover {
  background: #bdc3c7;
}

.submit-btn {
  background: #3498db;
  color: white;
}

.submit-btn:hover {
  background: #2980b9;
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
  border-radius: 8px;
}

.comment-avatar {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.comment-author {
  font-weight: bold;
  color: #2c3e50;
  font-size: 1.05rem;
}

.comment-department {
  color: #7f8c8d;
  font-size: 0.85rem;
  background: #ecf0f1;
  padding: 3px 8px;
  border-radius: 3px;
}

.comment-date {
  color: #95a5a6;
  font-size: 0.85rem;
}

.comment-text {
  line-height: 1.8;
  color: #2c3e50;
  margin-bottom: 15px;
  text-align: left;
}

.comment-footer {
  display: flex;
  gap: 15px;
}

.comment-like-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #7f8c8d;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s;
}

.comment-like-btn:hover,
.comment-like-btn.liked {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.reply-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #3498db;
  font-size: 0.9rem;
  padding: 5px 10px;
  border-radius: 5px;
  transition: all 0.3s;
}

.reply-btn:hover {
  background: rgba(52, 152, 219, 0.1);
}

/* 回复输入框 */
.reply-form {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.reply-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e0e0e0;
  border-radius: 5px;
  font-family: inherit;
  font-size: 0.9rem;
  resize: vertical;
  transition: border-color 0.3s;
}

.reply-input:focus {
  outline: none;
  border-color: #3498db;
}

.reply-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 10px;
}

.cancel-reply-btn,
.submit-reply-btn {
  padding: 6px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.cancel-reply-btn {
  background: #ecf0f1;
  color: #7f8c8d;
}

.cancel-reply-btn:hover {
  background: #bdc3c7;
}

.submit-reply-btn {
  background: #3498db;
  color: white;
}

.submit-reply-btn:hover {
  background: #2980b9;
}

/* 回复列表 */
.replies-list {
  margin-top: 15px;
  padding-left: 20px;
  border-left: 2px solid #ecf0f1;
}

.reply-item {
  padding: 12px;
  background: white;
  border-radius: 5px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  text-align: left;
}

.reply-item.reply-author {
  background: rgba(52, 152, 219, 0.05);
  border-left: 3px solid #3498db;
}

.reply-author-name {
  font-weight: bold;
  color: #2c3e50;
  margin-right: 8px;
}

.reply-content {
  color: #34495e;
  margin-right: 10px;
}

.reply-date {
  color: #95a5a6;
  font-size: 0.8rem;
}

/* 侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.widget {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.widget-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #3498db;
}

.related-list {
  list-style: none;
  padding: 0;
}

.related-item {
  margin-bottom: 15px;
}

.related-link {
  display: block;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 5px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s;
}

.related-link:hover {
  background: #ecf0f1;
  transform: translateX(5px);
}

.related-title {
  display: block;
  font-size: 0.95rem;
  margin-bottom: 8px;
  line-height: 1.5;
}

.related-meta {
  display: flex;
  gap: 15px;
  font-size: 0.8rem;
  color: #95a5a6;
}

/* 热门标签 */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-cloud-item {
  background: #ecf0f1;
  color: #7f8c8d;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  transition: all 0.3s;
  cursor: pointer;
}

.tag-cloud-item:hover {
  background: #3498db;
  color: white;
}

/* 置顶徽章 */
.pin-badge {
  background: white;
  color: #e74c3c;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
  border: 2px solid #e74c3c;
  box-shadow: 0 2px 6px rgba(231, 76, 60, 0.2);
}

.pin-badge:hover {
  background: rgba(231, 76, 60, 0.1);
  border-color: #e74c3c;
  color: #e74c3c;
}

.pin-badge.pinned {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.pin-badge.pinned:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 87, 108, 0.4);
}

/* 响应式设计 */
@media (max-width: 992px) {
  .main-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
  }
  
  .page-header h1 {
    font-size: 1.6rem;
  }
}

@media (max-width: 768px) {
  .news-content-wrapper {
    padding: 25px;
  }
  
  .news-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-bar {
    flex-direction: column;
  }
  
  .like-btn,
  .share-btn {
    width: 100%;
  }
  
  .comment-item {
    flex-direction: column;
  }
  
  .comment-avatar {
    font-size: 2rem;
  }
}

@media (max-width: 600px) {
  .page-header {
    padding: 30px 15px 40px;
  }
  
  .page-header h1 {
    font-size: 1.4rem;
  }
  
  .main-container {
    padding: 20px 15px;
  }
}
</style>
