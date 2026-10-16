import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 文章 Store：管理文章列表（已发布）+ 草稿箱 + localStorage 持久化
// 每篇文章有 status 字段：'published'（已发布，出现在文章列表）/ 'draft'（草稿，只在草稿箱）
export const useArticleStore = defineStore('article', () => {
  const seed = [
    {
      id: 1,
      title: 'Vue3 组件通信总结',
      summary: '一文搞懂 defineProps / defineEmits / defineModel 三件套的使用场景与区别。',
      content:
        'Vue3 的 <script setup> 提供了三个编译宏来处理组件通信。\n\n## defineProps\n父 → 子单向传值，子组件只读。适合传递列表数据、配置项。\n\n## defineEmits\n子 → 父事件上报。适合按钮点击、表单提交等需要父组件响应的场景。\n\n## defineModel\n父子双向绑定，是 props + emit 的语法糖。适合输入框等可编辑字段。\n\n三者的核心区别在于数据流向：props 单向下发、emit 单向上报、model 双向同步。',
      tag: 'Vue',
      date: '2026-09-20',
      readTime: 5,
      status: 'published'
    },
    {
      id: 2,
      title: '从前端小白到独立交付项目',
      summary: '记录我从大二接触 HTML 到现在能独立做小项目的学习路径与踩坑经验。',
      content:
        '回头看这一年多的前端学习路径，大致经历了这几个阶段：\n\n1. HTML/CSS 基础：先把页面"画"出来，理解盒子模型、Flex 布局\n2. JavaScript 进阶：闭包、this、异步是三座大山，跨过去就入门了\n3. 框架实战：Vue2 到 Vue3，组件化思维是最大转变\n4. 工程化：npm、Vite、构建部署，真正能"交付"项目\n\n最大的体会是：别只看视频，一定要动手做小项目，哪怕是接金币小游戏这种。',
      tag: '成长',
      date: '2026-09-15',
      readTime: 8,
      status: 'published'
    },
    {
      id: 3,
      title: '我的第一个微信小程序上线了',
      summary: '从需求分析到上线审核，分享独立开发一个小程序的完整流程与踩坑。',
      content:
        '小程序开发流程分享：\n\n- 需求分析：确定核心功能，别贪多\n- 注册账号 + AppID：个人主体也能注册\n- WXML/WXSS：类 HTML/CSS 但有差异\n- 调接口：注意域名白名单配置\n- 提交审核：第一次被拒了，改了交互描述才过\n\n最坑的是审核，文案要避免"最""第一"这类绝对化用语。',
      tag: '小程序',
      date: '2026-09-10',
      readTime: 6,
      status: 'published'
    }
  ]

  const loadFromStorage = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('articles') || 'null')
      // 旧数据兼容：没有 status 字段默认为已发布
      if (saved && Array.isArray(saved)) {
        return saved.map((a) => ({ ...a, status: a.status || 'published' }))
      }
      return seed
    } catch {
      return seed
    }
  }

  const articles = ref(loadFromStorage())

  const persist = () => localStorage.setItem('articles', JSON.stringify(articles.value))

  // 已发布列表（文章列表页只显示这些）
  const published = computed(() => articles.value.filter((a) => a.status === 'published'))
  // 草稿箱
  const drafts = computed(() => articles.value.filter((a) => a.status === 'draft'))

  const calcReadTime = (content) => Math.max(1, Math.ceil((content || '').length / 200))

  // 新建文章：draft=true 存草稿，false 直接发布
  const createArticle = (data, { draft = false } = {}) => {
    const id = Date.now()
    articles.value.unshift({
      id,
      title: data.title || '无标题',
      summary: data.summary || '',
      content: data.content || '',
      tag: data.tag || '随笔',
      date: new Date().toISOString().slice(0, 10),
      readTime: calcReadTime(data.content),
      status: draft ? 'draft' : 'published'
    })
    persist()
    return id
  }

  // 修改（草稿/已发布都可用）
  const updateArticle = (id, data) => {
    const item = articles.value.find((a) => a.id === id)
    if (!item) return false
    Object.assign(item, data)
    if (data.content !== undefined) item.readTime = calcReadTime(data.content)
    persist()
    return true
  }

  // 把草稿发布：改状态 + 刷新日期
  const publishDraft = (id) => {
    const item = articles.value.find((a) => a.id === id)
    if (!item) return false
    item.status = 'published'
    item.date = new Date().toISOString().slice(0, 10)
    persist()
    return true
  }

  // 已发布转回草稿（下架）
  const unpublish = (id) => {
    const item = articles.value.find((a) => a.id === id)
    if (!item) return false
    item.status = 'draft'
    persist()
    return true
  }

  const removeArticle = (id) => {
    articles.value = articles.value.filter((a) => a.id !== id)
    persist()
  }

  const getById = (id) => articles.value.find((a) => String(a.id) === String(id))

  return {
    articles,
    published,
    drafts,
    createArticle,
    updateArticle,
    publishDraft,
    unpublish,
    removeArticle,
    getById
  }
})
