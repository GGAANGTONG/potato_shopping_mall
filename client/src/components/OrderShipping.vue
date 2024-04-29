<template>
  <div class="order-shipping">
    <div class="map-container">
      <div id="map" style="width: 500px; height: 400px"></div>
    </div>
    <div class="shipping-info">
      <h2>배송 정보</h2>
      <table>
        <thead>
          <tr>
            <th>구분</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>상품명</td>
            <td>감자튀김(5Ton) * 3</td>
          </tr>
          <tr>
            <td>출발지</td>
            <td>문경 물류센터</td>
          </tr>
          <tr>
            <td>도착지</td>
            <td>전북특별자치도 무주군 적상면 괴목리 산 82-1</td>
          </tr>
          <tr>
            <td>거리</td>
            <td>151.3 km</td>
          </tr>
          <tr>
            <td>구매일</td>
            <td>2024-05-02</td>
          </tr>
          <tr>
            <td>배송 시작일</td>
            <td>2024-05-02</td>
          </tr>
          <tr>
            <td>도착 예정일</td>
            <td>2024-05-03</td>
          </tr>
        </tbody>
      </table>
      <div class="tracking-number">
        <span>운송장 번호:</span>
        <span>3559403232a3134b</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const appKey = "6c0b47092d53ae03e0b308dc4726af66";
const center = ref([37.5665, 127.0071]);

const loadKakaoMaps = () => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {  // Check if already loaded
      resolve(window.kakao.maps);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve(window.kakao.maps);
      });
    };
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
};

const initializeMap = () => {
  let mapContainer = document.getElementById('map');
  let mapOption = {
      center: new window.kakao.maps.LatLng(center.value[0], center.value[1]),
      level: 10
  };
  let map = new window.kakao.maps.Map(mapContainer, mapOption);

  // Address to coordinates conversion
  var geocoder = new window.kakao.maps.services.Geocoder();
  geocoder.addressSearch('전북특별자치도 무주군 적상면 괴목리 산 82-1', function(result, status) {
    if (status === window.kakao.maps.services.Status.OK) {
      var coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
      var marker = new window.kakao.maps.Marker({
          map: map,
          position: coords
      });
      var infowindow = new window.kakao.maps.InfoWindow({
          content: '<div style="width:150px;text-align:center;padding:6px 0;">배송목적지</div>'
      });
      infowindow.open(map, marker);
      map.setCenter(coords);
    }
  });
}

onMounted(async () => {
  try {
    await loadKakaoMaps();
    initializeMap();
  } catch (error) {
    console.error("Failed to load the Kakao Maps script:", error);
  }
});
</script>

<style scoped>
.order-shipping {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.map-container {
  width: 100%;
  max-width: 500px;
  margin-bottom: 20px;
}

#map {
  width: 100%;
  height: 400px; /* 높이는 이미 지정되어 있으므로 필요에 따라 조정하세요 */
  border: 1px solid #ccc; /* 지도 주변에 경계선을 추가 */
}

.shipping-info {
  width: 100%;
  max-width: 500px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

table {
  width: 100%;
  border-collapse: collapse; /* 테이블의 선들을 겹치게 */
}

th,
td {
  text-align: left;
  padding: 8px;
  border-bottom: 1px solid #ddd; /* 행과 행 사이에 구분선 추가 */
}

th {
  background-color: #f0f0f0; /* 헤더 배경 색상 */
}

.tracking-number {
  margin-top: 20px;
  font-size: 16px;
}

span {
  margin-right: 10px;
}
</style>
