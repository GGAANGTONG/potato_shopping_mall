<template>
    <div class="category-menu">
      <button
        v-for="category in categories"
        :key="category.id"
        @click="selectCategory(category)"
      >
        {{ category.name }}
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'CategoryMenu',
    data() {
      return {
        categories: [
          { id: 1, name: '전자제품' },
          { id: 2, name: '가구' },
          { id: 3, name: '의류' }
        ]
      };
    },
    methods: {
      selectCategory(category) {
        console.log('Selected category:', category.name);
      }
    }
  }
  </script>
  
  <style scoped>
  .category-menu {
    display: flex;
    justify-content: center;
    padding: 10px;
  }
  .category-menu button {
    margin: 0 10px;
    padding: 10px 20px;
    background: none;
    border: 2px solid #ccc;
    cursor: pointer;
  }
  .category-menu button:hover {
    background-color: #f0f0f0;
  }
  </style>
  