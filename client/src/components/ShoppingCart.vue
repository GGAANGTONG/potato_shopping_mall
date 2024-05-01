<template>
  <div class="shopping-cart">
    <h1>장바구니</h1>
    <ul v-if="cartItems.length > 0">
      <li v-for="item in cartItems" :key="item.id">
        {{ item.goods.g_name }} - {{ item.ct_price }}원 x {{ item.ct_count }}
        <button @click="increaseQuantity(item)">+</button>
        <button @click="decreaseQuantity(item)">-</button>
        <button @click="removeItem(item)">제거</button>
      </li>
    </ul>
    <p v-else>장바구니가 비었습니다.</p>
    
    <div class="price-summary">
      <h2>주문 예상 금액</h2>
      <div><strong>총 상품 가격(원가): </strong> {{ totalPrice }}원</div>
      <div>
        <strong>총 할인된 가격(원가-할인가): </strong>
        {{ totalDiscountedPrice }}원
      </div>
      <div><strong>총 배송비: </strong> 3,500원</div>
      <p>{{ totalPrice - totalDiscountedPrice - 3500 }}원</p>
    </div>
    <button class="order-button" @click="handleOrder">주문하기</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ShoppingCart',
  data() {
    return {
      cartItems: [], // 초기 장바구니 아이템을 빈 배열로 설정
    };
  },
  created() {
    this.fetchCartItems(); // 컴포넌트 생성 시 장바구니 아이템 로드
  },
  methods: {
    async fetchCartItems() {
      try {
        let encodedToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          .split('=')[1];
        let token = decodeURIComponent(encodedToken);

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/cart`,
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );
        this.cartItems = response.data;
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    },

    async removeItem(item) {
      try {
        // 토큰 가져오기
        let encodedToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          .split('=')[1];
        let token = decodeURIComponent(encodedToken);

        // API 호출하여 상품 제거
        await axios.delete(
          `${process.env.VUE_APP_API_URL}/api/cart/remove/${item.goods.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // 클라이언트 측 상태 업데이트
        this.cartItems = this.cartItems.filter(
          (it) => it.goods.id !== item.goods.id,
        );
      } catch (error) {
        console.error('Failed to remove cart item:', error);
      }
    },

    increaseQuantity(item) {
      item.ct_count++;
    },
    decreaseQuantity(item) {
      if (item.ct_count > 1) {
        item.ct_count--;
      }
    },
    handleOrder() {
      this.$router.push('/order');
    },
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        return total + item.ct_price * item.ct_count;
      }, 0);
    },
    totalOriginalPrice() {
      return this.cartItems.reduce((total, item) => {
        return total + item.ct_price * item.ct_count;
      }, 0);
    },
    totalDiscountedPrice() {
      return this.cartItems.reduce((total, item) => {
        return (
          total +
            ((item.ct_price || 0) - (item.goods.g_price || 0)) *
              (item.ct_count || 0) || 0
        );
      }, 0);
    },
  },
};
</script>

<style scoped>
.shopping-cart {
  width: 80%;
  margin: 20px auto;
}
.shopping-cart ul {
  list-style: none;
  padding: 0;
}
.shopping-cart li {
  margin-bottom: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
}

.price-summary {
  margin-top: 20px;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.price-summary div {
  margin-bottom: 10px;
  font-weight: bold;
}
</style>
