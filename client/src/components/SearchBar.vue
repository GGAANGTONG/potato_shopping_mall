<template>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" @keyup.enter="search" placeholder="상품 검색...">
      <button @click="search">검색</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SearchBar',
    data() {
      return {
        searchQuery: ''
      };
    },
    methods: {
      search() {
        // 검색 로직 실행, 예를 들어 이벤트를 발생시키거나 API 호출
        console.log('Searching for:', this.searchQuery);
      }
    }
  }
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  .search-bar input {
    padding: 10px;
    width: 80%;
    margin-right: 10px;
  }
  .search-bar button {
    padding: 10px 20px;
  }
  </style>
  