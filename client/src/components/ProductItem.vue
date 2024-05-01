<template>
  <div class="product-detail" v-if="good.length > 0">
    <!-- :src="`https://d3cfe6mqokky5s.cloudfront.net/${good[0].image}`" -->
    <img
    :src="`${good[0].image}`"
      :alt="good[0].name"
      class="product-image"
    />
    <div class="product-info">
      <h3>{{ good[0].name }}</h3>
      <p v-if="good[0].discountRate">
        <span class="original-price">{{ good[0].costPrice }}</span>
        <span class="discounted-price">{{ good[0].price }}</span>
        <span class="discount-rate">({{ Math.floor( (1- good[0].discountRate) * 100) }}% 할인)</span>
      </p>
      <p v-else>
        {{ good[0].price }} $
      </p>
      <p>{{ good[0].description }}</p>
      <p>{{ good[0].option }}</p>
      <p>재고 상태: {{ good[0].stockStatus }}</p>
      <label for="ctCount">수량:</label>
      <input type="number" id="ctCount" v-model="ctCount" min="1" max="99" />

      <button @click="addToCart">장바구니 담기</button>
      <Modal
        :message="modalMessage"
        :is-open="isModalOpen"
        @close="closeModal"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import Modal from './PotatoModal.vue';

export default {
  name: 'ProductDetail',
  components: {
    Modal,
  },
  props: {
    goodsId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      good: [], // 초기값을 빈 배열로 설정
      ctCount: 1,
      modalMessage: '',
      isModalOpen: false,
    };
  },
  created() {
    this.fetchGood();
  },
  methods: {
    async fetchGood() {
      try {
        const response = await fetch(
          process.env.VUE_APP_API_URL + `/api/goods/get-one/${this.goodsId}`,
        );
        const data = await response.json();
        this.good = data;
      } catch (error) {
        console.error('상품 정보 가져오기 실패:', error);
      }
    },
    formatCurrency(value) {
      return `₩${value.toFixed(2)}`;
    },
    async addToCart() {
      try {
        let encodedToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          .split('=')[1];
        let token = decodeURIComponent(encodedToken);
        const apiUrl = `${process.env.VUE_APP_API_URL}/api/cart/add/${this.goodsId}`;
        const response = await axios.post(
          apiUrl,
          { ctCount: this.ctCount },
          {
            headers: {
              Authorization: `${token}`,
            },
          },
        );
        // 응답 처리
        if (response.status === 201) {
          this.isModalOpen = true;
          this.modalMessage =
          `상품이 장바구니에 추가되었습니다. <button onclick="`+`window.location.href='`+process.env.VUE_APP_CLIENT_URL+'/cart'+`'">장바구니 확인하기</button>`;
        } else {
          console.error('장바구니에 상품 추가 실패');
        }
      } catch (error) {
        console.error('장바구니에 상품 추가 중 에러 발생:', error);
      }
    },

    closeModal() {
      this.isModalOpen = false;
    },

    goToCart() {
      this.$router.push('/cart'); 
      this.closeModal(); 
    },
  },
  computed: {
    discountedPrice() {
      if (this.good && this.good.discountRate > 0) {
        return this.good.price * (1 - this.good.discountRate / 100);
      }
      return this.good.price;
    },
  },
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
  background-color: #4caf50;
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
