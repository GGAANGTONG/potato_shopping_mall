<template>
  <div class="order-page">
    <h1>주문 확인</h1>
    <div>
      <h2>주문내역</h2>
      <table class="default">
        <tbody>
          <tr v-if="orderInfo">
            <th>이름</th>
            <td>{{ orderInfo.name }}</td>
          </tr>
          <tr v-if="orderInfo">
            <th>이메일</th>
            <td>{{ orderInfo.email }}</td>
          </tr>
          <tr>
            <th>휴대폰 번호</th>
            <td>{{ orderInfo.o_tel }}</td>
          </tr>
          <tr>
            <th>배송주소</th>
            <td>{{ orderInfo.o_detail_addr }}</td>
          </tr>
          <tr>
            <th>총액</th>
            <td>{{ orderInfo.o_total_price }}원</td>
          </tr>
          <tr>
            <th>주문번호</th>
            <td>{{ orderInfo.id }}</td>
          </tr>
        </tbody>
      </table>
    </div>

<table class ="default">
<thead>
  <tr>
    <th colspan="2">주문 상세</th>
  </tr>
</thead>
  <tr v-for="detail in orderDetails" :key="detail.goods_id">
    <td>

        <tbody>
        <tr>
          <th>상품명</th>
          <td>{{ detail.g_name }}</td>
        </tr>
        <tr>
          <th>상품 번호</th>
          <td>{{ detail.goods_id }}</td>
        </tr>
        <tr>
          <th>주문 수량</th>
          <td>{{ detail.od_count }}</td>
        </tr>
      </tbody>
    </td>
  </tr>
</table>

    <div class="order-btn">
      <button class="button-cash-purchase" v-if="!orderInfo.tossOrderId">
        주문 취소
      </button>
      <button
        class="button-cash-purchase"
        v-if="!orderInfo.tossOrderId"
        @click="handleCashPurchase"
      >
        포인트로 구매
      </button>
      <button
        class="button-cash-purchase"
        @click="handleCashPurchase"
      >
        현금 구매
      </button>
      <button class="button-cash-purchase" v-if="orderInfo.tossOrderId">
        결제 취소
      </button>
      <button class="button-cash-purchase" v-if="orderInfo.tossOrderId" @click="handleCheckShipping">
        배송 확인
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'OrderPage',
  data() {
    return {
      orderInfo: {},
      orderDetails: [],
    };
  },
  created() {
    this.fetchOrderInfo();
  },
  methods: {
    async fetchOrderInfo() {
      try {
        const orderId = 100622;
        const token =
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk5MzE4LCJpYXQiOjE3MTQyOTkyODgsImV4cCI6MTc1NzQ5OTI4OH0.J31KF96C-EnnIel6p9iX2K7k7ujggDRFvxrephRRK-k';
        const response = await axios.get(`${process.env.VUE_APP_API_URL}/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data) {
          this.orderInfo = response.data[0];
        }

        const responseDetails = await fetch(`${process.env.VUE_APP_API_URL}/api/orders/details/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await responseDetails.json();
        console.log('밥국밥', data)
        if(data) {

        this.orderDetails = data;
        }
      } catch (error) {
        console.error('주문 상세를 불러오는 데 실패했습니다', error);
      }
    },
    handleCashPurchase() {
      this.$router.push({ name: 'payCash' });
    },
    handleCheckShipping(){
      this.$router.push({name: 'OrderShipping'});
    }
  }
};
</script>

<style>
.button-cash-purchase {
  background-color: #4caf50; /* 녹색 배경 */
  color: white; /* 흰색 텍스트 */
  padding: 10px 20px; /* 상하 10px, 좌우 20px 패딩 */
  border: none; /* 테두리 없음 */
  border-radius: 5px; /* 모서리 둥글게 */
  cursor: pointer; /* 마우스 오버 시 커서 변경 */
  transition: all 0.3s; /* 부드러운 전환 효과 */
}

.button-cash-purchase:hover {
  background-color: #45a049; /* 마우스 오버 시 배경색 변경 */
}

.order-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.order-page>div {
    margin: 5px 0;
}
.order-btn {
    display: flex;
}
.order-btn > button {
  margin: 0 5px;
}
</style>
