<template>
  <div class="app-header-btn">
    <button class="kakaobtn" @click="kakaoLogin()">카카오 로그인</button>
    <button @click="openUserProfile">내 정보</button>
    <button @click="goToCartPage">장바구니</button>
  </div>
</template>

<script>
export default {
  name: 'AppHeaderBtn',
  methods: {
    openUserProfile() {
      this.$router.push('/UserProfile');
    },
    kakaoLogin() {
      window.open(process.env.VUE_APP_API_URL + '/api/oauth/kakao/callback');
    },
    goToCartPage() {
      this.$router.push({ name: 'ShoppingCart' });
    },
  },
};
</script>

<style scoped>
.app-header-btn {
  position: absolute;
  right: 30px;
  transform: translateY(-50%);
  top: 50%;
  font-size: 12px;
  border: none;
  cursor: pointer;
}
.app-header-btn button {
  background: transparent;
  border: 0px;
  color: #999;
  margin-left: 1em;
}
.app-header-btn button:hover {
  color: #333;
}
</style>
