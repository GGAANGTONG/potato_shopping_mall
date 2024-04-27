import { createRouter, createWebHistory } from 'vue-router';
import MainHome from '../components/MainHome.vue';
import ShoppingCart from '../components/ShoppingCart.vue';
import PayCash from '../components/PayCash.vue';
import PayCashValidation from '../components/PayCashValidation.vue';
import PayCashValidationSuccess from '../components/PayCashValidationSuccess';

const routes = [
  {
    path: '/',
    name: 'MainHome',
    component: MainHome,
  },
  {
    path: '/cart',
    name: 'ShoppingCart',
    component: ShoppingCart,
  },
  {
    path: '/payments/payCash',
    name: 'payCash',
    component: PayCash,
  },
  {
    path: '/payments/payCashValidation',
    name: 'PayCashValidation',
    component: PayCashValidation,
  },
  {
    path: '/payments/payCashValidationSuccess',
    name: 'PayCashValidationSuccess',
    component: PayCashValidationSuccess,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
