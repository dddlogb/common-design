# 企业官网通知系统 - Vue + TypeScript 版本

## 📋 项目简介

这是一个使用 **Vue 3** + **TypeScript** + **Vite** 构建的企业官网与通知系统页面。采用现代化的简约商务风格设计，包含新闻中心、通知公告、快速通道、联系我们等完整功能模块。

## 🎨 页面特点

### 1. **技术栈**
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **样式**: Scoped CSS

### 2. **功能模块**

#### 顶部导航栏
- ✅ Logo + 公司名称
- ✅ 响应式导航菜单
- ✅ 搜索框功能
- ✅ 粘性定位 (sticky)

#### 横幅区域 (Banner)
- ✅ 渐变色背景
- ✅ 数据统计卡片 (4 个)
- ✅ CTA 按钮

#### 新闻中心
- ✅ 标签页分类筛选 (全部/公司新闻/行业动态/媒体聚焦/活动公告)
- ✅ 新闻卡片列表 (带图标、分类、摘要、元数据)
- ✅ 悬停动画效果
- ✅ 阅读量格式化显示

#### 侧边栏组件
- **通知公告栏**
  - ✅ 优先级标识 (高/中/低)
  - ✅ 紧急/重要标签徽章
  - ✅ 时间显示
  
- **日历小组件**
  - ✅ 当前日期显示
  - ✅ 今日待办事项
  
- **快速通道**
  - ✅ 6 个快捷入口 (网格布局)
  - ✅ 图标 + 文字
  
- **联系我们卡片**
  - ✅ 地址、电话、邮箱、工作时间
  - ✅ 渐变色头部

#### 页脚
- ✅ 关于我们介绍
- ✅ 社交链接
- ✅ 快速链接、信息分类、帮助中心
- ✅ 版权信息和备案号

## 🚀 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173/ 查看页面

### 构建生产版本
```bash
npm run build
```

### 预览生产构建
```bash
npm run preview
```

## 📁 项目结构

```
企业官网通知系统/
├── src/
│   ├── views/
│   │   └── EnterpriseWebsite.vue    # 企业官网主页面组件
│   ├── App.vue                       # 根组件
│   ├── main.ts                       # 入口文件
│   └── style.css                     # 全局样式
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 💻 组件说明

### EnterpriseWebsite.vue

这个组件是整个页面的核心，包含以下特性:

#### Props
当前组件为独立页面，无需传入 props。

#### 响应式数据
- `currentNav`: 当前选中的导航项
- `currentTab`: 当前选中的新闻标签
- `searchQuery`: 搜索框输入内容
- `navItems`: 导航菜单配置
- `statistics`: 统计数据
- `newsList`: 新闻列表数据
- `notices`: 通知公告数据
- `quickLinks`: 快速链接配置
- `contactInfo`: 联系信息配置
- `footerSections`: 页脚分区配置

#### 计算属性
- `filteredNewsList`: 根据当前标签筛选后的新闻列表

#### 方法
- `handleNavClick()`: 处理导航点击
- `handleSearch()`: 处理搜索
- `viewNewsDetail()`: 查看新闻详情
- `viewNoticeDetail()`: 查看通知详情
- `formatNumber()`: 数字格式化 (超过 1 万显示为 x 万)
- `scrollToSection()`: 平滑滚动到指定区域

## 🎯 自定义配置

### 修改导航菜单
在 `EnterpriseWebsite.vue` 中修改 `navItems` 数组:

```typescript
const navItems: NavItem[] = [
  { label: '首页', href: '#home' },
  { label: '新闻中心', href: '#news' },
  // 添加或修改其他菜单项
]
```

### 修改统计数据
修改 `statistics` 数组:

```typescript
const statistics: Statistic[] = [
  { number: '1,234', label: '累计发布通知', background: 'rgba(52, 152, 219, 0.3)' },
  // ...
]
```

### 修改新闻数据
修改 `newsList` 数组，每个新闻项包含:
- `icon`: 图标 emoji
- `category`: 分类
- `title`: 标题
- `excerpt`: 摘要
- `author`: 作者
- `date`: 日期
- `views`: 阅读量
- `comments`: 评论数

### 修改配色方案
在组件的 `<style scoped>` 部分修改 CSS 变量:

```css
/* 主色调 */
--primary-color: #3498db;  /* 蓝色 */
--secondary-color: #2c3e50; /* 深灰色 */

/* 优先级颜色 */
.priority-high { background: #e74c3c; }    /* 红色 - 高优先级 */
.priority-medium { background: #f39c12; }  /* 橙色 - 中优先级 */
.priority-low { background: #27ae60; }     /* 绿色 - 低优先级 */
```

## 🔧 扩展功能建议

### 1. API 集成
将静态数据替换为从后端 API 获取:

```typescript
import { onMounted } from 'vue'
import axios from 'axios'

onMounted(async () => {
  const response = await axios.get('/api/news')
  newsList.value = response.data
})
```

### 2. 路由配置
使用 Vue Router 实现页面跳转:

```bash
npm install vue-router
```

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import EnterpriseWebsite from '../views/EnterpriseWebsite.vue'

const routes = [
  { path: '/', component: EnterpriseWebsite }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
```

### 3. 状态管理
使用 Pinia 进行全局状态管理:

```bash
npm install pinia
```

### 4. UI 组件库
可以集成 Element Plus、Ant Design Vue 等 UI 库增强功能。

## 📱 响应式支持

页面已支持移动端自适应:
- **桌面端**: > 992px
- **平板端**: 768px - 992px
- **手机端**: < 768px

在不同屏幕尺寸下自动调整布局。

## 🎨 设计风格

- **简约商务风**: 纯白背景 + 蓝色主题 (#3498db)
- **卡片式设计**: 现代化视觉层次
- **流畅动画**: 丰富的悬停交互效果
- **专业配色**: 符合企业形象的配色方案

## 📝 开发规范

### TypeScript 类型定义
所有数据都有完整的 TypeScript 类型定义，便于维护和重构。

### 组件化开发
页面拆分为多个逻辑部分，代码清晰易读。

### 响应式编程
使用 Vue 3 Composition API，代码组织更加灵活。

## 🐛 已知问题

暂无

## 📄 许可证

MIT License

## 👥 联系方式

如有问题或建议，欢迎联系开发团队。

---

**最后更新时间**: 2024-04-02
