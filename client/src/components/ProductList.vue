<template>
  <div>
    <h1>상품 목록</h1>
    <ul class="product-list">
      <li v-for="good in goods" :key="good.id">
        <img :src="`https://d3cfe6mqokky5s.cloudfront.net/${good.image}`" :alt="good.name">
        {{ good.name }} - {{ good.price }}원
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProductList',
  data() {
    return {
      goods: []
    };
  },
  created() {
    this.fetchGoods();
  },
  methods: {
    async fetchGoods() {
      try {
        const response = await axios.get('http://localhost:3000/api/goods/');
        this.goods = response.data;
      } catch (error) {
        console.error("상품 정보를 불러오는 데에서 에러가 발생했습니다 : ", error);
      }
    }
  }
}
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
  