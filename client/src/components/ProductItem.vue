<template>
  <div class="product-detail"  v-if="good.length > 0">
    <img :src="`https://d3cfe6mqokky5s.cloudfront.net/${good[0].image}`" :alt="good[0].name" class="product-image" />
    <div class="product-info">
      <h3>{{ good[0].name }}</h3>
      <p v-if="good[0].discountRate">
        <span class="original-price">{{
          good[0].costPrice
        }}</span>
        <span class="discounted-price">{{
          discountedPrice
        }}</span>
        <span class="discount-rate">({{ good[0].discountRate }}% 할인)</span>
      </p>
      <p v-else>
        {{ good[0].price }}
      </p>
      <p>{{ good[0].description }}</p>
      <p>{{ good[0].option }}</p>
      <p>재고 상태: {{ good[0].stockStatus }}</p>
      <button @click="addToCart">장바구니 담기</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetail',
  props: {
    goodsId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      good: []  // 초기값을 빈 배열로 설정
    };
  },
  created() {
    this.fetchGood();
  },
  methods: {
    async fetchGood() {
      try {
        const response = await fetch(`http://localhost:3000/api/goods/get-one/${this.goodsId}`);
        const data = await response.json();
        this.good = data;
      } catch (error) {
        console.error('상품 정보 가져오기 실패:', error);
      }
    },
    formatCurrency(value) {
      return `₩${value.toFixed(2)}`;
    },
    addToCart() {
      console.log('장바구니 담기 버튼 클릭!');
    }
  },
  computed: {
    discountedPrice() {
      if (this.good && this.good.discountRate > 0) {
        return this.good.price * (1 - this.good.discountRate / 100);
      }
      return this.good.price;
    }
  }
};

</script>

<style scoped>
.product-item {
  border: 1px solid #ddd;
  padding: 10px;
  margin: 10px;
  width: 200px;
  text-align: center;
}

.product-image {
  width: 100%;
  max-width: 500px;
  height: auto;
  margin-bottom: 10px;
}

.product-info h3 {
  font-size: 16px;
  margin: 0;
}

.product-info p {
  font-size: 14px;
  color: #666;
}
</style>
