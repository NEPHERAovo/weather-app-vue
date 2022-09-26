import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CityView from '../views/CityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: (to, from, next) => {
        document.title = "~ 天气 ~";
        next();
      }
    },
    {
      path: '/weather/:state/:city',
      name: 'city',
      component: CityView,
      beforeEnter: (to, from, next) => {
        document.title = to.params.city + ', ' + to.params.state + " | ~ 天气 ~";
        next();
      }
    },
  ]
})

export default router
