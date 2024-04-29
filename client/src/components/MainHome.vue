<template>
  <div>
    <nav>
      
      <CategoryMenu />
      <div class="main-btn">
        <button class="kakaobtn" @click="kakaoLogin()">카카오 로그인</button>
        <UserProfileBtn />
        <ShoppingCartBtn />
      </div>
    </nav>
    <ProductList />
  </div>
</template>

<script>
import CategoryMenu from './CategoryMenu.vue';
import UserProfileBtn from './UserProfileBtn.vue';
import ShoppingCartBtn from './ShoppingCartBtn.vue';
import ProductList from './ProductList.vue';

export default {
  name: 'MainHome',
  components: {
    CategoryMenu,
    UserProfileBtn,
    ShoppingCartBtn,
    ProductList,
  },
  methods: {
    kakaoLogin() {
      window.open(process.env.VUE_APP_API_URL+'/api/oauth/kakao/callback');
    },
  },
};
</script>

<style></style>
