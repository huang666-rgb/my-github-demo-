<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import { useProfileStore } from './stores/profile'
import { useProjectStore } from './stores/project'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'

/* Pinia：身份认证 / 个人信息 / 作品集 三个 Store 分别管理共享状态 */
const authStore = useAuthStore()
const profileStore = useProfileStore()
const projectStore = useProjectStore()

/* ===== 图片持久化工具：压缩 + base64 + localStorage =====
   blob URL 刷新即失效，所以把图片压缩后以 dataURL 存入 localStorage。
   localStorage 通常上限 5MB，压缩到最长边 900px、JPEG 0.82 后一般 <500KB。 */
const compressImage = (file, maxSize = 900) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxSize || height > maxSize) {
          const scale = maxSize / Math.max(width, height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.82))
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

const saveImage = async (key, file) => {
  try {
    const dataUrl = await compressImage(file)
    localStorage.setItem(key, dataUrl)
    return dataUrl
  } catch (e) {
    console.error('图片保存失败', e)
    return ''
  }
}

/* ===== 主题（保留，后续可扩展） ===== */
const theme = ref('light')
watch(theme, (val) => {
  localStorage.setItem('theme', val)
  document.documentElement.setAttribute('data-theme', val)
})
onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved) theme.value = saved
  document.documentElement.setAttribute('data-theme', theme.value)
})

/* ===== 路由导航 =====
   activeSection 由当前路由派生：/ → intro，取 path 第一段（/projects/3 → projects），
   这样动态路由详情页也能让「作品集」保持高亮 */
const route = useRoute()
const router = useRouter()

const activeSection = computed(() =>
  route.path === '/' ? 'intro' : route.path.replace(/^\//, '').split('/')[0]
)

const sections = [
  { id: 'intro', label: '关于我' },
  { id: 'skills', label: '技能兴趣' },
  { id: 'projects', label: '作品集' },
  { id: 'articles', label: '文章' },
  { id: 'contact', label: '联系我' }
]

// 内容区引用：路由切换后把滚动容器（.content）重置回顶部
const contentRef = ref(null)
watch(
  () => route.path,
  () => {
    nextTick(() => {
      if (contentRef.value) contentRef.value.scrollTop = 0
    })
  }
)

// 子组件（Header / 各视图）通过 emit 上报要去的页面，由这里统一 router.push
const onSwitchSection = (id) => {
  if (activeSection.value === id) return
  router.push(id === 'intro' ? '/' : '/' + id)
}

/* ===== 编辑模式（认证后可切换，控制文字/技能编辑开关） ===== */
const isEditing = ref(false)

/* ===== 身份认证：统一走 Pinia store（useAuthStore） =====
   store 内部维护 isAuthed（sessionStorage）和 password（localStorage），
   组件不再直接操作存储，刷新页面时 store 自动恢复状态 */
const isAuthed = computed(() => authStore.isAuthed)
// 退出登录
const onLogout = () => {
  authStore.logout()
  isEditing.value = false
  router.push('/')
}

// 进入 / 退出编辑模式（只有本人认证后可用，认证页可修改密码）
const onToggleEdit = () => {
  if (!authStore.isAuthed) return
  isEditing.value = !isEditing.value
}

/* ===== 个人信息 / 图片 / 联系方式 / 技能：统一由 profileStore 管理 =====
   state、getters、actions 都在 store 里，组件只负责调用与绑定 */
// v-model 绑定：直接绑到 store 的 state 属性（Pinia state 可写）
// 上传处理：压缩后调 store 的 setAvatar / setPhoto 落地持久化
const uploadAvatar = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  const dataUrl = await saveImage('avatarUrl', file)
  if (dataUrl) profileStore.setAvatar(dataUrl)
  event.target.value = ''
}
const uploadPhoto = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  const dataUrl = await saveImage('photoUrl', file)
  if (dataUrl) profileStore.setPhoto(dataUrl)
  event.target.value = ''
}

// 技能增删改：委托给 store action
const addSkill = (payload) => profileStore.addSkill(payload)
const removeSkill = (id) => profileStore.removeSkill(id)
const toggleDetail = (item) => profileStore.toggleSkillDetail(item)

// 下载简历（暂无 PDF 文件，预留入口；后续把简历放到 public/简历.pdf 即可）
const onDownloadResume = () => {
  console.log('[Resume] 下载简历')
  // 真实文件就绪后：window.open('/简历.pdf', '_blank')
}

/* ===== profileStore 持久化订阅 =====
   文字 / 联系方式变动 → 写 profileTexts；技能变动 → 写 skillsData。
   图片走 setAvatar/setPhoto 已自行写入，无需在此重复处理。 */
onMounted(() => {
  profileStore.$subscribe((mutation, state) => {
    // 仅当相关字段变化时写文字块
    profileStore.persistTexts()
    // 技能数组若变了再写（轻量判断：每次都写也无妨，数据量小）
    profileStore.persistSkills()
  })
})
</script>

<template>
  <div class="page">
    <Header
      :theme="theme"
      :active-section="activeSection"
      :sections="sections"
      :avatar-url="profileStore.avatarUrl"
      :is-authed="isAuthed"
      :is-editing="isEditing"
      @toggle-theme="() => {}"
      @switch-section="onSwitchSection"
      @download-resume="onDownloadResume"
      @login="router.push('/auth')"
      @logout="onLogout"
      @toggle-edit="onToggleEdit"
    />

    <main ref="contentRef" class="content">
      <!-- SPA 路由出口：当前路由对应的视图组件 -->
      <router-view v-slot="{ Component }">
        <component
          :is="Component"
          :is-authed="isAuthed"
          :is-editing="isEditing"
          :photo-url="profileStore.photoUrl"
          :skills="profileStore.skills"
          :projects="projectStore.projects"
          :mood-emojis="projectStore.moodEmojis"
          :github="profileStore.github"
          :email="profileStore.email"
          v-model:name="profileStore.name"
          v-model:major-class="profileStore.majorClass"
          v-model:direction="profileStore.direction"
          v-model:intro="profileStore.intro"
          v-model:motto="profileStore.motto"
          v-model:search-text="profileStore.searchText"
          v-model:mood-index="projectStore.moodIndex"
          @toggle-detail="toggleDetail"
          @add-skill="addSkill"
          @remove-skill="removeSkill"
          @upload-photo="uploadPhoto"
          @switch-section="onSwitchSection"
          @download-resume="onDownloadResume"
        />
      </router-view>
    </main>

    <Footer
      :is-editing="isEditing"
      v-model:email="profileStore.email"
      v-model:github="profileStore.github"
    />
  </div>
</template>

<style>
/* ===== 全局基础样式与主题变量（参考图：米白底 + 近黑文字 + 柔和灰调） ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

:root {
  --bg-page: #FAFAF7;       /* 页面底极浅米白 */
  --bg-card: #FFFFFF;       /* 纯白卡片 */
  --bg-soft: #F5F3EF;       /* 个人理念卡 / NOW 标签卡 / 胶囊标签底 */
  --title: #1A1A1A;          /* 近黑标题 */
  --text: #333333;           /* 主文字 */
  --text-muted: #8B8075;     /* 棕灰副文字 */
  --primary: #2D2D2D;        /* 导航激活项 / 实心按钮 近黑 */
  --primary-soft: #E8E6E1;   /* 描边 / 胶囊浅灰 */
  --border: #E8E6E1;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
  --shadow-hover: 0 8px 32px rgba(0, 0, 0, 0.10);
}

[data-theme="dark"] {
  --bg-page: #1a1a1a;
  --bg-card: #242424;
  --bg-soft: #2d2d2d;
  --title: #FFFFFF;
  --text: #e0e0e0;
  --text-muted: #999;
  --primary: #f5f5f5;
  --primary-soft: #3a3a3a;
  --border: #3a3a3a;
}

html, body { height: 100%; }

body {
  background: var(--bg-page);
  color: var(--text);
  font-family: "PingFang SC", "Microsoft YaHei", -apple-system, sans-serif;
  line-height: 1.6;
  overflow: hidden;
}

#app { height: 100vh; }

.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--bg-card);
  overflow: hidden;
}

.content {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  overflow-y: auto;
  scroll-behavior: smooth;
  padding: 28px 64px;
}

/* 共享表单控件（编辑模式用，保持样式）
   排除 Element Plus 内部 input，否则 EP 外框 + 内框会出现两个矩形 */
input[type="text"]:not(.el-input__inner),
textarea:not(.el-textarea__inner) {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 10px;
  background: #fff;
  color: var(--text);
  outline: none;
}

input[type="text"]:not(.el-input__inner):focus,
textarea:not(.el-textarea__inner):focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(45, 45, 45, 0.08);
}

textarea { min-height: 100px; resize: vertical; }

@media (max-width: 600px) {
  .content { padding: 20px; }
}
</style>
