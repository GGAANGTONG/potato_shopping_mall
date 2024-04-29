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
        const response = await fetch(process.env.VUE_APP_API_URL+`/api/goods/get-one/${this.goodsId}`);
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
/* 상품 상세 페이지 전체 컨테이너 */
.product-detail {
    display: flex;
    flex-direction: row;
    margin: 20px;
    padding: 20px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background-color: #fff;
}

/* 상품 이미지 스타일 */
.product-image {
    width: 300px;
    height: 300px;
    margin-right: 20px;
    border-radius: 5px;
    object-fit: cover;
}

/* 상품 정보 영역 */
.product-info {
    flex-grow: 1;
}

/* 상품 이름 */
.product-info h3 {
    margin-top: 0;
    color: #333;
    font-size: 24px;
}

/* 원가격, 할인가격 스타일 */
.original-price {
    text-decoration: line-through;
    color: #999;
    margin-right: 10px;
}

.discounted-price {
    color: #d32f2f;
    font-weight: bold;
}

.discount-rate {
    color: #388e3c;
    font-weight: bold;
    margin-left: 10px;
}

/* 상품 설명 */
.product-info p {
    color: #666;
    font-size: 16px;
    line-height: 1.5;
}

/* 장바구니 버튼 스타일 */
button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #45a049;
}

</style>
