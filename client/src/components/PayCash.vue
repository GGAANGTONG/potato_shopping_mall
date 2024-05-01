<template>
  <div id="payCash">
    <h1>결제하기</h1>
    <input v-model="orders_id" placeholder="주문 번호를 입력해 주세요" />
    <button @click="payCash">결제</button>
    <p>메세지: {{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders_id: '',
      message: '',
    };
  },
  methods: {
    async payCash() {
      const cookie = document.cookie;
      console.log('국밥', cookie);
      const orders_id = this.orders_id;
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk5MzE4LCJpYXQiOjE3MTQyOTkyODgsImV4cCI6MTc1NzQ5OTI4OH0.J31KF96C-EnnIel6p9iX2K7k7ujggDRFvxrephRRK-k';
      const response = await axios.post(
        `${process.env.VUE_APP_API_URL}/api/payments/payCash`,
        {
          orders_id: +orders_id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
          withCredentials: true,
        },
      );

      const data = response.data;
      this.$router.push({
        path: '/payments/payCashValidation',
        query: {
          orderName: data.orderName,
          orderId: data.orderId,
          amount: data.amount,
        },
      });
    },
  },
};
</script>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.product-list li {
  width: 33.3%;
}
</style>
