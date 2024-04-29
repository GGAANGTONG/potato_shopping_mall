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
    async payPoint() { // 메소드 이름 수정
      const orders_id = this.orders_id_point; // 데이터 처리를 위한 변수 추출
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk5MzE4LCJpYXQiOjE3MTQyOTkyODgsImV4cCI6MTc1NzQ5OTI4OH0.J31KF96C-EnnIel6p9iX2K7k7ujggDRFvxrephRRK-k';
      try {
        const response = await axios.post(`http://localhost:3000/api/payments/pay`, {
          orders_id: orders_id
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        });
        this.message = '결제가 성공적으로 완료되었습니다!';
      } catch (error) {
        this.message = error.response ? error.response.data.message : '결제 처리 중 오류가 발생했습니다!';
      }
    }
  }
};
</script>
