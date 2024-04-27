<template>
  <div class="product-item">
    <img :src="product.image" :alt="product.name" class="product-image"/>
    <div class="product-info">
      <h3>{{ product.name }}</h3>
      <p>{{ formatCurrency(product.price) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductItem',
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatCurrency(value) {
      return `$${value.toFixed(2)}`;
    }
  }
}
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
  