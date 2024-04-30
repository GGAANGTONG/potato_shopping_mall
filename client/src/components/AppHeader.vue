<template>
  <header>
    <h1><a :href="clientUrl">감자쇼핑</a></h1>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      clientUrl: process.env.VUE_APP_CLIENT_URL
    };
  }
}
</script>

<style scoped>
header {
  background-color: #f8f9fa;
  padding: 20px;
  text-align: center;
}
</style>
