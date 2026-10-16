<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useArticleStore } from '../stores/article'

// 文章管理视图（需认证）：已发布 / 草稿箱 两个 tab + 新建/编辑/删除
defineOptions({ inheritAttrs: false })

const props = defineProps({
  isAuthed: { type: Boolean, default: false }
})

const router = useRouter()
const articleStore = useArticleStore()

const publishedList = computed(() => articleStore.published)
const draftList = computed(() => articleStore.drafts)

// 当前 tab：published / drafts
const tab = ref('published')
const currentList = computed(() => (tab.value === 'published' ? publishedList.value : draftList.value))

// 编辑状态：editing=某篇 id / creating=true 新建；同时只一个为真
const editing = ref(null)
const creating = ref(false)
const editingStatus = ref('published') // 正在编辑的文章原来是已发布还是草稿
const form = reactive({ title: '', summary: '', content: '', tag: '随笔' })
const msg = ref('')

const TAGS = ['Vue', '成长', '小程序', 'JavaScript', '随笔']

// 新建
const startCreate = () => {
  editing.value = null
  creating.value = true
  form.title = ''
  form.summary = ''
  form.content = ''
  form.tag = '随笔'
  msg.value = ''
}
// 编辑（记录原来是已发布还是草稿，用于保存后回对应 tab）
const startEdit = (item) => {
  creating.value = false
  editing.value = item.id
  editingStatus.value = item.status
  form.title = item.title
  form.summary = item.summary
  form.content = item.content
  form.tag = item.tag
  msg.value = ''
}
const cancel = () => {
  editing.value = null
  creating.value = false
  msg.value = ''
}
// 发布：新建直接发布 / 编辑草稿后发布
const publish = () => {
  if (!form.title.trim()) { msg.value = '请填写标题'; return }
  if (creating.value) {
    const id = articleStore.createArticle({ ...form }, { draft: false })
    msg.value = '发布成功'
    setTimeout(() => router.push('/articles/' + id), 800)
  } else if (editing.value) {
    articleStore.updateArticle(editing.value, { ...form })
    // 草稿 → 发布
    if (editingStatus.value === 'draft') articleStore.publishDraft(editing.value)
    msg.value = '发布成功'
    setTimeout(() => { cancel(); tab.value = 'published' }, 800)
  }
}
// 存为草稿：新建存草稿 / 已有更新内容（草稿留草稿，已发布则下架回草稿）
const saveDraft = () => {
  if (!form.title.trim()) { msg.value = '请填写标题'; return }
  if (creating.value) {
    articleStore.createArticle({ ...form }, { draft: true })
    msg.value = '已存入草稿箱'
    setTimeout(() => { cancel(); tab.value = 'drafts' }, 800)
  } else if (editing.value) {
    articleStore.updateArticle(editing.value, { ...form })
    if (editingStatus.value === 'published') articleStore.unpublish(editing.value)
    msg.value = '已存入草稿箱'
    setTimeout(() => { cancel(); tab.value = 'drafts' }, 800)
  }
}
// 直接把草稿发布（列表里点"发布"按钮，不进编辑器）
const publishFromDraft = (id) => {
  articleStore.publishDraft(id)
}
// 下架已发布回草稿
const toDraft = (id) => {
  articleStore.unpublish(id)
}
// 删除（el-popconfirm 二次确认后触发）
const remove = (id) => {
  articleStore.removeArticle(id)
  if (editing.value === id) cancel()
}
const goList = () => router.push('/articles')
</script>

<template>
  <section class="page-section">
    <div class="page-head">
      <div class="page-tag">● MANAGE / 文章管理</div>
      <h2 class="page-title">管理文章</h2>
      <div class="head-actions">
        <a class="link" href="#" @click.prevent="goList">← 返回列表</a>
        <button class="btn-primary" @click="startCreate">＋ 写新文章</button>
      </div>
    </div>

    <!-- 未认证提示 -->
    <div v-if="!props.isAuthed" class="locked">
      <div class="lock-icon">🔒</div>
      <p>只有本人认证后才能管理文章</p>
      <a class="link" href="#" @click.prevent="router.push('/auth')">去认证 →</a>
    </div>

    <template v-else>
      <!-- 编辑器 -->
      <div v-if="creating || editing" class="editor">
        <h3 class="editor-title">{{ creating ? '写新文章' : '编辑文章' }}</h3>
        <el-form label-position="top">
          <el-form-item label="标题">
            <el-input v-model="form.title" placeholder="文章标题" />
          </el-form-item>
          <el-form-item label="摘要">
            <el-input v-model="form.summary" type="textarea" :rows="2" placeholder="一句话摘要" />
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="form.tag" placeholder="选择标签">
              <el-option v-for="t in TAGS" :key="t" :label="t" :value="t" />
            </el-select>
          </el-form-item>
          <el-form-item label="正文（换行分段）">
            <el-input v-model="form.content" type="textarea" :rows="10" placeholder="写下你的内容..." />
          </el-form-item>
        </el-form>
        <div class="editor-actions">
          <!-- 发布 → 进文章列表 -->
          <el-button type="primary" @click="publish">发布</el-button>
          <!-- 存草稿 → 进草稿箱 -->
          <el-button @click="saveDraft">存为草稿</el-button>
          <el-button @click="cancel">取消</el-button>
          <span v-if="msg" class="msg">{{ msg }}</span>
        </div>
      </div>

      <!-- 列表（无编辑器时） -->
      <div v-else class="manage-wrap">
        <!-- tab 切换 -->
        <el-tabs v-model="tab" class="manage-tabs">
          <el-tab-pane name="published" :label="`已发布 (${publishedList.length})`" />
          <el-tab-pane name="drafts" :label="`草稿箱 (${draftList.length})`" />
        </el-tabs>

        <div class="manage-list">
          <div v-for="item in currentList" :key="item.id" class="manage-item">
            <div class="mi-main">
              <span class="mi-tag">{{ item.tag }}</span>
              <span class="mi-title">{{ item.title }}</span>
              <span class="mi-date">{{ item.date }}</span>
            </div>
            <div class="mi-actions">
              <el-button size="small" @click="startEdit(item)">编辑</el-button>
              <!-- 草稿：可发布；已发布：可下架 -->
              <el-button
                v-if="item.status === 'draft'"
                size="small"
                type="primary"
                @click="publishFromDraft(item.id)"
              >发布</el-button>
              <el-button
                v-else
                size="small"
                @click="toDraft(item.id)"
              >下架</el-button>
              <el-popconfirm
                title="确认删除这篇文章？"
                confirm-button-text="删除"
                cancel-button-text="取消"
                @confirm="remove(item.id)"
              >
                <template #reference>
                  <el-button size="small" type="danger" plain>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </div>
          <div v-if="!currentList.length" class="empty">
            {{ tab === 'published' ? '还没有已发布文章' : '草稿箱是空的' }}，点击「写新文章」开始
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.page-section {
  padding: 20px 8px 40px;
  animation: fadeIn 0.3s ease;
  /* Element Plus 主色对齐站点近黑色 */
  --el-color-primary: var(--primary);
  --el-color-primary-light-3: var(--primary);
  --el-color-primary-light-5: var(--primary);
  --el-color-primary-light-7: var(--primary-soft);
  --el-color-primary-light-8: var(--bg-soft);
  --el-color-primary-light-9: var(--bg-soft);
  --el-color-primary-dark-2: var(--primary);
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
}
.page-title { font-size: 32px; font-weight: 800; color: var(--title); margin-bottom: 14px; }
.head-actions { display: flex; align-items: center; gap: 16px; }
.link { font-size: 13px; color: var(--text-muted); text-decoration: none; }
.link:hover { color: var(--primary); }
.btn-primary {
  padding: 8px 18px;
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  font-size: 13px;
  font-family: inherit;
}
.btn-primary:hover { opacity: 0.88; }

.locked {
  text-align: center;
  padding: 60px 0;
  color: var(--text-muted);
}
.lock-icon { font-size: 40px; margin-bottom: 12px; }

.editor {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  max-width: 760px;
  margin: 0 auto 28px;
}
.editor-title { font-size: 18px; font-weight: 700; color: var(--title); margin-bottom: 18px; }
.editor :deep(.el-form-item__label) {
  font-size: 12px;
  color: var(--text-muted);
}
.editor :deep(.el-select) { width: 100%; }
.editor-actions { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.editor-actions .el-button { border-radius: 999px; }
.editor-actions .el-button + .el-button { margin-left: 0; }
.msg { font-size: 13px; color: #4CAF50; }

/* tab 切换 */
.manage-wrap { max-width: 860px; margin: 0 auto; }
.manage-tabs { margin-bottom: 18px; }
.manage-tabs :deep(.el-tabs__item) { font-size: 14px; }

.manage-list { display: flex; flex-direction: column; gap: 10px; }
.manage-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 18px;
}
.mi-main { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; }
.mi-tag {
  font-size: 11px;
  color: var(--primary);
  background: var(--primary-soft);
  padding: 2px 10px;
  border-radius: 999px;
  flex-shrink: 0;
}
.mi-title { font-size: 15px; font-weight: 600; color: var(--title); flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mi-date { font-size: 12px; color: var(--text-muted); flex-shrink: 0; }
.mi-actions { display: flex; gap: 8px; align-items: center; }
.mi-actions .el-button { border-radius: 999px; }
.mi-actions .el-button + .el-button { margin-left: 0; }
.empty { text-align: center; padding: 40px; color: var(--text-muted); font-size: 14px; }

@media (max-width: 640px) {
  .page-title { font-size: 26px; }
  .manage-item { flex-direction: column; align-items: flex-start; }
}
</style>
