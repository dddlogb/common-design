<script setup lang="ts">
// 类型定义
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

interface FooterInfo {
  email: string
  phone: string
  address: string
  icp: string
  police: string
}

// Props
defineProps<{
  aboutText: string
  socialLinks: SocialLink[]
  footerSections: FooterSection[]
  footerInfo: FooterInfo
}>()

// Emits
const emit = defineEmits<{
  (e: 'social-click', social: SocialLink): void
  (e: 'footer-link-click', link: FooterLink): void
}>()

// 方法
const handleSocialClick = (social: SocialLink) => {
  emit('social-click', social)
}

const handleFooterLink = (link: FooterLink) => {
  emit('footer-link-click', link)
}
</script>

<template>
  <footer class="footer">
    <div class="footer-top">
      <div class="footer-about">
        <h3>关于企业通知系统</h3>
        <p>{{ aboutText }}</p>
        <div class="social-links">
          <a 
            v-for="(social, index) in socialLinks" 
            :key="index"
            :href="social.href"
            class="social-link"
            @click.prevent="handleSocialClick(social)"
          >
            {{ social.icon }}
          </a>
        </div>
      </div>
      <div 
        v-for="(section, index) in footerSections" 
        :key="index"
        class="footer-links"
      >
        <h4>{{ section.title }}</h4>
        <ul>
          <li v-for="(link, linkIndex) in section.links" :key="linkIndex">
            <a :href="link.href" @click.prevent="handleFooterLink(link)">
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 企业通知系统。All Rights Reserved.</p>
      <p>
        📧 Email: {{ footerInfo.email }} &nbsp;&nbsp;|&nbsp;&nbsp; 
        📱 Tel: {{ footerInfo.phone }} &nbsp;&nbsp;|&nbsp;&nbsp; 
        📍 Add: {{ footerInfo.address }}
      </p>
    </div>
  </footer>
</template>

<style scoped>
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
}

.footer-links a:hover {
  color: #3498db;
  padding-left: 5px;
}

.footer-bottom {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  font-size: 0.9rem;
  opacity: 0.8;
}

.footer-bottom p {
  margin: 8px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-about {
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .footer-links {
    text-align: center;
  }
  
  .footer-links h4::after {
    left: 50%;
    transform: translateX(-50%);
  }
  
  .footer-links ul {
    display: inline-block;
    text-align: left;
  }
}
</style>
