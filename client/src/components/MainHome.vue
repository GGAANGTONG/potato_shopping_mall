<template>
  <div class="main-layout">
    <nav>
      <CategoryMenu />
    </nav>
    <HotDealsBanner />
    <ProductList />
  </div>
</template>

<script>
import CategoryMenu from './CategoryMenu.vue';
import ProductList from './ProductList.vue';
import HotDealsBanner from './HotDealsBanner.vue';

export default {
  name: 'MainHome',
  components: {
    CategoryMenu,
    ProductList,
    HotDealsBanner,
  },
  methods: {
    kakaoLogin() {
      window.open(process.env.VUE_APP_API_URL+'/api/oauth/kakao/callback');
    },
  },
};
</script>

<style></style>
