<template>
    <div class="admin-page">
      <h1>쇼핑몰 관리자 페이지</h1>
      <button class="blue" @click="goToInventory">재고 관리</button>
      <button class="blue" @click="goToOrders">주문 관리</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminPage',
    methods: {
      goToInventory() {
        this.$router.push('/admin/inventory');
      },
      goToOrders() {
        this.$router.push('/admin/orders');
      }
    }
  }
  </script>
  
  <style scoped>
  .admin-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
  </style>
  