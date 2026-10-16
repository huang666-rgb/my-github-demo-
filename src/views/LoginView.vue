<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '../stores/auth'

// 身份认证页（双模式）：
// 未认证 → 登录表单；已认证 → 修改密码表单
// 认证逻辑统一走 Pinia（useAuthStore），不再直接操作 localStorage / sessionStorage
defineOptions({ inheritAttrs: false }) // 未声明的 props/事件不透传到根元素

const props = defineProps({
  isAuthed: { type: Boolean, default: false }
})

const router = useRouter()
const authStore = useAuthStore()

/* ---------- 模式一：登录 ---------- */
const password = ref('')
const doLogin = () => {
  if (authStore.login(password.value)) {
    // 认证通过：store 已写入会话存储，跳回首页
    router.push('/')
  } else {
    ElMessage.error('密码错误，请重试')
  }
}

/* ---------- 模式二：修改密码（已认证才可见） ---------- */
const oldPwd = ref('')
const newPwd = ref('')
const confirmPwd = ref('')
const doChangePassword = () => {
  // 校验逻辑下沉到 store，返回 { ok, msg }
  const res = authStore.changePassword(oldPwd.value, newPwd.value, confirmPwd.value)
  if (res.ok) {
    oldPwd.value = ''
    newPwd.value = ''
    confirmPwd.value = ''
    ElMessage.success(res.msg)
  } else {
    ElMessage.error(res.msg)
  }
}
</script>

<template>
  <section class="page-section">
    <!-- 未认证：登录 -->
    <el-card v-if="!props.isAuthed" class="auth-card">
      <div class="auth-icon">🔐</div>
      <h2 class="auth-title">身份认证</h2>
      <p class="auth-desc">只有认证是本人才可以修改页面内容（更换照片 / 编辑文字）</p>

      <el-form @submit.prevent="doLogin">
        <el-form-item>
          <el-input
            v-model="password"
            type="password"
            show-password
            placeholder="请输入管理密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="auth-submit" type="primary" native-type="submit">认证并进入</el-button>
        </el-form-item>
      </el-form>

      <p class="auth-tip">演示密码：12345678</p>
      <a class="auth-back" href="#" @click.prevent="router.push('/')">← 先逛逛，暂不认证</a>
    </el-card>

    <!-- 已认证：修改密码 -->
    <el-card v-else class="auth-card">
      <div class="auth-icon">🔑</div>
      <h2 class="auth-title">修改密码</h2>
      <p class="auth-desc">当前已是本人身份，可以更新管理密码</p>

      <el-form @submit.prevent="doChangePassword">
        <el-form-item>
          <el-input v-model="oldPwd" type="password" show-password placeholder="旧密码" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="newPwd" type="password" show-password placeholder="新密码（至少 6 位）" />
        </el-form-item>
        <el-form-item>
          <el-input v-model="confirmPwd" type="password" show-password placeholder="确认新密码" />
        </el-form-item>
        <el-form-item>
          <el-button class="auth-submit" type="primary" native-type="submit">保存新密码</el-button>
        </el-form-item>
      </el-form>

      <a class="auth-back" href="#" @click.prevent="router.push('/')">← 返回首页</a>
    </el-card>
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

/* Element Plus 主色对齐站点近黑色 */
.auth-card {
  --el-color-primary: var(--primary);
  --el-color-primary-light-3: var(--primary);
  --el-color-primary-light-5: var(--primary);
  --el-color-primary-light-7: var(--primary-soft);
  --el-color-primary-light-8: var(--bg-soft);
  --el-color-primary-light-9: var(--bg-soft);
  --el-color-primary-dark-2: var(--primary);
  max-width: 420px;
  margin: 48px auto 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  box-shadow: var(--shadow-hover);
}
.auth-card :deep(.el-card__body) {
  padding: 44px 36px;
  text-align: center;
}
.auth-icon { font-size: 44px; margin-bottom: 14px; }
.auth-title {
  font-size: 26px;
  font-weight: 800;
  color: var(--title);
  margin-bottom: 8px;
}
.auth-desc {
  font-size: 13px;
  color: var(--text-muted);
  margin-bottom: 26px;
  line-height: 1.7;
}

.auth-submit { width: 100%; }
.auth-submit:hover { opacity: 0.88; }

.auth-tip {
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-muted);
}
.auth-back {
  display: inline-block;
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: none;
}
.auth-back:hover { color: var(--primary); }
</style>
