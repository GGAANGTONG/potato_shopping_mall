<template>
  <div class="shopping-cart">
    <h1>장바구니</h1>
    <ul>
      <li v-for="item in cartItems" :key="item.id">
        {{ item.productName }} - {{ item.costPrice }}원 x {{ item.quantity }}
        <button @click="increaseQuantity(item)">+</button>
        <button @click="decreaseQuantity(item)">-</button>
        <button @click="removeItem(item)">제거</button>
      </li>
    </ul>
    <div class="price-summary">
      <h2>주문 예상 금액</h2>
      <div><strong>총 상품 가격(원가): </strong> {{ totalPrice }}원</div>
      <div>
        <strong>총 할인된 가격(원가-할인가): </strong>
        {{ totalDiscountedPrice }}원
      </div>
      <div><strong>총 배송비: </strong> 3,500원</div>
      <p>
        {{ totalPrice - (totalDiscountedPrice == null ? 0 : totalDiscountedPrice ) - 3500 }}원
      </p>
    </div>
    <button class="order-button" @click="handleOrder">주문하기</button>
  </div>
</template>

<script>
export default {
  name: 'ShoppingCart',
  data() {
    return {
      cartItems: [
        { id: 1, productName: '제품 A', costPrice: 10000, quantity: 1 },
        { id: 2, productName: '제품 B', costPrice: 20000, quantity: 2 },
        // 초기 장바구니 아이템
      ],
    };
  },
  methods: {
    increaseQuantity(item) {
      item.quantity++;
    },
    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      }
    },
    removeItem(item) {
      this.cartItems = this.cartItems.filter((it) => it.id !== item.id);
    },
    handleOrder() {
      console.log('주문하기 버튼 클릭됨!');
    },
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        return total + item.costPrice * item.quantity;
      }, 0);
    },
  },
  totalOriginalPrice() {
    return this.cartItems.reduce((total, item) => {
      return total + item.costPrice * item.quantity;
    }, 0);
  },
  totalDiscountedPrice() {
    return this.cartItems.reduce((total, item) => {
      return total + (item.costPrice - item.g_price) * item.quantity;
    }, 0);
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
