<template>
  <div class="category-menu">
    <button
      v-for="category in categories"
      :key="category.id"
      @click="selectCategory(category)"
    >
      {{ category.c_name }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'CategoryMenu',
  data() {
    return {
      categories: []
    };
  },
created() {
  this.fetchCategories();
},
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get(process.env.VUE_APP_API_URL+'/api/categories/');
        this.categories = response.data;
      } catch (error) {
        console.error("카테고리 정보를 불러오는 데에서 에러가 발생했습니다 : ", error);
      }
    },
    selectCategory(category){
      this.$store.commit('setSelectedCategory', category);
    }
  }
}

</script>

<style scoped>
.category-menu {
  display: flex;
  justify-content: center;
  padding: 10px;
  flex-wrap: wrap;
}
.category-menu button {
  margin: 0 10px;
  padding: 10px 20px;
  margin: 2px;
  background: none;
  border: 1px solid #ccc;
  cursor: pointer;
}
.category-menu button:hover {
  background-color: #f0f0f0;
}
</style>
