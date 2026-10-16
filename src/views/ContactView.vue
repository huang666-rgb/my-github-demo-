<script setup>
import { computed } from 'vue'

// 联系我视图
// defineProps：email / github（联系卡片显示用）
defineOptions({ inheritAttrs: false }) // 未声明的 props/事件不透传到根元素

const props = defineProps({
  email: { type: String, default: '' },
  github: { type: String, default: '' }
})

// 从 GitHub 主页地址取出用户名：https://github.com/yourname → @yourname
const githubHandle = computed(() => {
  const parts = (props.github || '').replace(/\/+$/, '').split('/')
  return parts[parts.length - 1] || ''
})
</script>

<template>
  <!-- ============ 联系我 ============ -->
  <section id="contact" class="page-section contact-page">
    <div class="page-head">
      <div class="page-tag">● CONTACT / 联系我</div>
      <h2 class="page-title">找我聊聊 <span class="smiley" /></h2>
      <p class="page-desc">无论是实习机会、项目合作还是技术交流，都欢迎通过下面的方式联系我。</p>
    </div>

    <!-- 联系方式卡片 -->
    <div class="contact-cards">
      <a class="contact-card" :href="'mailto:' + email">
        <div class="cc-icon">✉️</div>
        <div class="cc-info">
          <div class="cc-label">邮箱</div>
          <div class="cc-value">{{ email }}</div>
        </div>
      </a>
      <a class="contact-card" :href="github" target="_blank">
        <div class="cc-icon">💻</div>
        <div class="cc-info">
          <div class="cc-label">GitHub</div>
          <div class="cc-value">@{{ githubHandle }}</div>
        </div>
      </a>
      <div class="contact-card">
        <div class="cc-icon">💬</div>
        <div class="cc-info">
          <div class="cc-label">微信</div>
          <div class="cc-value">hcy_dev（备注来意）</div>
        </div>
      </div>
      <div class="contact-card">
        <div class="cc-icon">📍</div>
        <div class="cc-info">
          <div class="cc-label">所在地</div>
          <div class="cc-value">重庆 · 在校生</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============ 通用页面区 ============ */
.page-section {
  padding: 20px 8px 40px;
  animation: fadeIn 0.3s ease;
  text-align: center;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.page-head { margin-bottom: 28px; }
.page-tag {
  display: inline-block;
  font-size: 12px;
  color: var(--text-muted);
  background: var(--bg-soft);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 14px;
  letter-spacing: 1px;
}
.page-title {
  font-size: 36px;
  font-weight: 800;
  color: var(--title);
  margin-bottom: 8px;
  letter-spacing: -0.3px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.page-desc {
  font-size: 14px;
  color: var(--text-muted);
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.7;
}

/* 笑脸（标题装饰） */
.smiley {
  display: inline-block;
  width: 44px;
  height: 44px;
  margin-left: 6px;
  vertical-align: middle;
  position: relative;
  background: #B8E8D5;
  border-radius: 50%;
  transform: rotate(-8deg);
  box-shadow: 0 3px 10px rgba(0,0,0,0.12);
}
.smiley::before {
  content: '';
  position: absolute;
  top: 38%; left: 22%; width: 10px; height: 10px;
  background: var(--primary); border-radius: 50%;
  box-shadow: 18px 0 0 var(--primary);
}
.smiley::after {
  content: '';
  position: absolute;
  bottom: 26%; left: 28%; width: 22px; height: 11px;
  border-bottom: 2.5px solid var(--primary);
  border-radius: 0 0 22px 22px;
}

/* ============ 联系卡片 ============ */
.contact-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  max-width: 760px;
  margin: 0 auto;
}
.contact-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 18px;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}
a.contact-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
.cc-icon {
  font-size: 24px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-soft);
  border-radius: 10px;
  flex-shrink: 0;
}
.cc-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.cc-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--title);
  word-break: break-all;
}

/* ============ 响应式 ============ */
@media (max-width: 640px) {
  .page-title { font-size: 28px; }
  .contact-cards { grid-template-columns: 1fr; }
}
</style>
