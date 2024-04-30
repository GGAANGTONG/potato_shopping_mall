<template>
  <div id="payPoint">
    <h1>결제하기</h1>
    <input v-model="orders_id_point" placeholder="주문 번호를 입력해 주세요">
    <button @click="payPoint">결제</button>
    <p>메세지: {{ message }}</p>
  </div>
</template>


