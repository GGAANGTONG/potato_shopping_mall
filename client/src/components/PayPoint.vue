<template>
  <div id="payPoint">
    <h1>결제하기</h1>
    <input v-model="orders_id_point" placeholder="주문 번호를 입력해 주세요">
    <button @click="payPoint">결제</button>
    <p>메세지: {{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PayPoint',
  data() {
    return {
      orders_id_pint: '',
      message: '',
    };
  },
  methods: {
    async PayPoint() {
      // const apiUrl = process.env.VUE_APP_API_URL;
      const orders_id = this.orders_id_point
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk5MzE4LCJpYXQiOjE3MTQyOTkyODgsImV4cCI6MTc1NzQ5OTI4OH0.J31KF96C-EnnIel6p9iX2K7k7ujggDRFvxrephRRK-k';

          await axios.post(`http://localhost:3000/api/payments`, {
            orders_id: +orders_id
          }, 
          {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `BPearer ${token}`, 
          },
          withCredentials: true,
        });
   await this.$router.push({
     path: `http://localhost:3000/api/payments/point-confirm-test`,
     query: {
       orders_id: orders_id,
     },
   });

    },
  }
};
</script>
