<template>
    <div class="search-bar">
      <input type="text" v-model="searchQuery" @keyup.enter="search" placeholder="상품 검색...">
      <button @click="$emit('search', searchQuery)">검색</button>
    </div>
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    name: 'SearchBar',
    data() {
      return {
        searchQuery: '' 
      }
    },
    computed: {
      ...mapState({
        searchQuery: state => state.searchQuery
      }),
    },
    methods: {
      search() {
        this.$emit('search', this.searchQuery); 
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
  