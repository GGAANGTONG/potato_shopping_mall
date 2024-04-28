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
    <li v-for="stock in responseStocks">
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
      const responseGoods = await axios.get(`http://localhost:3000/api/goods/get-one/${goodsId}`)
      this.responseGoods = responseGoods.data
      // //현재 창고 이름
      // const responseStorageCurrent = await axios.get(`http://localhost:3000/api/storage/get-one/${storageIdCurrent}`)
      // const storageNameCurrent = responseStorageCurrent.data.name

      //stock_id
      const responseStocks = await axios.get(`http://localhost:3000/api/stocks/by-goods/${goodsId}`)
      this.responseStocks = responseStocks.data
      //stock_id
    }

  }
    }
  </script>