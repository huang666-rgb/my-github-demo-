import { defineStore } from 'pinia'

// 个人信息 Store（Options API 风格：state / getters / actions）
// 集中管理：个人文字资料、头像/大图、联系方式、技能兴趣
// 持久化：state 从 localStorage 初始化；改动通过 $subscribe 自动写回
export const useProfileStore = defineStore('profile', {
  // state：共享状态的初始值（带 localStorage 恢复）
  state: () => {
    const savedTexts = (() => {
      try { return JSON.parse(localStorage.getItem('profileTexts') || '{}') } catch { return {} }
    })()
    const savedSkills = (() => {
      try { return JSON.parse(localStorage.getItem('skillsData') || 'null') } catch { return null }
    })()

    return {
      // 个人文字资料
      name: savedTexts.name || '黄晨语',
      majorClass: savedTexts.majorClass || '计算机科学与技术',
      direction: savedTexts.direction || '前端开发 / Frontend Development',
      intro:
        savedTexts.intro ||
        '我是一名热爱前端开发的在校大学生，目前大三，专注于 Vue2 / Vue3 与 微信小程序 开发方向。\n从大二开始系统学习前端，从 HTML/CSS/JS 基础入手，逐步掌握了组件化开发、前后端交互、前端工程化等核心技能。\n平时喜欢通过做小项目来巩固知识，比如接金币小游戏、购物车网页等。\n目前正在寻找前端实习机会，希望能在真实业务场景中进一步提升自己的工程能力与团队协作能力。',
      motto: savedTexts.motto || '认真做事，快乐写码 ✨',
      // 图片（独立字段：avatarUrl 头像小图 / photoUrl Hero 大图）
      avatarUrl: localStorage.getItem('avatarUrl') || '/image/头像.jpg',
      photoUrl: localStorage.getItem('photoUrl') || '/image/hero.jpg',
      // 联系方式
      email: savedTexts.email || 'han@example.com',
      github: savedTexts.github || 'https://github.com/yourname',
      // 技能兴趣（type: tech 技术栈 / hobby 兴趣）
      skills:
        savedSkills || [
          { id: 1, type: 'tech', text: 'HTML5 / CSS3', detail: '掌握语义化标签、Flex/Grid 布局，能还原设计稿，熟悉 CSS 动画。', showDetail: false },
          { id: 2, type: 'tech', text: 'JavaScript（ES6+）', detail: '熟悉闭包、this 指向、作用域链、异步编程（Promise/async）。', showDetail: false },
          { id: 3, type: 'tech', text: 'Vue2 / Vue3', detail: '掌握组件化开发、父子通信、computed/watch、生命周期。', showDetail: false },
          { id: 4, type: 'tech', text: '微信小程序', detail: '能独立开发小程序页面，熟悉 WXML / WXSS / 小程序 API。', showDetail: false },
          { id: 5, type: 'tech', text: '前端工程化', detail: '了解 npm、Webpack、Vite，能配置基础开发环境。', showDetail: false },
          { id: 6, type: 'hobby', text: '打篮球 🏀', detail: '每周打 2–3 次，喜欢团队配合，抗压能力强。', showDetail: false }
        ],
      // 技能搜索关键字
      searchText: ''
    }
  },

  // getters：派生状态（只读），便于多处复用
  getters: {
    // 技术栈
    techSkills: (state) => state.skills.filter((s) => s.type === 'tech'),
    // 兴趣软实力
    hobbySkills: (state) => state.skills.filter((s) => s.type === 'hobby'),
    // Hero 页能力胶囊（取前 4 个技术栈名称）
    heroTags() {
      return this.techSkills.slice(0, 4).map((s) => s.text)
    },
    // 技术栈按关键字过滤（搜索用）
    filteredTechSkills() {
      const kw = this.searchText
      return this.techSkills.filter(
        (s) => !kw || s.text.includes(kw) || s.detail.includes(kw)
      )
    }
  },

  // actions：修改状态的方法
  actions: {
    // 设置头像
    setAvatar(url) {
      this.avatarUrl = url
      localStorage.setItem('avatarUrl', url)
    },
    // 设置 Hero 大图
    setPhoto(url) {
      this.photoUrl = url
      localStorage.setItem('photoUrl', url)
    },
    // 新增技能
    addSkill({ type, text, detail }) {
      if (!text || !text.trim()) return
      this.skills.push({
        id: Date.now(),
        type,
        text: text.trim(),
        detail: (detail || '').trim(),
        showDetail: false
      })
      this.persistSkills()
    },
    // 删除技能
    removeSkill(id) {
      this.skills = this.skills.filter((s) => s.id !== id)
      this.persistSkills()
    },
    // 切换某项展开/收起
    toggleSkillDetail(item) {
      item.showDetail = !item.showDetail
    },
    // 持久化文字资料（编辑后调用）
    persistTexts() {
      localStorage.setItem(
        'profileTexts',
        JSON.stringify({
          name: this.name,
          majorClass: this.majorClass,
          direction: this.direction,
          intro: this.intro,
          motto: this.motto,
          email: this.email,
          github: this.github
        })
      )
    },
    // 持久化技能（showDetail 是临时状态，不存）
    persistSkills() {
      localStorage.setItem(
        'skillsData',
        JSON.stringify(this.skills.map(({ showDetail, ...rest }) => rest))
      )
    }
  }
})
