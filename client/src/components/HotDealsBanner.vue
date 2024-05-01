<template>
  <div class="hot-deals fix-layout">
    <div class="hot-deal-box" v-if="hotDeals && hotDeals.name">
      <img :src="hotDeals.image" alt="핫딜 상품 이미지" class="product-image" />
      <div class="product-details">
        <h2 class="f-Gugi">오늘의 핫딜</h2>
        <h3>{{ hotDeals.name }}</h3>
        <p class="price original-price">{{ hotDeals.costPrice }}$</p>
        <p class="price discount-price">{{ hotDeals.price }}$</p>
        <p class="discount-rate">할인율: {{ Math.floor((1 - hotDeals.discountRate) * 100) }}%</p>
        <p class="description">{{ hotDeals.description }}</p>
      </div>
    </div>
    <p v-else>핫딜 상품을 불러오는 중입니다...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HotDealsBanner',
  data() {
    return {
      hotDeals: null,
    };
  },
  mounted() {
    this.fetchHotDeals();
  },
  methods: {
    async fetchHotDeals() {
      const apiUrl = `${process.env.VUE_APP_API_URL}/api/goods/get-highest-discount`;
      try {
        const response = await axios.get(apiUrl);
        this.hotDeals = response.data;
      } catch (error) {
        console.error('핫딜 상품을 불러오는 중 오류가 발생했습니다:', error);
      }
    },
  },
};
</script>

<style scoped>
/* 핫딜 스타일링을 위한 CSS */
.hot-deals {
  margin-top: 20px;
  margin-bottom : 40px;
}
.hot-deal-box {
  display: flex;
}

.product-image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  margin-right: 20px;
}
.product-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.product-details h2 {
  margin-top: 0;
  margin-bottom: 20px;
  padding-bottom: 20px;
  position: relative;
  color: #008CBA;
  font-size: 1.5em;
}
.product-details h2::after {
  position: absolute;
  content: '';
  width: 100px;
  height: 3px;
  background: #008CBA;
  left: 0;
  bottom: 0;
}

.price {
  font-weight: bold;
}

.original-price {
  text-decoration: line-through; /* 원가에 취소선 표시 */
  color: #666;
}

.discount-price {
  color: #e75555; /* 할인가를 빨간색으로 강조 */
  font-size: 30px;
}

.discount-rate {
  color: #008CBA
}

.description {
  margin-top: 5px;
  color: #666;
}
</style>
