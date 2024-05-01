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
    },
  },
};
</script>

<style scoped>
.shopping-cart {
  position: absolute;
  right: 60px;
  transform: translateY(-50%);
  top: 50%;
  font-size: 12px;
  border: none;
  cursor: pointer;
}
.shopping-cart button {
  background: transparent;
  border: 0px;
  color: #999;
}
.shopping-cart button:hover {
  color: #333;
}
</style>
