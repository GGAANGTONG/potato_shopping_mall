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
        this.$router.push('/UserProfile'); 
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
  