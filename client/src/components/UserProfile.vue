<template>
  <div class="user-profile">
    <h1>유저 프로필</h1>
    <div class="profile-info">
      <div class="profile-image">
        <img :src="userProfile.data.profile || 'https://placehold.co/150'" alt="프로필 사진" />
      </div>
      <div class="profile-details">
        <p>이름: {{ userProfile.data.name }}</p>
        <p>닉네임: {{ userProfile.data.nickname }}</p>
        <p>이메일: {{ userProfile.data.email }}</p>
        <p>포인트: {{ userProfile.data.points }} 포인트</p>
        <p>등급: {{ userProfile.data.grade }} 등급</p>
        <p>
          주소:
          {{ userProfile.data.address }}
          {{ userProfile.data.detail_address }}
        </p>
        <button @click="stockManagementBtn">재고 관리 페이지</button>
      </div>
    </div>
  </div>
</template>


<script>
import axios from 'axios';
export default {
  name: 'UserProfile',
  data() {
    return {
      userProfile: {},
    };
  },
  methods: {
    async fetchUserProfile() {
      const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000';
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjk5MzE4LCJpYXQiOjE3MTQyOTkyODgsImV4cCI6MTc1NzQ5OTI4OH0.J31KF96C-EnnIel6p9iX2K7k7ujggDRFvxrephRRK-k';
      const response = await axios.get(`${apiUrl}/api/oauth/find-one`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.userProfile = response.data;
    },
    stockManagementBtn() {
      this.$router.push('/manage-goods');
    }
  },
  created() {
    this.fetchUserProfile();
  },
};
</script>
<style scoped>
.user-profile {
  padding: 20px;
}

.profile-info {
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-image {
  margin-right: 20px;
}

.profile-image img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
}

.profile-details {
  font-size: 16px;
}
.profile-details p {
  padding: 5px; box-sizing: border-box;
}
</style>