<template>
  <SearchBar @search="handleSearch"></SearchBar>
  <div class="fix-layout">
    <h1>상품 목록</h1>
    <ul class="product-list">
      <li v-for="good in goods" :key="good.id" @click="goToProductDetail(good.id)">
        <img :src="`${good.image}`" :alt="good.name">
        <!-- <img :src="`https://d3cfe6mqokky5s.cloudfront.net/${good.image}`" :alt="good.name"> -->
        <p class="g_name">{{ good.name }}</p>
        <p class="g_price">
          <span class="g_discount_rate"> {{ good.discountRate }}%</span>
          <span>{{ good.price }}</span>
        </p>
        <p class="g_cost_price">{{ good.costPrice }}원</p>
      </li>
      <template v-if="goods.length === 0">
        <p class="no-products-message">검색된 상품이 없습니다.</p>
      </template>
    </ul>
    <div class="pagination">
      <button @click="fetchGoods(currentPage - 1)" :disabled="currentPage <= 1">
        이전
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="fetchGoods(currentPage + 1)" :disabled="currentPage >= totalPages">
        다음
      </button>
    </div>
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
      goods: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.fetchGoods();
  },
  components: {
    SearchBar,
  },
  methods: {
    handleSearch(searchQuery) {
      console.log("검색어 수신:", searchQuery);
      this.fetchGoods(1, searchQuery, this.selectedCategory ? this.selectedCategory.id : '');
    },
    async fetchGoods(page = this.currentPage, g_name = '', category = '') {
      const params = new URLSearchParams({
        page,
        pageSize: this.pageSize,
        g_name: g_name || '',
        cate_id: category || '',
      });
      try {
        const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000';
        console.log(`${apiUrl}/api/goods/?${params.toString()}`);
        const response = await axios.get(`${apiUrl}/api/goods/?${params.toString()}`);
        if (response.data && response.data.results) {
          this.goods = response.data.results;
          this.total = response.data.total;
          this.currentPage = page;
        } else {
          this.goods = [];
          this.total = 0;
        }
      } catch (error) {
        console.error("Error fetching goods:", error);
        this.goods = [];
        this.total = 0;
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
    totalPages() {
      return Math.ceil(this.total / this.pageSize);
    },
  },
  watch: {
    selectedCategory(newVal) {
      this.fetchGoods(1, '', newVal ? newVal.id : '');
    },
  },
};
</script>

<style scoped>
.product-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.product-list li {
  flex: 1;
  min-width: 20%;
  max-width: 240px;
  margin: 10px;
  border: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;
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
  color: #af4646;
  font-size: 24px;
  font-weight: bold;
}
h1 {
  text-align: center;
}
</style>
