<template>
  <div id="payCash">
    <h1>결제하기</h1>
    <input v-model="orders_id" placeholder="주문 번호를 입력해 주세요">
    <button @click="payCash">결제</button>
    <p>메세지: {{ message }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      orders_id: 0,
      message: '',
    };
  },
  methods: {
    async payCash() {

        const cookie = document.cookie
        console.log('국밥', cookie)
        const orders_id = this.orders_id
        console.log('오더 국밥', orders_id)
        console.log('구우욱밥', typeof orders_id)
          const response = await axios.post('/api/payments/payCash', {
            orders_id: +orders_id
          }, {
            withCredentials: true
          });

        const data = response.data;
        console.log('인터넷 국밥0', data)
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
  