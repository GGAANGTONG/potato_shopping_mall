<template>
  <div class="stock-management">
    <h1>재고관리</h1>
    <input v-model="CurrentLocation" placeholder="상품 번호, 창고 번호">
    <button @click="CurrentGoodsLocation">상품 재고 조회</button>
    <p>상품 번호: {{ goodsId }}</p>

    <div>
      
      <ul>
    <h2>상품 정보</h2>
    <li class="goods_info"> {{ responseGoods }} </li>
    <h3>재고 정보</h3>
    <li v-for="(stock, index) in responseStocks" :key = "index">
          {{ stock }}
        </li>
      </ul>
    </div>
  </div>

  </template>

  <script>
  import axios from 'axios'
  export default {
    name: 'StockManagement',
    data() {
      return {
        goodsId: '',
        responseGoods: '',
        responseStocks: []
    }
  },
  methods: {
    async StockManagement () {

      const goodsId = this.goodsId

      //상품 정보
      const responseGoods = await axios.get(process.env.VUE_APP_API_URL+`/api/goods/get-one/${goodsId}`)
      this.responseGoods = responseGoods.data

      //stock_id
      const responseStocks = await axios.get(process.env.VUE_APP_API_URL+`/api/stocks/by-goods/${goodsId}`)
      this.responseStocks = responseStocks.data
    }

  }
    }
  </script>