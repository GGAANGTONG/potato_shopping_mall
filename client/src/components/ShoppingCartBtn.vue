<template>
  <div class="shopping-cart">
    <button @click="goToCartPage">장바구니</button>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCartBtn',
  methods: {
    goToCartPage() {
      this.$router.push({ name: 'ShoppingCart' });
    }
  }
}
</script>

<style scoped>
.shopping-cart button {
  padding: 10px 20px;
  background-color: #008CBA;
  color: white;
  border: none;
  cursor: pointer;
}
.shopping-cart button:hover {
  background-color: #007B9E;
}
</style>
