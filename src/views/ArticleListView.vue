<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../stores/article'

// 文章列表视图
// defineProps：isAuthed（已认证显示"管理"入口）
defineOptions({ inheritAttrs: false })

const props = defineProps({
  isAuthed: { type: Boolean, default: false }
})

const router = useRouter()
const articleStore = useArticleStore()

const list = computed(() => articleStore.published)

const openArticle = (id) => router.push('/articles/' + id)
const goManage = () => router.push('/articles/manage')
</script>

<template>
  <section class="page-section">
    <div class="page-head">
      <div class="page-tag">● BLOG / 文章</div>
      <h2 class="page-title">技术随笔 <span class="smiley" /></h2>
      <p class="page-desc">记录学习路上的踩坑、总结与思考，共 {{ list.length }} 篇已发布。</p>
      <button v-if="props.isAuthed" class="manage-btn" @click="goManage">
        ✏️ 管理文章
      </button>
    </div>

    <div v-if="list.length" class="article-list">
      <article
        v-for="item in list"
        :key="item.id"
        class="article-item"
        @click="openArticle(item.id)"
      >
        <div class="article-main">
          <div class="article-meta">
            <span class="article-tag">{{ item.tag }}</span>
            <span class="article-date">{{ item.date }}</span>
            <span class="article-read">约 {{ item.readTime }} 分钟</span>
          </div>
          <h3 class="article-title">{{ item.title }}</h3>
          <p class="article-summary">{{ item.summary }}</p>
        </div>
        <span class="article-arrow">→</span>
      </article>
    </div>

    <div v-else class="empty">
      <div class="empty-icon">📝</div>
      <p>还没有文章，去管理页写第一篇吧</p>
    </div>
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
}
.smiley {
  display: inline-block;
  width: 36px; height: 36px;
  margin-left: 4px;
  vertical-align: middle;
  background: #B8E8D5;
  border-radius: 50%;
  transform: rotate(-8deg);
}
.page-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 16px;
}
.manage-btn {
  padding: 8px 18px;
  font-size: 13px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
}
.manage-btn:hover { opacity: 0.88; }

.article-list { display: flex; flex-direction: column; gap: 14px; }
.article-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.2s;
}
.article-item:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}
.article-main { flex: 1; min-width: 0; }
.article-meta {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.article-tag {
  color: var(--primary);
  background: var(--primary-soft);
  padding: 2px 10px;
  border-radius: 999px;
}
.article-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--title);
  margin-bottom: 6px;
}
.article-summary {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.7;
}
.article-arrow {
  font-size: 20px;
  color: var(--text-muted);
  transition: transform 0.2s;
}
.article-item:hover .article-arrow {
  transform: translateX(4px);
  color: var(--primary);
}

.empty {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}
.empty-icon { font-size: 40px; margin-bottom: 12px; }

@media (max-width: 640px) {
  .page-title { font-size: 28px; }
  .article-item { padding: 16px; }
}
</style>
