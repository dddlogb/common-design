<script setup lang="ts">
// Props
const props = defineProps<{
  modelValue: string
  placeholder?: string
  searchScope?: 'all' | 'notice' | 'department' | 'news'  // 搜索范围
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'search', scope?: 'all' | 'notice' | 'department' | 'news'): void
}>()

// 根据搜索范围获取默认placeholder
const getDefaultPlaceholder = () => {
  switch (props.searchScope) {
    case 'notice':
      return '搜索通知公告...'
    case 'department':
      return '搜索部门动态...'
    case 'news':
      return '搜索新闻中心...'
    case 'all':
    default:
      return '搜索通知、新闻...'
  }
}

// 方法
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleSearch = () => {
  emit('search', props.searchScope)
}

const handleKeyup = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}
</script>

<template>
  <div class="nav-search-box">
    <!-- 默认插槽：允许父组件自定义搜索框内容 -->
    <slot name="default">
      <input 
        type="text" 
        :value="modelValue"
        @input="handleInput"
        @keyup="handleKeyup"
        :placeholder="placeholder || getDefaultPlaceholder()"
      >
      <button @click="handleSearch">🔍</button>
    </slot>
  </div>
</template>

<style scoped>
.nav-search-box {
  display: flex;
  align-items: center;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  padding: 0.4rem 1rem;
  transition: all 0.3s;
  flex: 1;
  max-width: 300px;
  min-width: 0;
}

.nav-search-box:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.nav-search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
  background: transparent;
  min-width: 0;
  width: 100%;
}

.nav-search-box button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #7f8c8d;
  transition: all 0.3s;
  flex-shrink: 0;
}

.nav-search-box button:hover {
  color: #3498db;
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nav-search-box {
    max-width: 240px;
  }
}

@media (max-width: 768px) {
  .nav-search-box {
    order: 2;
    max-width: 180px;
  }
}

@media (max-width: 600px) {
  .nav-search-box {
    display: none;
  }
}
</style>
