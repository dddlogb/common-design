<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderNav from '../components/HeaderNav.vue'
import NavSearch from '../components/NavSearch.vue'
import FooterSection from '../components/FooterSection.vue'

const router = useRouter()
const route = useRoute()

interface DepartmentNewsDetail {
  id: number
  department: string
  departmentIcon: string
  title: string
  content: string
  publishDate: string
  author: string
  views: number
  attachments?: Array<{
    id: number
    name: string
    size: string
  }>
  relatedNews?: Array<{
    id: number
    title: string
    date: string
    department: string
  }>
}

const props = defineProps<{
  newsId?: number | string
}>()

const getNewsId = () => {
  if (route.params.id) {
    return Number(route.params.id)
  }
  if (props.newsId) {
    return typeof props.newsId === 'string' ? parseInt(props.newsId) : props.newsId
  }
  return 1
}

const getNewsById = (id: number): DepartmentNewsDetail => {
  const newsMap: Record<number, DepartmentNewsDetail> = {
    1: {
      id: 1,
      department: '行政部',
      departmentIcon: '🏢',
      title: '行政部召开 2026 年第一季度工作总结会议',
      content: `
        <p>4 月 1 日，行政部在会议室召开 2026 年第一季度工作总结会议，全面总结第一季度工作成果，部署第二季度重点工作任务。</p>
        
        <h2>一、第一季度工作回顾</h2>
        <p>会议指出，2026 年第一季度，行政部紧紧围绕公司中心工作，认真履行部门职责，在以下几个方面取得了显著成效:</p>
        
        <h3>1. 行政管理方面</h3>
        <ul>
          <li>完善规章制度 3 项，优化工作流程 5 个</li>
          <li>组织各类会议 28 次，接待来访 15 批次</li>
          <li>文件处理及时率达到 100%，准确率 99.8%</li>
        </ul>
        
        <h3>2. 后勤保障方面</h3>
        <ul>
          <li>完成办公区域绿化改造，改善工作环境</li>
          <li>加强食堂管理，员工满意度提升至 96%</li>
          <li>车辆调度合理，安全行驶无事故</li>
        </ul>
        
        <h3>3. 安全工作方面</h3>
        <ul>
          <li>开展安全检查 12 次，排查整改隐患 8 处</li>
          <li>组织消防演练 1 次，参与人数 120 人</li>
          <li>完善应急预案，提高应急处置能力</li>
        </ul>
        
        <h2>二、第二季度工作安排</h2>
        <p>会议强调，第二季度要重点抓好以下工作:</p>
        
        <h3>1. 提升管理效能</h3>
        <ul>
          <li>推进制度建设，完善管理体系</li>
          <li>加强信息化建设，提高工作效率</li>
          <li>强化督查督办，确保工作落实</li>
        </ul>
        
        <h3>2. 优化后勤服务</h3>
        <ul>
          <li>持续改善就餐质量，提升服务水平</li>
          <li>加强车辆管理，保障用车需求</li>
          <li>做好防暑降温准备工作</li>
        </ul>
        
        <p>会议号召，全体人员要以更加饱满的热情、更加务实的作风、更加有力的举措，扎实做好各项工作，为公司高质量发展贡献力量!</p>
        
        <p style="text-align: right; margin-top: 40px;">行政部</p>
        <p style="text-align: right;">2026 年 4 月 1 日</p>
      `,
      publishDate: '2026-04-01',
      author: '行政部',
      views: 856,
      attachments: [
        { id: 1, name: '行政部 2026 年第一季度工作总结.pdf', size: '1.2 MB' },
        { id: 2, name: '第二季度工作计划表.xlsx', size: '156 KB' }
      ],
      relatedNews: [
        { id: 2, title: '人力资源部举办新员工入职培训', date: '2026-03-28', department: '人力资源部' },
        { id: 5, title: '财务部组织开展预算编制培训', date: '2026-03-20', department: '财务部' }
      ]
    },
    2: {
      id: 2,
      department: '人力资源部',
      departmentIcon: '👥',
      title: '人力资源部举办 2026 年第一期新员工入职培训',
      content: `
        <p>3 月 28 日至 29 日，人力资源部在公司培训中心举办了 2026 年第一期新员工入职培训班，共有 35 名来自各部门的新员工参加培训。</p>
        
        <h2>一、培训内容</h2>
        <p>本次培训为期两天，内容丰富、形式多样，主要包括以下几个模块:</p>
        
        <h3>1. 企业文化模块</h3>
        <ul>
          <li>公司发展历程和战略规划</li>
          <li>企业愿景、使命和核心价值观</li>
          <li>企业文化传播与践行</li>
        </ul>
        
        <h3>2. 规章制度模块</h3>
        <ul>
          <li>员工手册解读</li>
          <li>考勤管理制度</li>
          <li>绩效考核办法</li>
          <li>薪酬福利政策</li>
        </ul>
        
        <h3>3. 职业素养模块</h3>
        <ul>
          <li>职场礼仪与沟通技巧</li>
          <li>时间管理与工作效率</li>
          <li>团队协作精神</li>
        </ul>
        
        <h2>二、培训效果</h2>
        <p>培训结束后进行了结业考试和满意度调查:</p>
        <ul>
          <li>考试通过率：100%</li>
          <li>平均成绩：92 分</li>
          <li>培训满意度：98.5%</li>
        </ul>
        
        <p>人力资源部将为每位新员工安排导师，进行为期三个月的在岗指导和培养，帮助新员工尽快适应工作岗位，融入团队。</p>
        
        <p style="text-align: right; margin-top: 40px;">人力资源部</p>
        <p style="text-align: right;">2026 年 3 月 28 日</p>
      `,
      publishDate: '2026-03-28',
      author: '人力资源部',
      views: 1234,
      attachments: [
        { id: 1, name: '新员工入职培训手册.pdf', size: '2.8 MB' }
      ],
      relatedNews: [
        { id: 1, title: '行政部召开第一季度工作总结会议', date: '2026-04-01', department: '行政部' },
        { id: 5, title: '财务部组织开展预算编制培训', date: '2026-03-20', department: '财务部' }
      ]
    },
    3: {
      id: 3,
      department: '技术研发部',
      departmentIcon: '💻',
      title: '技术研发部成功完成新一代产品核心模块开发',
      content: `
        <p>经过三个月的集中攻关，技术研发部于 3 月 25 日成功完成了新一代智能产品的核心模块开发工作，产品性能实现重大突破。</p>
        
        <h2>一、技术攻关</h2>
        <p>研发团队克服了多项技术难题:</p>
        
        <h3>1. 算法优化</h3>
        <ul>
          <li>创新性地提出了 XX 算法</li>
          <li>运算速度提升 40%</li>
          <li>准确率达到 99.9%</li>
        </ul>
        
        <h3>2. 架构升级</h3>
        <ul>
          <li>采用微服务架构</li>
          <li>支持弹性扩展</li>
          <li>系统稳定性提升 50%</li>
        </ul>
        
        <h3>3. 性能优化</h3>
        <ul>
          <li>响应时间缩短至毫秒级</li>
          <li>并发处理能力翻倍</li>
          <li>资源占用降低 30%</li>
        </ul>
        
        <h2>二、市场前景</h2>
        <p>该产品预计:</p>
        <ul>
          <li>上半年小批量试产</li>
          <li>下半年规模化量产</li>
          <li>年销售额有望突破 1 亿元</li>
        </ul>
        
        <p style="text-align: right; margin-top: 40px;">技术研发部</p>
        <p style="text-align: right;">2026 年 3 月 25 日</p>
      `,
      publishDate: '2026-03-25',
      author: '技术研发部',
      views: 2156,
      attachments: [
        { id: 1, name: '产品技术白皮书.pdf', size: '5.6 MB' }
      ],
      relatedNews: [
        { id: 4, title: '市场营销部一季度业绩创新高', date: '2026-03-22', department: '市场营销部' },
        { id: 7, title: '信息技术部完成办公系统升级', date: '2026-03-15', department: '信息技术部' }
      ]
    },
    4: {
      id: 4,
      department: '市场营销部',
      departmentIcon: '📈',
      title: '市场营销部一季度业绩创新高，同比增长 35%',
      content: `
        <p>在市场环境复杂多变的情况下，市场营销部开拓创新、锐意进取，一季度签约金额突破 5000 万元，实现了开门红。</p>
        
        <h2>一、业绩数据</h2>
        <p>2026 年一季度主要经济指标:</p>
        <ul>
          <li><strong>签约金额:</strong> 5,200 万元，同比增长 35%</li>
          <li><strong>回款金额:</strong> 4,800 万元，回款率 92%</li>
          <li><strong>新客户数:</strong> 新增 28 家，增长率 45%</li>
        </ul>
        
        <h2>二、主要做法</h2>
        
        <h3>1. 市场开拓</h3>
        <ul>
          <li>深耕重点区域市场，建立区域营销中心</li>
          <li>参加行业展会 5 场，扩大品牌影响力</li>
          <li>开展线上营销，新媒体粉丝增长 2 万人</li>
        </ul>
        
        <h3>2. 客户维护</h3>
        <ul>
          <li>建立大客户 VIP 服务体系</li>
          <li>定期走访重点客户，了解需求</li>
          <li>组织客户答谢会，增进感情</li>
        </ul>
        
        <h2>三、二季度计划</h2>
        <p>二季度市场营销工作重点:</p>
        <ul>
          <li><strong>目标:</strong>签约 6000 万元，回款 5500 万元</li>
          <strong>策略:</strong>聚焦重点行业，深耕细分市场</li>
        </ul>
        
        <p style="text-align: right; margin-top: 40px;">市场营销部</p>
        <p style="text-align: right;">2026 年 3 月 22 日</p>
      `,
      publishDate: '2026-03-22',
      author: '市场营销部',
      views: 1876,
      attachments: [
        { id: 1, name: '一季度营销数据分析报告.pdf', size: '2.1 MB' }
      ],
      relatedNews: [
        { id: 3, title: '技术研发部完成核心模块开发', date: '2026-03-25', department: '技术研发部' },
        { id: 1, title: '行政部召开第一季度工作总结会议', date: '2026-04-01', department: '行政部' }
      ]
    },
    5: {
      id: 5,
      department: '财务部',
      departmentIcon: '💰',
      title: '财务部组织开展 2026 年预算编制培训',
      content: `
        <p>为提高各部门预算编制的科学性和准确性，财务部于 3 月 20 日组织了 2026 年预算编制专题培训，各部门负责人和预算专员共 60 余人参加培训。</p>
        
        <h2>一、培训内容</h2>
        
        <h3>1. 预算管理制度解读</h3>
        <ul>
          <li>公司预算管理办法</li>
          <li>预算编制实施细则</li>
          <li>预算调整审批流程</li>
        </ul>
        
        <h3>2. 预算编制方法</h3>
        <ul>
          <li><strong>零基预算:</strong> 从零开始，逐项论证</li>
          <li><strong>增量预算:</strong> 在上年基础上调整</li>
          <li><strong>滚动预算:</strong> 动态调整，持续优化</li>
        </ul>
        
        <h2>二、工作要求</h2>
        <p>财务部对预算编制工作提出明确要求:</p>
        <ul>
          <li><strong>高度重视:</strong> 各部门负责人要亲自抓预算工作</li>
          <li><strong>科学编制:</strong> 坚持实事求是原则</li>
          <li><strong>按时完成:</strong> 严格按照时间节点提交预算草案</li>
        </ul>
        
        <p style="text-align: right; margin-top: 40px;">财务部</p>
        <p style="text-align: right;">2026 年 3 月 20 日</p>
      `,
      publishDate: '2026-03-20',
      author: '财务部',
      views: 945,
      attachments: [
        { id: 1, name: '预算管理制度汇编.pdf', size: '3.2 MB' },
        { id: 2, name: '预算编制模板.xlsx', size: '456 KB' }
      ],
      relatedNews: [
        { id: 1, title: '行政部召开第一季度工作总结会议', date: '2026-04-01', department: '行政部' },
        { id: 2, title: '人力资源部举办新员工培训', date: '2026-03-28', department: '人力资源部' }
      ]
    },
    6: {
      id: 6,
      department: '质量管理部',
      departmentIcon: '✅',
      title: '质量管理部通过 ISO9001 质量管理体系复审',
      content: `
        <p>3 月 15 日至 18 日，中国质量认证中心审核组对公司进行了 ISO9001 质量管理体系监督审核，公司顺利通过复审认证。</p>
        
        <h2>一、审核概况</h2>
        <p><strong>审核时间:</strong> 2026 年 3 月 15 日 -18 日</p>
        <p><strong>审核范围:</strong> 产品设计开发、生产制造、销售及售后服务全过程</p>
        
        <h2>二、审核亮点</h2>
        <p>审核组对公司质量管理工作给予高度评价:</p>
        <ul>
          <li><strong>领导重视:</strong> 公司高层高度重视质量管理</li>
          <li><strong>体系健全:</strong> 质量管理制度完善，流程清晰</li>
          <li><strong>执行有力:</strong> 各项制度得到有效执行</li>
          <li><strong>成效显著:</strong> 产品质量稳定，客户满意度高</li>
        </ul>
        
        <h2>三、关键指标</h2>
        <p>公司质量管理主要指标:</p>
        <ul>
          <li><strong>产品合格率:</strong> 99.8%</li>
          <li><strong>客户投诉率:</strong> 0.12%</li>
          <li><strong>客户满意度:</strong> 98.5%</li>
        </ul>
        
        <p style="text-align: right; margin-top: 40px;">质量管理部</p>
        <p style="text-align: right;">2026 年 3 月 18 日</p>
      `,
      publishDate: '2026-03-18',
      author: '质量管理部',
      views: 1123,
      attachments: [
        { id: 1, name: 'ISO9001 认证证书.pdf', size: '1.5 MB' }
      ],
      relatedNews: [
        { id: 3, title: '技术研发部完成核心模块开发', date: '2026-03-25', department: '技术研发部' },
        { id: 5, title: '财务部组织预算编制培训', date: '2026-03-20', department: '财务部' }
      ]
    },
    7: {
      id: 7,
      department: '信息技术部',
      departmentIcon: '🔧',
      title: '信息技术部完成办公系统升级，提升工作效率',
      content: `
        <p>历时两个月的系统升级改造顺利完成，3 月 15 日新系统正式上线运行，员工办公效率提升 30%。</p>
        
        <h2>一、主要功能</h2>
        
        <h3>1. 协同办公</h3>
        <ul>
          <li>公文流转：支持多种审批流程</li>
          <li>任务管理：分配、跟踪、督办</li>
          <li>日程安排：个人和团队日程管理</li>
          <li>会议管理：预约、通知、纪要</li>
        </ul>
        
        <h3>2. 移动办公</h3>
        <ul>
          <li>APP 应用：iOS/Android全覆盖</li>
          <li>微信集成：企业微信小程序</li>
          <li>随时随地：审批、查询、沟通</li>
        </ul>
        
        <h2>二、应用效果</h2>
        <p>系统上线后的显著改善:</p>
        <ul>
          <li><strong>审批时间:</strong> 从平均 2 天缩短到 4 小时</li>
          <li><strong>文档查找:</strong> 从 10 分钟缩短到 1 分钟</li>
          <li><strong>整体效率提升:</strong> 30%</li>
        </ul>
        
        <p style="text-align: right; margin-top: 40px;">信息技术部</p>
        <p style="text-align: right;">2026 年 3 月 15 日</p>
      `,
      publishDate: '2026-03-15',
      author: '信息技术部',
      views: 1567,
      attachments: [
        { id: 1, name: '办公系统使用手册.pdf', size: '4.5 MB' }
      ],
      relatedNews: [
        { id: 3, title: '技术研发部完成核心模块开发', date: '2026-03-25', department: '技术研发部' },
        { id: 6, title: '质量管理部通过 ISO9001 复审', date: '2026-03-18', department: '质量管理部' }
      ]
    },
    8: {
      id: 8,
      department: '客户服务部',
      departmentIcon: '🎧',
      title: '客户服务部客户满意度达 98.5%，创历史新高',
      content: `
        <p>通过优化服务流程、加强人员培训等措施，一季度客户满意度调查结果显示满意度达 98.5%,创历史新高。</p>
        
        <h2>一、调查结果</h2>
        <p>2026 年一季度客户满意度调查基本情况:</p>
        <ul>
          <li><strong>调查对象:</strong> 活跃客户 500 家</li>
          <li><strong>回收问卷:</strong> 428 份，回收率 85.6%</li>
          <li><strong>满意度得分:</strong> 98.5 分</li>
          <li><strong>同比提升:</strong> 2.3 个百分点</li>
        </ul>
        
        <h2>二、主要做法</h2>
        <ul>
          <li><strong>优化服务流程:</strong> 简化审批环节，提高效率</li>
          <li><strong>加强培训:</strong> 服务礼仪、产品知识、沟通技巧</li>
          <li><strong>完善考核:</strong> 将满意度纳入 KPI 考核</li>
          <li><strong>技术创新:</strong> 上线 CRM 系统，开通 400 热线</li>
        </ul>
        
        <h2>三、下一步目标</h2>
        <p>客户服务部提出:</p>
        <ul>
          <li>二季度满意度保持 98% 以上</li>
          <li>全年客户流失率低于 2%</li>
          <li>客户推荐率达到 85%</li>
        </ul>
        
        <p style="text-align: right; margin-top: 40px;">客户服务部</p>
        <p style="text-align: right;">2026 年 3 月 12 日</p>
      `,
      publishDate: '2026-03-12',
      author: '客户服务部',
      views: 1345,
      attachments: [
        { id: 1, name: '客户满意度调查报告.pdf', size: '2.3 MB' }
      ],
      relatedNews: [
        { id: 4, title: '市场营销部一季度业绩创新高', date: '2026-03-22', department: '市场营销部' },
        { id: 2, title: '人力资源部举办新员工培训', date: '2026-03-28', department: '人力资源部' }
      ]
    }
  }
  
  return newsMap[id] || newsMap[1]
}

const newsData = ref<DepartmentNewsDetail>(getNewsById(getNewsId()))
const currentNav = ref(3) // 默认高亮"部门动态"（索引为3）
const searchQuery = ref('')

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

const goBack = () => {
  router.back()
}

const viewRelatedNews = (newsId: number) => {
  router.push({
    name: 'DepartmentNewsDetail',
    params: { id: newsId }
  })
  window.scrollTo(0, 0)
}

const handleDownload = (attachment: any) => {
  alert(`开始下载：${attachment.name}`)
}

const handlePrint = () => {
  window.print()
}

const handleShare = () => {
  alert('分享功能开发中...')
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
    router.push({ name: 'DepartmentNews' })
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

onMounted(() => {
  window.scrollTo(0, 0)
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    window.scrollTo(0, 0)
    newsData.value = getNewsById(Number(newId))
  }
}, { immediate: true })
</script>

<template>
  <div class="department-news-detail-page">
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
        <button class="back-btn" @click="goBack">← 返回</button>
        <div class="department-tag">
          {{ newsData.departmentIcon }} {{ newsData.department }}
        </div>
        <h1>{{ newsData.title }}</h1>
        <div class="meta-info">
          <span class="author">👤 {{ newsData.author }}</span>
          <span class="date">🕐 {{ formatDate(newsData.publishDate) }}</span>
          <span class="views">👁️ {{ formatViews(newsData.views) }} 次浏览</span>
        </div>
      </div>
    </div>

    <div class="main-container">
      <article class="news-content">
        <div class="content-body" v-html="newsData.content"></div>

        <div v-if="newsData.attachments && newsData.attachments.length > 0" class="attachments-section">
          <h3 class="section-title">📎 附件下载</h3>
          <ul class="attachments-list">
            <li v-for="attachment in newsData.attachments" :key="attachment.id" class="attachment-item">
              <div class="attachment-info">
                <span class="attachment-icon">📄</span>
                <span class="attachment-name">{{ attachment.name }}</span>
                <span class="attachment-size">{{ attachment.size }}</span>
              </div>
              <button class="download-btn" @click="handleDownload(attachment)">⬇️ 下载</button>
            </li>
          </ul>
        </div>

        <div v-if="newsData.relatedNews && newsData.relatedNews.length > 0" class="related-section">
          <h3 class="section-title">📋 相关动态</h3>
          <ul class="related-list">
            <li v-for="news in newsData.relatedNews" :key="news.id" class="related-item">
              <a href="#" @click.prevent="viewRelatedNews(news.id)" class="related-link">
                <span class="related-department">{{ news.department }}</span>
                <span class="related-title">{{ news.title }}</span>
                <span class="related-date">{{ news.date }}</span>
              </a>
            </li>
          </ul>
        </div>
      </article>

      <div class="action-bar">
        <button class="print-btn" @click="handlePrint">🖨️ 打印</button>
        <button class="share-btn" @click="handleShare">📤 分享</button>
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
.department-news-detail-page {
  min-height: 100vh;
  background: #f5f6fa;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px 60px;
  text-align: center;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
}

.back-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.department-tag {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.header-content h1 {
  font-size: 2rem;
  margin: 0 0 20px 0;
  line-height: 1.4;
}

.meta-info {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 0.9rem;
  opacity: 0.95;
}

.main-container {
  max-width: 900px;
  margin: -40px auto 40px;
  padding: 0 20px;
  position: relative;
  z-index: 2;
}

.news-content {
  background: white;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.content-body {
  line-height: 1.8;
  color: #333;
}

.content-body :deep(h2) {
  color: #2c3e50;
  margin: 30px 0 15px;
  font-size: 1.4rem;
}

.content-body :deep(h3) {
  color: #555;
  margin: 25px 0 12px;
  font-size: 1.1rem;
}

.content-body :deep(p) {
  margin: 15px 0;
  text-indent: 2em;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  margin: 15px 0;
  padding-left: 40px;
}

.content-body :deep(li) {
  margin: 8px 0;
}

.content-body :deep(blockquote) {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  padding: 15px 20px;
  margin: 20px 0;
  font-style: italic;
}

.attachments-section,
.related-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #ecf0f1;
}

.section-title {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 20px;
}

.attachments-list {
  list-style: none;
  padding: 0;
}

.attachment-item {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.attachment-item:hover {
  background: #e8f4f8;
  transform: translateX(5px);
}

.attachment-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.attachment-icon {
  font-size: 1.5rem;
}

.attachment-name {
  font-weight: 500;
  color: #2c3e50;
}

.attachment-size {
  color: #7f8c8d;
  font-size: 0.85rem;
}

.download-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.download-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.3);
}

.related-list {
  list-style: none;
  padding: 0;
}

.related-item {
  margin-bottom: 10px;
}

.related-link {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s;
  gap: 15px;
}

.related-link:hover {
  background: #e8f4f8;
  transform: translateX(5px);
}

.related-department {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  white-space: nowrap;
}

.related-title {
  flex: 1;
  font-weight: 500;
}

.related-date {
  color: #7f8c8d;
  font-size: 0.85rem;
}

.action-bar {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}

.print-btn,
.share-btn {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 10px 30px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.print-btn:hover,
.share-btn:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .page-header {
    padding: 60px 15px 40px;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .news-content {
    padding: 25px 20px;
  }

  .meta-info {
    flex-direction: column;
    gap: 8px;
  }

  .attachment-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .related-link {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
