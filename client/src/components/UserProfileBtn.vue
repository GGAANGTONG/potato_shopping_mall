<template>
    <div class="user-profile">
      <button @click="openUserProfile">내 정보</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'UserProfileBtn',
    methods: {
      openUserProfile() {
        console.log('User profile opened');
        // 실제 구현에서는 사용자 정보 페이지로 라우팅하거나 팝업을 열 수 있습니다.
      }
    }
  }
  </script>
  
  <style scoped>
  .user-profile button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  .user-profile button:hover {
    background-color: #45a049;
  }
  </style>
  