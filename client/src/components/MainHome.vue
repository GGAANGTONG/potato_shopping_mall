<template>
    <div>
      <nav>
        <SearchBar/>
        <CategoryMenu/>
        <UserProfileBtn/>
        <ShoppingCartBtn/>
      </nav>
      <ProductList/>
    </div>
  </template>
  
  <script>
  import SearchBar from './SearchBar.vue';
  import CategoryMenu from './CategoryMenu.vue';
  import UserProfileBtn from './UserProfileBtn.vue';
  import ShoppingCartBtn from './ShoppingCartBtn.vue';
  import ProductList from './ProductList.vue';
  
  export default {
    name: 'MainHome',
    components: {
      SearchBar,
      CategoryMenu,
      UserProfileBtn,
      ShoppingCartBtn,
      ProductList
    }
  }
  </script>
  
  <style>
  /* Home specific styles */
  </style>
  