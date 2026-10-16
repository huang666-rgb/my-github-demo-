<script setup>
import { computed } from 'vue'

// 关于我（Hero）视图
// defineProps：photoUrl（Hero 大图）/ skills（取前 4 做能力胶囊）
// defineModel：name / majorClass / direction / intro
// defineEmits：uploadPhoto（上传大图）/ switchSection（"联系我"跳转）/ downloadResume
defineOptions({ inheritAttrs: false }) // 未声明的 props/事件不透传到根元素

const props = defineProps({
  photoUrl: { type: String, default: '' },
  skills: { type: Array, default: () => [] },
  isAuthed: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false }
})

const name = defineModel('name', { type: String, default: '' })
const majorClass = defineModel('majorClass', { type: String, default: '' })
const direction = defineModel('direction', { type: String, default: '' })
const intro = defineModel('intro', { type: String, default: '' })
const motto = defineModel('motto', { type: String, default: '' })

const emit = defineEmits(['uploadPhoto', 'switchSection', 'downloadResume'])

// 简介按换行拆成段落
const introParagraphs = computed(() => intro.value.split('\n'))

// Hero 左栏能力胶囊
const heroTags = computed(() => props.skills.slice(0, 4).map((s) => s.text))
</script>

<template>
  <!-- ============ 关于我（Hero） ============ -->
  <section id="intro" class="hero">
    <!-- 左栏：文字区 -->
    <div class="hero-left">
      <div class="hero-tag">● HELLO / 你好</div>

      <h1 class="hero-title">
        Hi,<br />
        我是 <span class="name">{{ name }}</span>
        <span class="smiley" title="😄"></span>
      </h1>

      <div class="hero-sub">{{ direction }}</div>

      <div class="motto-card">
        <div class="motto-label">个人理念 /</div>
        <div class="motto-text">{{ motto }}</div>
      </div>

      <div class="hero-intro">
        <p v-for="(para, idx) in introParagraphs" :key="idx">{{ para }}</p>
      </div>

      <div class="tag-row">
        <span v-for="t in heroTags" :key="t" class="tag">#{{ t }}</span>
      </div>

      <!-- 按钮行 -->
      <div class="btn-row">
        <a class="btn-outline" href="#" @click.prevent="emit('switchSection', 'contact')">联系我</a>
      </div>

      <!-- 编辑资料面板：认证 + 编辑模式下显示，v-model 直接双向绑定回父组件并自动保存 -->
      <div v-if="props.isEditing && props.isAuthed" class="edit-panel">
        <h3 class="edit-title">✏️ 编辑资料</h3>
        <label class="edit-field">
          <span>姓名</span>
          <input v-model="name" type="text" />
        </label>
        <label class="edit-field">
          <span>专业班级</span>
          <input v-model="majorClass" type="text" />
        </label>
        <label class="edit-field">
          <span>方向</span>
          <input v-model="direction" type="text" />
        </label>
        <label class="edit-field">
          <span>个人理念</span>
          <input v-model="motto" type="text" />
        </label>
        <label class="edit-field">
          <span>个人简介（换行分段）</span>
          <textarea v-model="intro"></textarea>
        </label>
        <p class="edit-tip">改动即时生效，并自动保存到本地，刷新不丢失</p>
      </div>
    </div>

    <!-- 右栏：大图（只有认证本人才能悬停上传更换照片） -->
    <div class="hero-right">
      <div class="hero-photo-wrap">
        <img class="hero-photo" :src="photoUrl" alt="photo" />
        <label v-if="props.isAuthed" class="upload-overlay" title="点击上传你的照片">
          <div class="upload-hint">
            <div class="upload-icon">📷</div>
            <div class="upload-text">点击上传你的照片</div>
            <div class="upload-sub">支持 JPG / PNG / HEIC</div>
          </div>
          <input
            class="upload-input"
            type="file"
            accept="image/*"
            @change="emit('uploadPhoto', $event)"
          />
        </label>
        <!-- 未认证：只显示锁定角标，不能更换照片 -->
        <div v-else class="photo-lock" title="认证后才能更换照片">🔒 未认证</div>
      </div>

      <div class="now-card">
        <div class="now-dot"></div>
        <div class="now-label">NOW</div>
        <div class="now-school">{{ majorClass }}</div>
        <div class="now-status">● 在读</div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============ Hero（关于我）样式 ============ */
.hero {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 40px 20px;
}
.hero-left { max-width: 620px; }
.hero-tag {
  display: inline-block;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  background: var(--bg-soft);
  padding: 6px 14px;
  border-radius: 999px;
  margin-bottom: 20px;
  letter-spacing: 1px;
}
.hero-title {
  font-size: 56px;
  font-weight: 800;
  color: var(--title);
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
}
.hero-title .name { color: var(--primary); }
.smiley {
  display: inline-block;
  width: 44px;
  height: 44px;
  margin-left: 6px;
  vertical-align: middle;
  position: relative;
  background: #B8E8D5;
  border-radius: 50%;
  transform: rotate(-8deg);
  box-shadow: 0 3px 10px rgba(0,0,0,0.12);
}
.smiley::before {
  content: '';
  position: absolute;
  top: 38%; left: 22%; width: 10px; height: 10px;
  background: var(--primary); border-radius: 50%;
  box-shadow: 18px 0 0 var(--primary);
}
.smiley::after {
  content: '';
  position: absolute;
  bottom: 26%; left: 28%; width: 22px; height: 11px;
  border-bottom: 2.5px solid var(--primary);
  border-radius: 0 0 22px 22px;
}
.hero-sub {
  font-size: 16px;
  color: var(--text-muted);
  font-weight: 400;
  margin-bottom: 28px;
  letter-spacing: 1px;
}
.motto-card {
  background: var(--bg-soft);
  border-radius: 10px;
  padding: 14px 18px;
  margin-bottom: 24px;
}
.motto-label { font-size: 11px; color: var(--text-muted); margin-bottom: 4px; letter-spacing: 1px; }
.motto-text { font-size: 13px; color: var(--text); }
.hero-intro p {
  font-size: 14px;
  line-height: 1.9;
  color: var(--text);
  margin-bottom: 10px;
}
.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0;
}
.tag {
  font-size: 12px;
  padding: 5px 14px;
  background: var(--primary-soft);
  color: var(--text-muted);
  border-radius: 999px;
}
.btn-row { display: flex; gap: 12px; }
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
  border: none;
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

/* Hero 右栏 */
.hero-right {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}
.hero-photo-wrap {
  position: relative;
  width: 100%;
  max-width: 420px;
  max-height: 480px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: var(--shadow-hover);
  background: var(--bg-soft);
}
.hero-photo {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: var(--bg-soft);
}
.upload-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.25s;
  border-radius: 20px;
}
.hero-photo-wrap:hover .upload-overlay { opacity: 1; }

/* 未认证时的锁定角标：盖在照片右下角 */
.photo-lock {
  position: absolute;
  right: 12px;
  bottom: 12px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

/* ===== 编辑资料面板（认证 + 编辑模式） ===== */
.edit-panel {
  margin-top: 26px;
  background: var(--bg-soft);
  border: 1px dashed var(--border);
  border-radius: 14px;
  padding: 20px;
}
.edit-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--title);
  margin-bottom: 14px;
}
.edit-field {
  display: block;
  margin-bottom: 12px;
}
.edit-field span {
  display: block;
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 5px;
}
.edit-field input,
.edit-field textarea {
  margin-bottom: 0;
}
.edit-tip {
  margin-top: 4px;
  font-size: 12px;
  color: #4CAF50;
}
.upload-hint { text-align: center; color: #fff; }
.upload-icon { font-size: 36px; margin-bottom: 8px; }
.upload-text { font-size: 14px; font-weight: 600; }
.upload-sub { font-size: 11px; opacity: 0.75; margin-top: 4px; }
.upload-input { display: none; }

.now-card {
  position: absolute;
  right: -8px;
  bottom: 36px;
  background: var(--bg-card);
  border-radius: 14px;
  padding: 14px 18px;
  box-shadow: var(--shadow-hover);
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 150px;
}
.now-dot {
  position: absolute;
  top: 14px; left: 14px;
  width: 8px; height: 8px;
  background: #4CAF50;
  border-radius: 50%;
}
.now-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--title);
  letter-spacing: 2px;
  padding-left: 14px;
}
.now-school { font-size: 14px; font-weight: 600; color: var(--title); }
.now-status { font-size: 11px; color: #4CAF50; letter-spacing: 0.5px; }

@media (max-width: 640px) {
  .hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 24px 0;
  }
  .hero-title { font-size: 38px; }
  .hero-photo { max-width: 320px; max-height: 380px; }
}
</style>
