<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useArticleStore } from '../stores/article'

// 文章详情视图（动态路由 /articles/:id）
defineOptions({ inheritAttrs: false })

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()

const article = computed(() => articleStore.getById(route.params.id))

// 上一篇 / 下一篇（基于列表顺序）
const idx = computed(() =>
  article.value ? articleStore.articles.findIndex((a) => a.id === article.value.id) : -1
)
const prev = computed(() => (idx.value > 0 ? articleStore.articles[idx.value - 1] : null))
const next = computed(() =>
  idx.value >= 0 && idx.value < articleStore.articles.length - 1
    ? articleStore.articles[idx.value + 1]
    : null
)

const paragraphs = computed(() =>
  article.value ? article.value.content.split('\n').filter((p) => p.trim()) : []
)

const goList = () => router.push('/articles')
const openOther = (id) => router.push('/articles/' + id)
</script>

<template>
  <section class="page-section">
    <a class="back-link" href="#" @click.prevent="goList">← 返回文章列表</a>

    <article v-if="article" class="article-detail">
      <div class="meta-row">
        <span class="tag">{{ article.tag }}</span>
        <span>{{ article.date }}</span>
        <span>约 {{ article.readTime }} 分钟阅读</span>
      </div>
      <h1 class="title">{{ article.title }}</h1>
      <p class="summary">{{ article.summary }}</p>

      <div class="content">
        <p v-for="(p, i) in paragraphs" :key="i">{{ p }}</p>
      </div>

      <!-- 上一篇 / 下一篇 -->
      <nav class="pager">
        <button v-if="prev" class="pager-item" @click="openOther(prev.id)">
          <span class="pager-label">上一篇</span>
          <span class="pager-title">{{ prev.title }}</span>
        </button>
        <span v-else />
        <button v-if="next" class="pager-item right" @click="openOther(next.id)">
          <span class="pager-label">下一篇</span>
          <span class="pager-title">{{ next.title }}</span>
        </button>
      </nav>
    </article>

    <div v-else class="not-found">
      <div class="nf-icon">🔍</div>
      <p>没有找到这篇文章</p>
      <button class="back-btn" @click="goList">返回文章列表</button>
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
.back-link {
  display: inline-block;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
  margin-bottom: 24px;
}
.back-link:hover { color: var(--primary); }

.article-detail {
  max-width: 760px;
  margin: 0 auto;
}
.meta-row {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 14px;
}
.tag {
  color: var(--primary);
  background: var(--primary-soft);
  padding: 2px 12px;
  border-radius: 999px;
}
.title {
  font-size: 32px;
  font-weight: 800;
  color: var(--title);
  line-height: 1.3;
  margin-bottom: 10px;
}
.summary {
  font-size: 15px;
  color: var(--text-muted);
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 24px;
}
.content p {
  font-size: 15px;
  line-height: 1.9;
  color: var(--text);
  margin-bottom: 16px;
}

.pager {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
}
.pager-item {
  flex: 1;
  text-align: left;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 18px;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
  max-width: 48%;
}
.pager-item.right { text-align: right; }
.pager-item:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}
.pager-label {
  display: block;
  font-size: 11px;
  color: var(--text-muted);
  margin-bottom: 4px;
}
.pager-title {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--title);
}

.not-found {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}
.nf-icon { font-size: 40px; margin-bottom: 12px; }
.back-btn {
  margin-top: 16px;
  padding: 8px 20px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-family: inherit;
  font-size: 13px;
}

@media (max-width: 640px) {
  .title { font-size: 24px; }
  .pager { flex-direction: column; }
  .pager-item { max-width: 100%; text-align: left !important; }
}
</style>
