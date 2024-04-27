<template>
    <div class="shopping-cart">
      <h1>장바구니</h1>
      <ul>
        <li v-for="item in cartItems" :key="item.id">
          {{ item.productName }} - {{ item.price }}원 x {{ item.quantity }}
          <button @click="increaseQuantity(item)">+</button>
          <button @click="decreaseQuantity(item)">-</button>
          <button @click="removeItem(item)">제거</button>
        </li>
      </ul>
      <div>
        <strong>총합: {{ totalPrice }}원</strong>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ShoppingCart',
    data() {
      return {
        cartItems: [
          { id: 1, productName: '제품 A', price: 10000, quantity: 1 },
          { id: 2, productName: '제품 B', price: 20000, quantity: 2 },
          // 초기 장바구니 아이템
        ]
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
        this.cartItems = this.cartItems.filter(it => it.id !== item.id);
      }
    },
    computed: {
      totalPrice() {
        return this.cartItems.reduce((total, item) => {
          return total + (item.price * item.quantity);
        }, 0);
      }
    }
  }
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
  </style>
  