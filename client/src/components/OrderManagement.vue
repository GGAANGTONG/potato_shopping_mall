<template>
  <div class="order-management">
    <h1 class="f-Gugi">주문 관리</h1>
    <table>
      <thead>
        <tr>
          <th>주문 번호</th>
          <th>주문자명</th>
          <th>주문자 이메일</th>
          <th>가격</th>
          <th>주문일시</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td v-if="order.user && order.user.name">{{ order.user.name }}</td>
          <td v-if="order.user && order.user.email">{{ order.user.email }}</td>
          <td>{{ order.o_total_price }}</td>
          <td>{{ order.created_at }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="pagination">
    <button @click="changePage(-1)" :disabled="currentPage <= 1">이전</button>
    <span>Page {{ currentPage }} of {{ totalPages }}</span>
    <button @click="changePage(1)" :disabled="currentPage >= totalPages">
      다음
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'OrderManagement',
  data() {
    return {
      orders: [],
      currentPage: 1,
      pageSize: 10,
      totalOrders: 0,
      totalPages: 0,
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
        const apiUrl = `${process.env.VUE_APP_API_URL}/api/orders/admin?page=${this.currentPage}&pageSize=${this.pageSize}`;
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `${token}` },
        });
        this.orders = response.data[0];
        this.totalOrders = response.data[1];
        console.log(response.data)
        this.totalPages = Math.ceil(this.totalOrders / this.pageSize);
      } catch (error) {
        console.error('주문을 불러오는 중 오류가 발생했습니다:', error);
      }
    },
    changePage(direction) {
      let newPage = this.currentPage + direction;
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.fetchOrders();
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

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>
