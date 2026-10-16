<script setup>
import { computed, reactive } from 'vue'

// 技能兴趣视图
// defineProps：skills / isAuthed / isEditing
// defineModel：searchText（搜索框双向绑定）
// defineEmits：toggleDetail / addSkill / removeSkill（编辑模式增删，父组件改数据）
defineOptions({ inheritAttrs: false }) // 未声明的 props/事件不透传到根元素

const props = defineProps({
  skills: { type: Array, default: () => [] },
  isAuthed: { type: Boolean, default: false },
  isEditing: { type: Boolean, default: false }
})

const searchText = defineModel('searchText', { type: String, default: '' })

const emit = defineEmits(['toggleDetail', 'addSkill', 'removeSkill'])

// 编辑开关：认证 + 编辑模式同时满足才显示编辑控件
const canEdit = computed(() => props.isAuthed && props.isEditing)

// 技能按 type 字段分类（编辑模式增删后不会错位），技术栈栏还支持搜索过滤
const techSkills = computed(() =>
  props.skills.filter((item) => {
    if (item.type === 'hobby') return false
    const kw = searchText.value
    return !kw || item.text.includes(kw) || item.detail.includes(kw)
  })
)
const hobbySkills = computed(() => props.skills.filter((item) => item.type === 'hobby'))

const onToggleSkill = (item) => {
  // 只上报事件，展开/收起状态由父组件统一翻转（否则这里翻一次、父组件再翻一次会相互抵消）
  emit('toggleDetail', item)
}

// 搜索建议：el-autocomplete 自动联想所有技术栈名称，也可直接输入任意关键字
const querySearch = (queryString, cb) => {
  const list = props.skills
    .filter((item) => item.type !== 'hobby')
    .map((item) => ({ value: item.text }))
  cb(
    queryString
      ? list.filter((s) => s.value.toLowerCase().includes(queryString.toLowerCase()))
      : list
  )
}

// 新增表单（左右两栏各一个），提交时 emit 给父组件
const newTech = reactive({ text: '', detail: '' })
const newHobby = reactive({ text: '', detail: '' })
const addNew = (form, type) => {
  if (!form.text.trim()) return
  emit('addSkill', { type, text: form.text, detail: form.detail })
  form.text = ''
  form.detail = ''
}
</script>

<template>
  <!-- ============ 技能兴趣 ============ -->
  <section id="skills" class="page-section">
    <div class="page-head">
      <div class="page-tag">● SKILLS / 技能兴趣</div>
      <h2 class="page-title">我熟悉的技术 <span class="smiley" /></h2>
      <p class="page-desc">从基础到工程化，下面是我目前掌握和正在精进的技术栈与兴趣方向。</p>
      <p v-if="canEdit" class="edit-banner">✏️ 编辑模式：直接修改文字即可，改动自动保存；可新增 / 删除技能</p>
    </div>

    <div class="skills-layout">
      <!-- 左：技术栈 -->
      <div class="skill-block">
        <div class="block-head">
          <h3 class="block-title">技术栈</h3>
        </div>
        <el-autocomplete
          v-model="searchText"
          class="search-box"
          :fetch-suggestions="querySearch"
          placeholder="搜索技能..."
          clearable
        />

        <ul class="skill-list">
          <li
            v-for="item in techSkills"
            :key="item.id"
            class="skill-item"
          >
            <!-- 编辑模式：直接改文字，自动保存 -->
            <div v-if="canEdit" class="skill-edit">
              <input v-model="item.text" class="edit-input" type="text" placeholder="技能名称" />
              <textarea v-model="item.detail" class="edit-textarea" rows="2" placeholder="详情描述"></textarea>
              <button class="skill-del" type="button" @click="emit('removeSkill', item.id)">删除</button>
            </div>
            <!-- 浏览模式 -->
            <template v-else>
              <div
                class="skill-header"
                :class="{ active: item.showDetail }"
                @click="onToggleSkill(item)"
              >
                <span class="skill-name">{{ item.text }}</span>
                <span class="toggle-text">{{ item.showDetail ? '收起' : '详情' }}</span>
              </div>
              <transition name="slide">
                <div v-if="item.showDetail" class="skill-detail">{{ item.detail }}</div>
              </transition>
            </template>
          </li>
        </ul>

        <!-- 编辑模式：新增技术栈技能 -->
        <div v-if="canEdit" class="skill-add">
          <el-input v-model="newTech.text" placeholder="新技能名称" />
          <el-input v-model="newTech.detail" placeholder="详情描述（可选）" />
          <el-button class="add-btn" type="primary" @click="addNew(newTech, 'tech')">＋ 添加技能</el-button>
        </div>

        <!-- 搜索无结果空状态 -->
        <div v-if="techSkills.length === 0" class="empty-state">
          <div class="empty-icon">🔍</div>
          <div>没有找到「{{ searchText }}」相关技能</div>
        </div>
      </div>

      <!-- 右：兴趣与软实力 -->
      <div class="skill-block">
        <h3 class="block-title">兴趣 / 软实力</h3>
        <ul class="skill-list">
          <li v-for="item in hobbySkills" :key="item.id" class="skill-item">
            <!-- 编辑模式 -->
            <div v-if="canEdit" class="skill-edit">
              <input v-model="item.text" class="edit-input" type="text" placeholder="兴趣名称" />
              <textarea v-model="item.detail" class="edit-textarea" rows="2" placeholder="详情描述"></textarea>
              <button class="skill-del" type="button" @click="emit('removeSkill', item.id)">删除</button>
            </div>
            <!-- 浏览模式 -->
            <template v-else>
              <div
                class="skill-header"
                :class="{ active: item.showDetail }"
                @click="onToggleSkill(item)"
              >
                <span class="skill-name">{{ item.text }}</span>
                <span class="toggle-text">{{ item.showDetail ? '收起' : '详情' }}</span>
              </div>
              <transition name="slide">
                <div v-if="item.showDetail" class="skill-detail">{{ item.detail }}</div>
              </transition>
            </template>
          </li>
        </ul>

        <!-- 编辑模式：新增兴趣 -->
        <div v-if="canEdit" class="skill-add">
          <el-input v-model="newHobby.text" placeholder="新兴趣名称" />
          <el-input v-model="newHobby.detail" placeholder="详情描述（可选）" />
          <el-button class="add-btn" type="primary" @click="addNew(newHobby, 'hobby')">＋ 添加兴趣</el-button>
        </div>

        <!-- 统计卡 -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-num">3+</div>
            <div class="stat-label">年前端学习</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">10+</div>
            <div class="stat-label">独立小项目</div>
          </div>
          <div class="stat-card">
            <div class="stat-num">∞</div>
            <div class="stat-label">求知欲</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ============ 通用页面区 ============ */
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

/* 笑脸（标题装饰） */
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

/* ============ 技能兴趣页 ============ */
.skills-layout {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 36px;
  align-items: start;
}
.skill-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--shadow);
}
.block-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 12px;
  flex-wrap: wrap;
}
.block-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--title);
}
/* 自动联想搜索框：简洁单层样式 */
.search-box {
  width: 100%;
  margin-bottom: 14px;
}

.skill-list { list-style: none; }
.skill-item {
  border-bottom: 1px solid var(--border);
}
.skill-item:last-child { border-bottom: none; }
.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 4px;
  cursor: pointer;
  transition: color 0.2s;
}
.skill-header:hover { color: var(--primary); }
.skill-name { font-size: 14px; font-weight: 500; color: var(--title); }
.skill-header.active .skill-name { color: var(--primary); }
.toggle-text {
  font-size: 12px;
  color: var(--text-muted);
  padding: 3px 10px;
  border: 1px solid var(--border);
  border-radius: 999px;
  transition: all 0.2s;
}
.skill-header.active .toggle-text {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}
.skill-detail {
  padding: 0 4px 14px;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.7;
}

/* 折叠动画 */
.slide-enter-active, .slide-leave-active { transition: all 0.2s ease; overflow: hidden; }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; }
.slide-enter-to, .slide-leave-from { opacity: 1; max-height: 120px; }

/* 搜索空状态 */
.empty-state {
  padding: 32px 8px;
  text-align: center;
  font-size: 13px;
  color: var(--text-muted);
}
.empty-icon { font-size: 28px; margin-bottom: 8px; }

/* ===== 编辑模式控件 ===== */
.edit-banner {
  margin-top: 10px;
  font-size: 13px;
  color: #4CAF50;
  background: rgba(76, 175, 80, 0.08);
  display: inline-block;
  padding: 6px 14px;
  border-radius: 999px;
}
.skill-edit {
  padding: 12px 4px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.edit-input {
  width: 100%;
  margin-bottom: 0;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  background: var(--bg-soft);
  color: var(--text);
  outline: none;
  transition: border-color 0.2s;
}
.edit-input:focus { border-color: var(--primary); }
.edit-textarea {
  width: 100%;
  margin-bottom: 0;
  min-height: 0;
  padding: 8px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 13px;
  background: var(--bg-soft);
  color: var(--text);
  outline: none;
  resize: vertical;
  font-family: inherit;
  line-height: 1.6;
}
.edit-textarea:focus { border-color: var(--primary); }
.skill-del {
  align-self: flex-start;
  padding: 4px 12px;
  font-size: 12px;
  color: #d64545;
  background: rgba(214, 69, 69, 0.08);
  border: 1px solid rgba(214, 69, 69, 0.35);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
}
.skill-del:hover { background: #d64545; color: #fff; }
.skill-add {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px dashed var(--border);
}
.add-btn {
  align-self: flex-start;
  border-radius: 999px;
}
.add-btn:hover { opacity: 0.88; }

/* 统计卡 */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 22px;
}
.stat-card {
  background: var(--bg-soft);
  border-radius: 12px;
  padding: 14px 8px;
  text-align: center;
}
.stat-num {
  font-size: 24px;
  font-weight: 800;
  color: var(--primary);
  line-height: 1;
}
.stat-label {
  font-size: 11px;
  color: var(--text-muted);
  margin-top: 6px;
}

/* ============ 响应式 ============ */
@media (max-width: 900px) {
  .skills-layout { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .page-title { font-size: 28px; }
}
</style>
