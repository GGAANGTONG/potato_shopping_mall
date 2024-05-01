<template>
  <div class="user-profile">
    <h1>유저 프로필</h1>
    <div class="profile-info">
      <div class="profile-image">
        <img
          v-if="userProfile && userProfile.data && userProfile.data.profile"
          :src="userProfile.data.profile"
          alt="프로필 사진"
        />
        <img v-else src="https://placehold.co/150" alt="프로필 사진" />
      </div>
      <div class="profile-details">
        <p>
          이름:
          <span
            v-if="userProfile && userProfile.data && userProfile.data.name"
            >{{ userProfile.data.name }}</span
          >
        </p>
        <p>
          닉네임:
          <span
            v-if="userProfile && userProfile.data && userProfile.data.nickname"
            >{{ userProfile.data.nickname }}</span
          >
        </p>
        <p v-if="userProfile.data && userProfile.data.email">
          이메일: {{ userProfile.data.email }}
        </p>
        <p v-if="userProfile.data && userProfile.data.points">
          포인트: {{ userProfile.data.points }} 포인트
        </p>
        <p v-if="userProfile.data && userProfile.data.grade">
          등급: {{ userProfile.data.grade }} 등급
        </p>
        <p v-if="userProfile.data && userProfile.data.address">
          주소:
          {{ userProfile.data.address }}
          {{ userProfile.data.detail_address }}
        </p>
        <button @click="stockManagementBtn">재고 관리 페이지</button>
      </div>
    </div>
  </div>
  <button
    class="blue"
    v-if="userProfile.data && userProfile.data.role == 1"
    @click="goToAdminPage"
  >
    관리자
  </button>
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
      try {
        let encodedToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('accessToken='))
          .split('=')[1];
        let token = decodeURIComponent(encodedToken);

        const response = await axios.get(
          `${process.env.VUE_APP_API_URL}/api/oauth/find-one`,
          {
            headers: {
              Authorization: `${token}`, 
            },
          },
        );
        this.userProfile = response.data;
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    },
    goToAdminPage() {
      this.$router.push('/admin');
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
  padding: 5px;
  box-sizing: border-box;
}
</style>
