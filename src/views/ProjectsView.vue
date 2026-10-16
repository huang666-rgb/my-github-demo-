<script setup>
import ProjectList from '../components/ProjectList.vue'
import { useRouter } from 'vue-router'

// 作品集视图
// defineProps：projects（项目列表）/ moodEmojis（心情 emoji 数组）
// defineModel：moodIndex（当前心情下标，点击 emoji 切换）
defineOptions({ inheritAttrs: false }) // 未声明的 props/事件不透传到根元素

const props = defineProps({
  projects: { type: Array, default: () => [] },
  moodEmojis: { type: Array, default: () => [] }
})

const moodIndex = defineModel('moodIndex', { type: Number, default: 0 })

// 点击卡片换心情（循环切换）
const toggleMood = () => {
  moodIndex.value = (moodIndex.value + 1) % props.moodEmojis.length
}

// ProjectList emit 上报项目 id → 带路由参数跳转到详情页 /projects/:id
const router = useRouter()
const openProject = (id) => router.push('/projects/' + id)
</script>

<template>
  <!-- ============ 作品集 ============ -->
  <section id="projects" class="page-section">
    <div class="page-head">
      <div class="page-tag">● WORKS / 作品集</div>
      <h2 class="page-title">
        做过的小项目
        <span class="mood-emoji" @click="toggleMood" title="点我换心情">{{ moodEmojis[moodIndex] }}</span>
      </h2>
      <p class="page-desc">这些是我学习过程中独立完成的小项目，覆盖小游戏、Web 应用、工具类等。</p>
    </div>

    <ProjectList :projects="projects" @open="openProject" />

    <div class="projects-foot">
      <span>共 {{ projects.length }} 个项目</span>
    </div>
  </section>
</template>

<style scoped>
/* ============ 通用页面区 ============ */
.page-section {
  padding: 20px 8px 40px;
  animation: fadeIn 0.3s ease;
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
  display: flex;
  align-items: center;
  gap: 10px;
}
.page-desc {
  font-size: 14px;
  color: var(--text-muted);
  max-width: 640px;
  line-height: 1.7;
}

/* ============ 作品集页 ============ */
.mood-emoji {
  font-size: 28px;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s;
}
.mood-emoji:hover { transform: scale(1.15) rotate(8deg); }
.projects-foot {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--text-muted);
}
.btn-outline {
  display: inline-block;
  padding: 12px 28px;
  border: 1px solid var(--border);
  color: var(--title);
  background: transparent;
  border-radius: 999px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}
.btn-outline:hover { border-color: var(--primary); color: var(--primary); }

@media (max-width: 640px) {
  .page-title { font-size: 28px; }
}
</style>
