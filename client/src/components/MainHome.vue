<template>
    <div>
      <nav>
        <button @click="kakaoLogin()">카카오 로그인</button>
        <CategoryMenu/>
        <UserProfileBtn/>
        <ShoppingCartBtn/>
      </nav>
      <ProductList/>
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
      ProductList
    },
    methods: {
      kakaoLogin() { 
        window.open("http://localhost:3000/api/oauth/kakao/callback");
      }
    }
  }
  </script>
  
  <style>

  </style>
  