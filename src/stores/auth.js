import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 身份认证 Store
// 统一管理登录状态与管理密码，替代之前散落在 App.vue / LoginView.vue 的
// sessionStorage / localStorage 读写逻辑，方便任意组件按需调用
export const useAuthStore = defineStore('auth', () => {
  // 管理密码：存 localStorage（sitePassword），默认 12345678，可在登录页修改
  const DEFAULT_PASSWORD = '12345678'
  const password = ref(localStorage.getItem('sitePassword') || DEFAULT_PASSWORD)

  // 登录状态：存 sessionStorage（关闭浏览器自动退出，比 localStorage 更符合登录语义）
  const isAuthed = ref(sessionStorage.getItem('isAuthed') === '1')

  // 是否已认证（只读派生）
  const isAuthenticated = computed(() => isAuthed.value)

  // 登录：密码正确则置为已认证，返回是否成功
  const login = (input) => {
    if (input === password.value) {
      isAuthed.value = true
      sessionStorage.setItem('isAuthed', '1')
      return true
    }
    return false
  }

  // 退出：清除会话状态
  const logout = () => {
    isAuthed.value = false
    sessionStorage.removeItem('isAuthed')
  }

  // 修改密码：校验旧密码 + 新密码长度，成功后写入 localStorage
  // 返回 { ok, msg }，调用方按需展示提示
  const changePassword = (oldInput, newInput, confirmInput) => {
    if (oldInput !== password.value) return { ok: false, msg: '旧密码不正确' }
    if (!newInput || newInput.length < 6) return { ok: false, msg: '新密码至少 6 位' }
    if (newInput !== confirmInput) return { ok: false, msg: '两次输入的新密码不一致' }
    password.value = newInput
    localStorage.setItem('sitePassword', newInput)
    return { ok: true, msg: '密码修改成功，下次登录请使用新密码' }
  }

  return {
    password,
    isAuthed,
    isAuthenticated,
    login,
    logout,
    changePassword
  }
})
