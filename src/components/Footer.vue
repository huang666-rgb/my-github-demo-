<script setup>
// Footer 组件：页面底部「联系我」信息条
// defineProps 编辑态 / defineModel 邮箱、GitHub 双向绑定

defineProps({
  isEditing: { type: Boolean, default: false }
})

const email = defineModel('email', { type: String, default: '' })
const github = defineModel('github', { type: String, default: '' })
</script>

<template>
  <footer class="footer">
    <div v-show="!isEditing" class="contact-row">
      <span class="contact-label">联系我</span>
      <span class="contact-item">邮箱：{{ email }}</span>
      <a class="contact-item" :href="'https://' + email">📧 发邮件</a>
      <a class="contact-item" :href="github" target="_blank">GitHub ↗</a>
    </div>

    <div v-show="isEditing" class="contact-edit">
      <input v-model="email" placeholder="邮箱" />
      <input v-model="github" placeholder="GitHub" />
    </div>
  </footer>
</template>

<style scoped>
.footer {
  flex-shrink: 0;
  padding: 16px 32px;
  border-top: 1px solid var(--border);
  background: var(--bg-card);
}

.contact-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 14px;
  color: var(--text);
}

.contact-label {
  font-weight: 600;
  color: var(--title);
  font-size: 15px;
}

.contact-item {
  color: var(--text-muted);
  text-decoration: none;
}

a.contact-item {
  color: var(--primary);
}

a.contact-item:hover {
  text-decoration: underline;
}

.contact-edit {
  display: flex;
  gap: 12px;
}

.contact-edit input {
  flex: 1;
  margin-bottom: 0;
}

@media (max-width: 600px) {
  .footer {
    padding: 12px 16px;
  }

  .contact-edit {
    flex-direction: column;
  }
}
</style>
