import { createRouter, createWebHistory } from 'vue-router';
import MainHome from '../components/MainHome.vue';
import ShoppingCart from '../components/ShoppingCart.vue';
import PayCash from '../components/PayCash.vue';
import PayCashValidation from '../components/PayCashValidation.vue';
import PayCashValidationSuccess from '../components/PayCashValidationSuccess';
import ProductItem from '../components/ProductItem.vue';
import OrderPage from '../components/OrderPage.vue';
import StockManagement from '../components/StockManagement.vue';
import UserProfile from '../components/UserProfile.vue';
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
  {
    path: '/good-one/:goodsId',
    name: 'ProductItem',
    component: ProductItem,
    props: true,
  },
  {
    path: '/manage-goods',
    name: 'StockManagement',
    component: StockManagement,
    props: true,
  },
  {
    path: '/order',
    name: 'OrderPage',
    component: OrderPage,
  },
  {
    path: '/userProfile',
    name: 'UserProfile',
    component: UserProfile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
