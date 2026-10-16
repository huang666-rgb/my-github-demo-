<script setup>
// Header 组件：参考图的三段式顶部导航
// 左：头像 + PORTFOLIO Logo
// 中：导航链接组（当前激活项深色圆角胶囊）
// 右：下载简历按钮
//
// defineProps：theme / activeSection（当前激活项）/ sections（导航项数组）/ avatarUrl
// defineEmits：toggleTheme / switchSection / downloadResume
// 插槽 #left / #actions 保留（向后兼容）
const props = defineProps({
  theme: { type: String, default: 'light' },
  activeSection: { type: String, default: 'intro' },
  sections: { type: Array, default: () => [] },
  avatarUrl: { type: String, default: '' },
  isAuthed: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false }
})

const emit = defineEmits(['toggleTheme', 'switchSection', 'downloadResume', 'login', 'logout', 'toggleEdit'])
</script>

<template>
  <header class="topbar">
    <!-- 左：头像 + LOGO（点击回关于我） -->
    <div class="brand" role="button" title="回到关于我" @click="emit('switchSection', 'intro')">
      <img class="brand-avatar" :src="avatarUrl" alt="avatar" />
      <span class="brand-name">PORTFOLIO</span>
    </div>

    <!-- 中：导航链接组 -->
    <nav class="nav-links">
      <a
        v-for="sec in props.sections"
        :key="sec.id"
        href="#"
        class="nav-item"
        :class="{ active: sec.id === props.activeSection }"
        :aria-current="sec.id === props.activeSection ? 'page' : undefined"
        @click.prevent="emit('switchSection', sec.id)"
      >
        {{ sec.label }}
      </a>
    </nav>

    <!-- 右：登录状态 -->
    <div class="actions">
      <!-- 未认证：显示登录入口；已认证：编辑开关 + 退出 -->
      <el-button v-if="!props.isAuthed" round size="small" @click="emit('login')">
        🔐 登录
      </el-button>
      <template v-else>
        <el-button
          round
          size="small"
          :type="props.isEditing ? 'primary' : ''"
          @click="emit('toggleEdit')"
        >
          {{ props.isEditing ? '✓ 完成编辑' : '✏️ 编辑' }}
        </el-button>
        <el-button round size="small" type="primary" @click="emit('logout')">
          退出登录
        </el-button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 32px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

/* ===== 品牌区（左） ===== */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  cursor: pointer;
}

.brand-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-soft);
}

.brand-name {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--title);
}

/* ===== 导航链接（中） ===== */
.nav-links {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.nav-item {
  padding: 8px 18px;
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 999px;
  transition: all 0.2s;
  font-weight: 500;
}

.nav-item:hover {
  color: var(--title);
}

/* 当前激活项：深色圆角胶囊，参考图"关于我" */
.nav-item.active {
  background: var(--primary);
  color: #fff;
}

/* ===== 右侧按钮（右） ===== */
.actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  align-items: center;
  /* Element Plus 主色对齐站点近黑色 */
  --el-color-primary: var(--primary);
  --el-color-primary-light-3: var(--primary);
  --el-color-primary-light-5: var(--primary);
  --el-color-primary-light-7: var(--primary-soft);
  --el-color-primary-light-8: var(--bg-soft);
  --el-color-primary-light-9: var(--bg-soft);
  --el-color-primary-dark-2: var(--primary);
}

.actions .el-button + .el-button { margin-left: 0; }

@media (max-width: 860px) {
  .topbar { padding: 12px 16px; gap: 12px; }
  .nav-links { gap: 2px; }
  .nav-item { padding: 6px 12px; font-size: 13px; }
}

@media (max-width: 600px) {
  .brand-name { display: none; }
  .topbar { flex-wrap: wrap; }
}
</style>
