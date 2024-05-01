<template>
  <div class="order-management">
    <h1>주문 관리</h1>
    <table>
      <thead>
        <tr>
          <th>주문 번호</th>
          <th>상품명</th>
          <th>가격</th>
          <th>수량</th>
          <th>주문일시</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.order_number }}</td>
          <td>{{ order.product_name }}</td>
          <td>{{ order.price }}</td>
          <td>{{ order.quantity }}</td>
          <td>{{ order.order_date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OrderManagement',
  data() {
    return {
      orders: [],
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      try {

        let encodedToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          .split('=')[1];
        let token = decodeURIComponent(encodedToken);
        const apiUrl = `${process.env.VUE_APP_API_URL}/api/orders/admin`;
        const response = await axios.get(apiUrl, { headers: { Authorization: `Bearer ${token}` } });
        this.orders = response.data;
      } catch (error) {
        console.error('주문을 불러오는 중 오류가 발생했습니다:', error);
      }
    },
  },
};
</script>

<style scoped>
.order-management {
  padding: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
