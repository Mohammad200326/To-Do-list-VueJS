import { createRouter, createWebHistory } from 'vue-router'
import LoginForm from '../views/LoginForm.vue'
import RegisterForm from '../views/RegisterForm.vue'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: LoginForm
    },
    {
      path: "/register",
      name: "register",
      component: RegisterForm
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
