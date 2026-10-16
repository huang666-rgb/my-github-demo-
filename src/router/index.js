import { createRouter, createWebHistory } from 'vue-router'
import IntroView from '../views/IntroView.vue'
import SkillsView from '../views/SkillsView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import ContactView from '../views/ContactView.vue'
import LoginView from '../views/LoginView.vue'
import ArticleListView from '../views/ArticleListView.vue'
import ArticleDetailView from '../views/ArticleDetailView.vue'
import ArticleManageView from '../views/ArticleManageView.vue'

// 路由配置：SPA 单页应用，history 模式
// / → 关于我（IntroView），/skills → 技能兴趣，/projects → 作品集，/contact → 联系我
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'intro', component: IntroView },
    { path: '/skills', name: 'skills', component: SkillsView },
    { path: '/projects', name: 'projects', component: ProjectsView },
    // 动态路由：:id 是路由参数，/projects/1、/projects/2... 都会匹配到这里
    { path: '/projects/:id', name: 'project-detail', component: ProjectDetailView },
    { path: '/contact', name: 'contact', component: ContactView },
    // 文章列表 + 详情（动态路由 :id）
    { path: '/articles', name: 'articles', component: ArticleListView },
    { path: '/articles/:id', name: 'article-detail', component: ArticleDetailView },
    // 文章管理（需认证，路由守卫拦截未登录访问）
    { path: '/articles/manage', name: 'article-manage', component: ArticleManageView },
    // 身份认证页：未认证显示登录，已认证显示修改密码（双模式，无需守卫重定向）
    { path: '/auth', name: 'auth', component: LoginView }
  ],
  // 每次切换路由后回到页面顶部
  scrollBehavior() {
    return { top: 0 }
  }
})

// 路由守卫：文章管理页需认证，未登录跳到认证页
router.beforeEach((to) => {
  if (to.name === 'article-manage' && sessionStorage.getItem('isAuthed') !== '1') {
    return { name: 'auth' }
  }
})

export default router
