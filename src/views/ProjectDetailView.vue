<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 项目详情视图：动态路由 /projects/:id
// route.params.id 就是路由参数（字符串），用它到 projects 里查出对应项目
defineOptions({ inheritAttrs: false }) // 未声明的 props/事件不透传到根元素

const props = defineProps({
  projects: { type: Array, default: () => [] }
})

const route = useRoute()
const router = useRouter()

// 根据路由参数 id 查当前项目（params 值是字符串，两边都 String() 对齐）
const project = computed(() =>
  props.projects.find((p) => String(p.id) === String(route.params.id))
)

// 上一个 / 下一个项目：体现用路由参数在详情页之间跳转
const currentIndex = computed(() =>
  props.projects.findIndex((p) => String(p.id) === String(route.params.id))
)
const prevProject = computed(() =>
  currentIndex.value > 0 ? props.projects[currentIndex.value - 1] : null
)
const nextProject = computed(() =>
  currentIndex.value < props.projects.length - 1
    ? props.projects[currentIndex.value + 1]
    : null
)

const goDetail = (id) => router.push('/projects/' + id)
</script>

<template>
  <section class="page-section">
    <!-- 兜底：URL 里的 id 查不到对应项目 -->
    <div v-if="!project" class="empty-state">
      <div class="empty-icon">🔍</div>
      <p>没有找到该项目（id: {{ route.params.id }}）</p>
      <a class="btn-outline" href="#" @click.prevent="router.push('/projects')">← 返回作品集</a>
    </div>

    <template v-else>
      <!-- 顶部：返回 + 项目编号 -->
      <div class="detail-top">
        <a class="back-link" href="#" @click.prevent="router.push('/projects')">← 返回作品集</a>
        <span class="detail-id">PROJECT #{{ String(project.id).padStart(2, '0') }}</span>
      </div>

      <div class="detail-layout">
        <!-- 左：封面大图 -->
        <div class="detail-cover" :style="{ backgroundImage: 'url(' + project.image + ')' }"></div>

        <!-- 右：项目信息 -->
        <div class="detail-info">
          <h2 class="detail-title">{{ project.name }}</h2>
          <p class="detail-desc">{{ project.desc }}</p>

          <div class="detail-block">
            <h3>技术栈</h3>
            <div class="tag-row">
              <span v-for="t in project.tech" :key="t" class="tag">#{{ t }}</span>
            </div>
          </div>

          <div class="detail-block">
            <h3>项目亮点</h3>
            <ul class="detail-points">
              <li v-for="(pt, i) in project.highlights" :key="i">{{ pt }}</li>
            </ul>
          </div>

          <div class="btn-row">
            <a class="btn-primary" :href="project.link" target="_blank">访问项目 ↗</a>
          </div>
        </div>
      </div>

      <!-- 上一个 / 下一个：路由参数跳转 -->
      <div class="detail-nav">
        <a v-if="prevProject" class="detail-nav-btn" href="#" @click.prevent="goDetail(prevProject.id)">
          ← {{ prevProject.name }}
        </a>
        <span v-else></span>
        <a v-if="nextProject" class="detail-nav-btn" href="#" @click.prevent="goDetail(nextProject.id)">
          {{ nextProject.name }} →
        </a>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page-section {
  padding: 20px 8px 40px;
  animation: fadeIn 0.3s ease;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 顶部返回行 */
.detail-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}
.back-link {
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}
.back-link:hover { color: var(--primary); }
.detail-id {
  font-size: 12px;
  letter-spacing: 2px;
  color: var(--text-muted);
  background: var(--bg-soft);
  padding: 5px 12px;
  border-radius: 999px;
}

/* 双栏：左图右文 */
.detail-layout {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  align-items: start;
}
.detail-cover {
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 18px;
  background-size: cover;
  background-position: center;
  background-color: var(--primary-soft);
  box-shadow: var(--shadow-hover);
}
.detail-title {
  font-size: 34px;
  font-weight: 800;
  color: var(--title);
  margin-bottom: 10px;
}
.detail-desc {
  font-size: 15px;
  color: var(--text-muted);
  margin-bottom: 24px;
}
.detail-block { margin-bottom: 22px; }
.detail-block h3 {
  font-size: 14px;
  font-weight: 600;
  color: var(--title);
  margin-bottom: 10px;
}
.tag-row { display: flex; flex-wrap: wrap; gap: 8px; }
.tag {
  font-size: 12px;
  padding: 5px 14px;
  background: var(--primary-soft);
  color: var(--text-muted);
  border-radius: 999px;
}
.detail-points {
  list-style: none;
  padding: 0;
}
.detail-points li {
  position: relative;
  padding-left: 18px;
  font-size: 14px;
  line-height: 1.9;
  color: var(--text);
}
.detail-points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--primary);
}

/* 按钮 */
.btn-row { display: flex; gap: 12px; margin-top: 26px; }
.btn-primary {
  display: inline-block;
  padding: 12px 28px;
  background: var(--primary);
  color: #fff;
  border-radius: 999px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.88; }
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

/* 上一个 / 下一个 */
.detail-nav {
  display: flex;
  justify-content: space-between;
  margin-top: 36px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}
.detail-nav-btn {
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  transition: all 0.2s;
}
.detail-nav-btn:hover {
  color: var(--primary);
  border-color: var(--primary);
  transform: translateY(-2px);
}

/* 兜底空状态 */
.empty-state {
  padding: 80px 8px;
  text-align: center;
  color: var(--text-muted);
  font-size: 14px;
}
.empty-icon { font-size: 36px; margin-bottom: 12px; }
.empty-state .btn-outline { margin-top: 18px; }

@media (max-width: 860px) {
  .detail-layout { grid-template-columns: 1fr; gap: 24px; }
  .detail-title { font-size: 26px; }
}
</style>
