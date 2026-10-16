<script setup>
// ProjectList 组件：作品集卡片网格（可复用）
// 作用域插槽（带默认内容），父组件按需定制单张卡片，无需复制整段网格结构：
// - #image="{ item, index }"：自定义图片区（默认渲染封面图）
// - #info="{ item, index }" ：自定义信息区（默认渲染标题 + 描述）
defineProps({
  projects: { type: Array, default: () => [] }
})

// 点击卡片：把项目 id 上报给父组件，由父组件跳转到详情页 /projects/:id
const emit = defineEmits(['open'])
</script>

<template>
  <div class="projects-grid">
    <a
      v-for="(item, index) in projects"
      :key="item.id"
      class="project-card"
      href="#"
      @click.prevent="emit('open', item.id)"
    >
      <slot name="image" :item="item" :index="index">
        <div
          class="project-img"
          :style="{ backgroundImage: 'url(' + item.image + ')' }"
        ></div>
      </slot>

      <slot name="info" :item="item" :index="index">
        <div class="project-info">
          <h3>{{ item.name }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </slot>
    </a>
  </div>
</template>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.project-card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background: var(--bg-card);
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: box-shadow 0.2s;
}

.project-card:hover {
  box-shadow: var(--shadow-hover);
}

.project-img {
  width: 100%;
  height: 220px;
  background-size: cover;
  background-position: center;
  background-color: var(--primary-soft);
}

/* 窄屏自适应，避免图片被挤得过小 */
@media (max-width: 860px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.project-info {
  padding: 16px;
}

.project-info h3 {
  font-size: 16px;
  color: var(--title);
  margin-bottom: 8px;
  font-weight: 600;
}

.project-info p {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.6;
}
</style>
