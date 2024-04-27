import { createRouter, createWebHistory } from 'vue-router';
import MainHome from '../components/MainHome.vue';
import ShoppingCart from '../components/ShoppingCart.vue';

const routes = [
  {
    path: '/',
    name: 'MainHome',
    component: MainHome
  },
  {
    path: '/cart',
    name: 'ShoppingCart',
    component: ShoppingCart
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
