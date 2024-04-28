<template>
  <SearchBar @search="handleSearch"></SearchBar>
  <div class="fix-layout">
    <h1>상품 목록</h1>
    <ul class="product-list">
      <li v-for="good in goods" :key="good.id" @click="goToProductDetail(good.id)">
        <img :src="`https://d3cfe6mqokky5s.cloudfront.net/${good.image}`" :alt="good.name">
        <p class="g_name">{{ good.name }}</p>
        <p class="g_price">
          <span class="g_discount_rate">
          {{ good.discountRate }}%</span>
          <span>{{ good.price }}</span>
        </p>
        <p class="g_cost_price">{{ good.costPrice }}원</p>
      </li>
      <template v-if="goods.length === 0">
        <p class="no-products-message">검색된 상품이 없습니다.</p>
      </template>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import SearchBar from './SearchBar.vue';

export default {
  name: 'ProductList',
  data() {
    return {
      goods: []
    };
  },
  created() {
    this.fetchGoods('');
  },
  components: {
    SearchBar,
  },
  methods: {
    handleSearch(searchQuery) {
      console.log("검색어 수신:", searchQuery);
      this.fetchGoods(searchQuery, this.selectedCategory ? this.selectedCategory.id : '');

    },
    async fetchGoods(g_name='',category='') {
      const params = new URLSearchParams({
        g_name: g_name || '',
        cate_id: category
      });
      try {
        const response = await axios.get(`http://localhost:3000/api/goods/?${params.toString()}`);
        if (response.data && Array.isArray(response.data)) {
          this.goods = response.data;
        } else {
          console.error("상품 정보 형식이 잘못되었습니다.");
        }
      } catch (error) {
        console.log(`http://localhost:3000/api/goods/?${params.toString()}`)
        console.error("상품 정보를 불러오는 데에서 에러가 발생했습니다 : ", error);
      }
    },
    goToProductDetail(goodsId) {
      this.$router.push(`/good-one/${goodsId}`);
    },
  },
  computed: {
    ...mapState({
      searchQuery: state => state.searchQuery,
      selectedCategory: state => state.selectedCategory,
    }),
  },
  watch: {
    selectedCategory(newVal) {
      this.fetchGoods('', newVal ? newVal.id : '');
    },
  },
}
</script>
  
  <style scoped>
  .product-list {
    display: flex;
    flex-wrap: wrap;
    justify-content:center;
  }
  .product-list li {
    flex : 1;
    min-width: 20%;
    max-width: 240px;
    margin: 10px;
    border: 1px solid #ccc;
    padding: 20px; box-sizing: border-box;
  }
  .product-list .g_name {
    font-size: 18px;
    font-weight: bold;
    color: #7f53af;
  }
  .product-list .g_discount_rate {
    margin-right: 10px;
  }
  .product-list .g_cost_price {
    color : #af4646;
    font-size: 24px;
    font-weight: bold;
  }
  h1 {
    text-align: center;
  }
  </style>
  
