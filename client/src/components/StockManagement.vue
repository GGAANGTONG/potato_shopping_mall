<template>
  <div class="stock-management">
    <h1>재고 관리</h1>
    <div class="search-section">
      <input v-model="goodsId" placeholder="상품 번호 입력">
      <button @click="fetchStockInformation">상품 재고 조회</button>
    </div>
    <!-- 현재 상품 위치 테이블 -->
    <div class="stock-info">
      <h2>현재 상품 위치</h2>
      <table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>로케이션</th>
            <th>RACK_ID</th>
            <th>STOCK_ID</th>
            <th>재고(개)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(stock, index) in stocks" :key="index">
          <td>{{ stock.g_name }}</td>
          <td>{{ stock.m_name }}</td>
          <td>{{ stock.racks_id }}</td>
          <td>{{ stock.stock_id }}</td>
          <td>{{ stock.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 상품 이동 버튼-->
    <div class="transfer-section">
  <h2>상품 이동 </h2>
  <input v-model="transferGoodsId" placeholder="상품 ID">
  <input v-model="sourceStorageId" placeholder="출발지 ID">
  <input v-model="destinationStorageId" placeholder="목적지 ID">
  <input v-model="transferCount" placeholder="이동 수량">
  <button @click="transferGoods">상품 이동</button>
  </div>
    <!-- 상품 이동 -->
    <!-- <div class="stock-move">
      <h2>상품 이동</h2>
      <table>
        <thead>
          <tr>
            <th>상품명</th>
            <th>수량(개)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(movement, index) in upcomingMovements" :key="index">
            <td>{{ movement.productName }}</td>
            <td>{{ movement.quantityAfterMove }}</td>
          </tr>
        </tbody>
      </table>
    </div> -->
    <!-- 현재 위치 -->
    <div class="current-movement">
      <h2>현재 위치</h2>
      <table>
        <thead>
          <tr>
            <th>물류센터</th>
            <th>RACK_ID</th>
            <th>STOCK_ID</th>
            <th>재고(개)</th>
          </tr>
        </thead>
        <tbody>
          <tr >
            <td>{{ completedMovements.g_name }}</td>
            <td>{{ completedMovements.racks_id }}</td>
            <td>{{ completedMovements.stock_id }}</td>
            <td>{{ completedMovements.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 이동 후 상품 위치 -->
    <div class="after-movement">
      <h2>이동 후 상품 위치</h2>
      <table>
        <thead>
          <tr>
            <th>물류센터</th>
            <th>RACK_ID</th>
            <th>STOCK_ID</th>
            <th>재고(개)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ afterMovements.g_name }}</td>
            <td>{{ afterMovements.racks_id }}</td>
            <td>{{ afterMovements.stock_id }}</td>
            <td>{{ afterMovements.count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StockManagement',
  data() {
    return {
      goodsId: '', // 사용자가 입력하는 상품 ID
      stocks: [], // API로부터 받은 재고 데이터를 저장할 배열
      transferGoodsId: '',
      sourceStorageId: '',
      destinationStorageId: '',
      transferCount: '',
      completedMovements : [],
    };
  },
  methods: {
    async fetchStockInformation() {
      const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000';
      if (!this.goodsId) {
        alert('상품 번호를 입력하세요.');
        return;
      }
      try {
        const response = await axios.get(`${apiUrl}/api/mangement/${this.goodsId}`);
        this.stocks = response.data; // 응답 데이터를 stocks 배열에 저장
      } catch (error) {
        console.error('Error fetching stock information:', error);
        alert('상품 정보를 불러오는 중 오류가 발생했습니다.');
      }
    },
    async transferGoods() {
    const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000';
    try {
      const response = await axios.post(`${apiUrl}/api/mangement/transfer`, {
        goods_id: this.transferGoodsId,
        source_storage_id: this.sourceStorageId,
        destination_storage_id: this.destinationStorageId,
        transferCount: this.transferCount
      });
      this.completedMovements = response.data.source;
      this.afterMovements=response.data.destination;
      console.log(11,response.data.source)
      alert('상품 이동이 성공적으로 처리되었습니다.');
      console.log('Transfer response:', response.data);
    } catch (error) {
      console.error('Error transferring goods:', error);
      alert('상품 이동 중 오류가 발생했습니다.');
    }
  }
  }
};
</script>

<style scoped>
.stock-management {
  padding: 20px;
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f9f9f9; /* 배경색 추가 */
}

h1, h2 {
  color: #333; /* 제목 색상 변경 */
  margin: 20px 0; /* 상하 여백 조정 */
}

.search-section {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.search-section input[type="text"] {
  padding: 10px;
  margin-right: 10px;
  width: 50%; /* 입력 필드 너비 조정 */
  border: 2px solid #ccc; /* 테두리 스타일 변경 */
  border-radius: 5px; /* 테두리 둥글게 처리 */
}

.search-section button {
  padding: 10px 20px;
  background-color: #5C67F2; /* 버튼 색상 변경 */
  color: white;
  border: none;
  border-radius: 5px; /* 버튼 둥글게 처리 */
  cursor: pointer; /* 마우스 커서 변경 */
}

table {
  width: 80%; /* 테이블 너비 조정 */
  border-collapse: collapse;
  margin-top: 10px;
  margin-bottom: 20px; /* 테이블 하단 여백 추가 */
}

th, td {
  padding: 8px;
  text-align: center; /* 텍스트 중앙 정렬 */
  border: 1px solid #ddd; /* 테두리 색상 변경 */
}

thead th {
  background-color: #f0f0f0; /* 헤더 배경색 변경 */
  font-weight: bold; /* 글씨 굵기 변경 */
}

tbody td {
  background-color: #ffffff; /* 내용 배경색 변경 */
}

tbody tr:nth-child(even) {
  background-color: #f8f8f8; /* 짝수 줄 배경색 변경 */
}

@media screen and (max-width: 600px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }

  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr { border: 1px solid #ccc; }

  td {
    border: none;
    border-bottom: 1px solid #eee;
    position: relative;
    padding-left: 50%;
  }

  td:before {
    position: absolute;
    top: 6px;
    left: 6px;
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    content: attr(data-label);
    font-weight: bold;
    text-align: left;
  }
}
</style>