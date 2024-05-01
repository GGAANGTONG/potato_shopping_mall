<template>
  <div class="admin-page">
    <h1>쇼핑몰 관리자 페이지</h1>
    <div>오늘의 신규 주문 건수: {{ todayOrdersCount }}</div>
    <button class="blue" @click="goToInventory">재고 관리</button>
    <button class="blue" @click="goToOrders">주문 관리</button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'AdminPage',
  data() {
    return {
      todayOrdersCount: 0,
    };
  },
  created() {
    this.fetchTodayOrdersCount();
  },
  methods: {
    goToInventory() {
      this.$router.push('/admin/inventory');
    },
    goToOrders() {
      this.$router.push('/admin/orders');
    },
    async fetchTodayOrdersCount() {
      try {
        let encodedToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          .split('=')[1];
        let token = decodeURIComponent(encodedToken);
        const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        const response = await axios.get(`${apiUrl}/api/orders/today-count`, {
          headers: {
            Authorization: `${token}`,
          },
        });
        console.log(response.data);
        this.todayOrdersCount = response.data;
      } catch (error) {
        console.error('오늘의 주문 건수를 불러오는데 실패했습니다:', error);
      }
    },
  },
};
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
