<template>
  <header>
    <h1><a :href="clientUrl">🥔 <span class="f-Gugi">감자쇼핑</span></a></h1>

    <AppHeaderBtn />
  </header>
</template>

<script>
import AppHeaderBtn from './AppHeaderBtn.vue';
export default {
  name: 'AppHeader',
  components: {
    AppHeaderBtn,
  },  
  data() {
    return {
      clientUrl: process.env.VUE_APP_CLIENT_URL
    };
  }
}
</script>

<style scoped>
header {
  border-bottom: 1px solid #ccc;
  height: 80px;
  box-sizing: border-box;
  position: relative;
  padding: 0 30px;
}
header a {
  font-size: 18px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
</style>
