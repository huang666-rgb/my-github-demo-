import { defineStore } from 'pinia'

// 作品集 Store（Options API 风格：state / getters / actions）
// 管理：项目列表、心情 emoji 与当前下标
export const useProjectStore = defineStore('project', {
  // state
  state: () => ({
    projects: [
      {
        id: 1,
        name: '接金币小游戏',
        desc: '复古像素风休闲小游戏，键盘控制接金币',
        link: 'https://example.com/game',
        image: 'https://picsum.photos/seed/pixelgame/400/300',
        tech: ['Vue3', 'Canvas', 'CSS 动画'],
        highlights: [
          '键盘左右移动控制小人，接住下落的金币得分',
          '金币与炸弹双机制，接到炸弹游戏结束',
          'localStorage 记录历史最高分，可反复挑战'
        ]
      },
      {
        id: 2,
        name: '购物车网页',
        desc: 'Vue 实现的萌系购物车，加减删除一条龙',
        link: 'https://example.com/shop',
        image: 'https://picsum.photos/seed/cartcute/400/300',
        tech: ['Vue3', 'computed', '组件通信'],
        highlights: [
          '数量加减、单选/全选、删除等完整购物车交互',
          '用 computed 自动结算总价与优惠金额',
          '父子组件用 props / emit 通信，结构清晰'
        ]
      },
      {
        id: 3,
        name: '个人博客',
        desc: '支持 Markdown 的写作小站，文艺又清爽',
        link: 'https://example.com/blog',
        image: 'https://picsum.photos/seed/blogink/400/300',
        tech: ['Vue Router', 'Markdown', 'Vite'],
        highlights: [
          '文章列表 + 详情 + 归档多页面，路由管理页面切换',
          '支持 Markdown 渲染与代码高亮',
          '响应式排版，手机阅读体验友好'
        ]
      },
      {
        id: 4,
        name: '天气查询',
        desc: '一分钟看懂今明两天的天气小工具',
        link: 'https://example.com/weather',
        image: 'https://picsum.photos/seed/sunnyday/400/300',
        tech: ['fetch API', 'Promise', 'Vue3'],
        highlights: [
          '输入城市名即可查询实时天气与未来预报',
          '根据天气类型自动切换页面配色与图标',
          'async/await 处理接口请求，加载与错误状态完整'
        ]
      }
    ],
    moodEmojis: ['😉', '😄', '🥰', '😎', '🤩', '👀', '✨'],
    moodIndex: 0
  }),

  // getters
  getters: {
    // 项目总数
    count: (state) => state.projects.length,
    // 当前心情 emoji
    currentMood: (state) => state.moodEmojis[state.moodIndex] || '✨',
    // 按 id 取项目（详情页用）
    getById: (state) => (id) =>
      state.projects.find((p) => String(p.id) === String(id))
  },

  // actions
  actions: {
    // 点 emoji 循环切换心情
    cycleMood() {
      this.moodIndex = (this.moodIndex + 1) % this.moodEmojis.length
    }
  }
})
