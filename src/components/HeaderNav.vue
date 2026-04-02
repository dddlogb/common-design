<script setup lang="ts">

// 类型定义
interface NavItem {
  label: string
  href: string
}

// Props
const props = defineProps<{
  navItems: NavItem[]
  currentNav: number
  searchQuery: string
}>()

// Emits
const emit = defineEmits<{
  (e: 'update:currentNav', index: number): void
  (e: 'update:searchQuery', query: string): void
  (e: 'nav-click', index: number, href: string): void
  (e: 'search'): void
}>()

// 方法
const handleNavClick = (index: number, href: string) => {
  emit('nav-click', index, href)
}

const handleSearch = () => {
  emit('search')
}
</script>

<template>
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
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          placeholder="搜索通知、新闻..."
          @keyup.enter="handleSearch"
        >
        <button @click="handleSearch">🔍</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
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
  flex-shrink: 0;
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

/* 搜索框样式 */
.search-box {
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

.search-box:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.3rem 0.5rem;
  font-size: 0.9rem;
  background: transparent;
  min-width: 0;
  width: 100%;
}

.search-box button {
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

.search-box button:hover {
  color: #3498db;
  transform: scale(1.1);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .nav-menu {
    gap: 0.2rem;
  }
  
  .nav-menu a {
    padding: 0.5rem 0.9rem;
    font-size: 0.9rem;
  }
  
  .search-box {
    max-width: 240px;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
  }
  
  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
    margin-top: 0.5rem;
  }
  
  .search-box {
    order: 2;
    max-width: 180px;
  }
  
  .nav-menu a {
    padding: 0.4rem 0.7rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 600px) {
  .search-box {
    display: none;
  }
  
  .logo span {
    font-size: 1.2rem;
  }
  
  .logo-icon {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
  }
  
  .nav-menu {
    gap: 0.1rem;
  }
  
  .nav-menu a {
    padding: 0.4rem 0.5rem;
    font-size: 0.8rem;
  }
}
</style>
