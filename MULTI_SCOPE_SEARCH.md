# 多范围搜索解决方案

## 🎯 问题场景

当需要在同一个页面中搜索多种类型的内容（如同时搜索通知和部门动态）时，如何设计一个灵活的搜索方案？

---

## 💡 推荐方案：searchScope + 自定义搜索逻辑

### 核心思路

1. **NavSearch 组件** - 通过 `searchScope` prop 指定搜索范围
2. **父组件** - 根据 searchScope 执行相应的搜索逻辑
3. **搜索结果** - 可以合并展示或分类展示

---

## 📦 方案一：首页全局搜索（推荐）

### 适用场景
- 首页需要同时搜索通知、新闻、部门动态
- 用户希望一次性找到所有相关内容

### 实现方式

```vue
<!-- EnterpriseWebsite.vue -->
<template>
  <HeaderNav 
    :nav-items="navItems"
    :current-nav="currentNav"
    :search-query="searchQuery"
    @update:search-query="searchQuery = $event"
    @search="handleGlobalSearch"
  >
    <template #search>
      <NavSearch 
        v-model="searchQuery"
        search-scope="all"
        placeholder="搜索通知、新闻、部门动态..."
        @search="handleGlobalSearch"
      />
    </template>
  </HeaderNav>

  <!-- 搜索结果展示 -->
  <section v-if="showSearchResults" class="search-results">
    <h2>搜索结果：{{ searchResults.length }} 条</h2>
    
    <!-- 通知结果 -->
    <div v-if="noticeResults.length > 0" class="result-group">
      <h3>📢 通知公告 ({{ noticeResults.length }})</h3>
      <div v-for="notice in noticeResults" :key="notice.id" class="result-item">
        {{ notice.title }}
      </div>
    </div>
    
    <!-- 部门动态结果 -->
    <div v-if="departmentResults.length > 0" class="result-group">
      <h3>🏢 部门动态 ({{ departmentResults.length }})</h3>
      <div v-for="dept in departmentResults" :key="dept.id" class="result-item">
        {{ dept.title }}
      </div>
    </div>
    
    <!-- 新闻中心结果 -->
    <div v-if="newsResults.length > 0" class="result-group">
      <h3>📰 新闻中心 ({{ newsResults.length }})</h3>
      <div v-for="news in newsResults" :key="news.id" class="result-item">
        {{ news.title }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import HeaderNav from '../components/HeaderNav.vue'
import NavSearch from '../components/NavSearch.vue'

const searchQuery = ref('')
const showSearchResults = ref(false)

// 模拟数据
const allNotices = ref([...])
const allDepartments = ref([...])
const allNews = ref([...])

// 搜索结果
const noticeResults = ref([])
const departmentResults = ref([])
const newsResults = ref([])

// 总结果数
const searchResults = computed(() => [
  ...noticeResults.value,
  ...departmentResults.value,
  ...newsResults.value
])

// 全局搜索处理
const handleGlobalSearch = (scope?: 'all' | 'notice' | 'department' | 'news') => {
  if (!searchQuery.value.trim()) {
    showSearchResults.value = false
    return
  }

  const query = searchQuery.value.toLowerCase()

  // 搜索通知公告
  noticeResults.value = allNotices.value.filter(notice =>
    notice.title.toLowerCase().includes(query)
  )

  // 搜索部门动态
  departmentResults.value = allDepartments.value.filter(dept =>
    dept.title.toLowerCase().includes(query) ||
    dept.content.toLowerCase().includes(query)
  )

  // 搜索新闻中心
  newsResults.value = allNews.value.filter(news =>
    news.title.toLowerCase().includes(query) ||
    news.excerpt.toLowerCase().includes(query)
  )

  showSearchResults.value = true
}
</script>

<style scoped>
.search-results {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.result-group {
  margin-bottom: 30px;
}

.result-group h3 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 15px;
}

.result-item {
  padding: 12px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.result-item:hover {
  background: #e3f2fd;
  transform: translateX(5px);
}
</style>
```

**优点**：
- ✅ 一次搜索，获取所有相关内容
- ✅ 结果分类展示，清晰明了
- ✅ 用户体验好，无需多次搜索

---

## 📦 方案二：标签页切换搜索

### 适用场景
- 希望在同一页面内切换搜索范围
- 用户可能只想搜索某一种类型

### 实现方式

```vue
<!-- MultiSearchPage.vue -->
<template>
  <HeaderNav>
    <template #search>
      <div class="multi-search">
        <NavSearch 
          v-model="searchQuery"
          :search-scope="currentScope"
          :placeholder="getPlaceholder()"
          @search="handleSearch"
        />
        
        <!-- 搜索范围切换标签 -->
        <div class="search-scope-tabs">
          <button 
            :class="{ active: currentScope === 'all' }"
            @click="currentScope = 'all'"
          >
            全部
          </button>
          <button 
            :class="{ active: currentScope === 'notice' }"
            @click="currentScope = 'notice'"
          >
            通知
          </button>
          <button 
            :class="{ active: currentScope === 'department' }"
            @click="currentScope = 'department'"
          >
            部门动态
          </button>
        </div>
      </div>
    </template>
  </HeaderNav>

  <!-- 搜索结果 -->
  <div v-if="showResults" class="results-container">
    <div v-if="currentScope === 'all'">
      <!-- 显示所有类型的结果 -->
    </div>
    <div v-else-if="currentScope === 'notice'">
      <!-- 只显示通知结果 -->
    </div>
    <div v-else-if="currentScope === 'department'">
      <!-- 只显示部门动态结果 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavSearch from '../components/NavSearch.vue'

const searchQuery = ref('')
const currentScope = ref<'all' | 'notice' | 'department'>('all')
const showResults = ref(false)

const getPlaceholder = () => {
  switch (currentScope.value) {
    case 'notice':
      return '搜索通知公告...'
    case 'department':
      return '搜索部门动态...'
    default:
      return '搜索全部内容...'
  }
}

const handleSearch = (scope?: 'all' | 'notice' | 'department' | 'news') => {
  // 根据 currentScope 执行不同的搜索逻辑
  console.log('搜索范围:', scope || currentScope.value)
  console.log('搜索关键词:', searchQuery.value)
  
  // 执行搜索...
  showResults.value = true
}
</script>

<style scoped>
.multi-search {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-scope-tabs {
  display: flex;
  gap: 5px;
}

.search-scope-tabs button {
  padding: 4px 12px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 15px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.search-scope-tabs button.active {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.search-scope-tabs button:hover:not(.active) {
  background: #f5f7fa;
}
</style>
```

**优点**：
- ✅ 用户可以灵活切换搜索范围
- ✅ 界面直观，易于理解
- ✅ 适合复杂的多类型搜索场景

---

## 📦 方案三：高级搜索面板

### 适用场景
- 需要更精细的搜索控制
- 支持多选搜索范围
- 支持额外的筛选条件

### 实现方式

```vue
<!-- AdvancedSearchPage.vue -->
<template>
  <HeaderNav>
    <template #search>
      <div class="advanced-search-wrapper">
        <NavSearch 
          v-model="searchQuery"
          placeholder="输入关键词..."
          @search="handleAdvancedSearch"
        />
        
        <!-- 高级搜索按钮 -->
        <button @click="showAdvanced = !showAdvanced" class="advanced-btn">
          ⚙️ 高级搜索
        </button>
      </div>
    </template>
  </HeaderNav>

  <!-- 高级搜索面板 -->
  <div v-if="showAdvanced" class="advanced-panel">
    <h3>搜索设置</h3>
    
    <!-- 搜索范围选择 -->
    <div class="scope-selection">
      <label>搜索范围：</label>
      <label>
        <input type="checkbox" v-model="searchScopes.notice">
        通知公告
      </label>
      <label>
        <input type="checkbox" v-model="searchScopes.department">
        部门动态
      </label>
      <label>
        <input type="checkbox" v-model="searchScopes.news">
        新闻中心
      </label>
    </div>
    
    <!-- 其他筛选条件 -->
    <div class="filters">
      <label>
        时间范围：
        <select v-model="timeRange">
          <option value="all">全部</option>
          <option value="today">今天</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
        </select>
      </label>
      
      <label>
        优先级：
        <select v-model="priority">
          <option value="all">全部</option>
          <option value="high">紧急</option>
          <option value="medium">重要</option>
          <option value="low">普通</option>
        </select>
      </label>
    </div>
    
    <button @click="handleAdvancedSearch" class="search-btn">
      🔍 开始搜索
    </button>
  </div>

  <!-- 搜索结果 -->
  <div v-if="showResults" class="results">
    <!-- 结果列表 -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import NavSearch from '../components/NavSearch.vue'

const searchQuery = ref('')
const showAdvanced = ref(false)
const showResults = ref(false)

// 搜索范围（多选）
const searchScopes = reactive({
  notice: true,
  department: true,
  news: false
})

// 筛选条件
const timeRange = ref('all')
const priority = ref('all')

const handleAdvancedSearch = () => {
  console.log('关键词:', searchQuery.value)
  console.log('搜索范围:', searchScopes)
  console.log('时间范围:', timeRange.value)
  console.log('优先级:', priority.value)
  
  // 根据配置执行搜索
  // ...
  
  showResults.value = true
}
</script>

<style scoped>
.advanced-search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.advanced-btn {
  padding: 8px 15px;
  background: #f5f7fa;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.advanced-btn:hover {
  background: #e3f2fd;
  border-color: #3498db;
}

.advanced-panel {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.scope-selection, .filters {
  margin: 15px 0;
}

.scope-selection label, .filters label {
  margin-right: 15px;
}

.search-btn {
  padding: 10px 25px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 15px;
}

.search-btn:hover {
  background: #2980b9;
}
</style>
```

**优点**：
- ✅ 功能最强大，支持多维度筛选
- ✅ 用户可以精确控制搜索行为
- ✅ 适合专业用户和复杂场景

---

## 📊 方案对比

| 特性 | 方案一：全局搜索 | 方案二：标签切换 | 方案三：高级搜索 |
|------|----------------|----------------|----------------|
| **实现难度** | ⭐⭐ 简单 | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐ 复杂 |
| **用户体验** | ⭐⭐⭐⭐ 优秀 | ⭐⭐⭐ 良好 | ⭐⭐⭐⭐ 优秀 |
| **灵活性** | ⭐⭐⭐ 中等 | ⭐⭐⭐⭐ 高 | ⭐⭐⭐⭐⭐ 最高 |
| **适用场景** | 首页、通用搜索 | 专用搜索页 | 专业搜索页 |
| **代码量** | 少 | 中 | 多 |
| **维护成本** | 低 | 中 | 高 |

---

## 🎯 推荐建议

### 1. **首页/通用页面** → 方案一：全局搜索
```vue
<NavSearch 
  v-model="searchQuery"
  search-scope="all"
  placeholder="搜索通知、新闻、部门动态..."
  @search="handleGlobalSearch"
/>
```

**理由**：
- 用户期望一次搜索找到所有内容
- 实现简单，维护成本低
- 符合大多数用户习惯

### 2. **专用列表页** → 方案二：标签切换
```vue
<!-- 在通知公告和部门动态的混合列表页 -->
<NavSearch 
  v-model="searchQuery"
  :search-scope="currentScope"
  @search="handleSearch"
/>
<div class="scope-tabs">
  <button @click="currentScope = 'notice'">通知</button>
  <button @click="currentScope = 'department'">部门动态</button>
</div>
```

**理由**：
- 用户可能需要切换查看不同类型
- 界面清晰，易于操作
- 平衡了功能和复杂度

### 3. **专业搜索页** → 方案三：高级搜索
```vue
<!-- 独立的搜索中心页面 -->
<AdvancedSearchPanel />
```

**理由**：
- 提供最强的搜索能力
- 适合有明确搜索需求的用户
- 可以作为网站的"搜索中心"

---

## 💻 完整示例：首页全局搜索

这是一个完整的、可直接使用的示例：

```vue
<!-- EnterpriseWebsite.vue - 搜索部分 -->
<template>
  <HeaderNav>
    <template #search>
      <NavSearch 
        v-model="searchQuery"
        search-scope="all"
        placeholder="搜索通知、部门动态..."
        @search="handleGlobalSearch"
      />
    </template>
  </HeaderNav>

  <!-- 搜索结果区域 -->
  <section v-if="showSearchResults" class="search-results-section">
    <div class="container">
      <div class="results-header">
        <h2>🔍 搜索结果</h2>
        <span class="count-badge">{{ totalResults }} 条结果</span>
        <button @click="clearSearch" class="clear-btn">✕ 清除</button>
      </div>

      <div v-if="totalResults === 0" class="no-results">
        <p>未找到与 "{{ searchQuery }}" 相关的内容</p>
      </div>

      <div v-else class="results-content">
        <!-- 通知结果 -->
        <div v-if="noticeResults.length > 0" class="result-category">
          <h3>📢 通知公告 ({{ noticeResults.length }})</h3>
          <div class="result-list">
            <div 
              v-for="notice in noticeResults" 
              :key="notice.id"
              class="result-card"
              @click="goToNotice(notice.id)"
            >
              <h4>{{ notice.title }}</h4>
              <span class="badge" :class="notice.priority">{{ notice.badge }}</span>
              <span class="time">{{ notice.time }}</span>
            </div>
          </div>
        </div>

        <!-- 部门动态结果 -->
        <div v-if="departmentResults.length > 0" class="result-category">
          <h3>🏢 部门动态 ({{ departmentResults.length }})</h3>
          <div class="result-list">
            <div 
              v-for="dept in departmentResults" 
              :key="dept.id"
              class="result-card"
              @click="goToDepartment(dept.id)"
            >
              <h4>{{ dept.title }}</h4>
              <p class="excerpt">{{ dept.excerpt }}</p>
              <span class="department">{{ dept.department }}</span>
              <span class="time">{{ dept.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import NavSearch from '../components/NavSearch.vue'

const router = useRouter()
const searchQuery = ref('')
const showSearchResults = ref(false)

// 模拟数据
const notices = ref([
  { id: 1, title: '关于放假的通知', priority: 'high', badge: '紧急', time: '2小时前' },
  { id: 2, title: '系统维护公告', priority: 'medium', badge: '重要', time: '5小时前' }
])

const departments = ref([
  { id: 1, title: '技术部完成新项目', excerpt: '...', department: '技术部', date: '2024-04-02' },
  { id: 2, title: '市场部举办活动', excerpt: '...', department: '市场部', date: '2024-04-01' }
])

// 搜索结果
const noticeResults = ref([])
const departmentResults = ref([])

// 总结果数
const totalResults = computed(() => 
  noticeResults.value.length + departmentResults.value.length
)

// 全局搜索
const handleGlobalSearch = () => {
  if (!searchQuery.value.trim()) {
    clearSearch()
    return
  }

  const query = searchQuery.value.toLowerCase()

  // 搜索通知
  noticeResults.value = notices.value.filter(n =>
    n.title.toLowerCase().includes(query)
  )

  // 搜索部门动态
  departmentResults.value = departments.value.filter(d =>
    d.title.toLowerCase().includes(query) ||
    d.excerpt.toLowerCase().includes(query)
  )

  showSearchResults.value = true
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  showSearchResults.value = false
  noticeResults.value = []
  departmentResults.value = []
}

// 跳转
const goToNotice = (id: number) => {
  router.push({ name: 'NoticeDetail', params: { id } })
}

const goToDepartment = (id: number) => {
  router.push({ name: 'DepartmentNewsDetail', params: { id } })
}
</script>

<style scoped>
.search-results-section {
  padding: 40px 0;
  background: #f8f9fa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.count-badge {
  background: #3498db;
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
}

.clear-btn {
  margin-left: auto;
  padding: 8px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
}

.no-results {
  text-align: center;
  padding: 60px 20px;
  color: #7f8c8d;
}

.result-category {
  margin-bottom: 40px;
}

.result-category h3 {
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.result-list {
  display: grid;
  gap: 15px;
}

.result-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s;
}

.result-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.result-card h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.excerpt {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 10px 0;
}

.badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-right: 10px;
}

.badge.high {
  background: #ffebee;
  color: #c62828;
}

.badge.medium {
  background: #fff3e0;
  color: #ef6c00;
}

.department, .time {
  color: #95a5a6;
  font-size: 0.85rem;
  margin-right: 15px;
}
</style>
```

---

## 🎉 总结

对于"既要搜索通知又要搜索部门动态"的场景，**推荐使用方案一：全局搜索**

**核心要点**：
1. ✅ 使用 `search-scope="all"` 标识全局搜索
2. ✅ 在父组件中同时搜索多种类型
3. ✅ 结果分类展示，清晰明了
4. ✅ 一次搜索，获取所有相关内容

**优势**：
- 🚀 用户体验最佳
- 💻 实现简单
- 🛠️ 易于维护
- 📱 响应式友好

这个方案既满足了多范围搜索的需求，又保持了代码的简洁性和可维护性！
