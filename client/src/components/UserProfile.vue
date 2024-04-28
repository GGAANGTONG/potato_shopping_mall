<template>
  <div id="UserProfile">
    <h1>유저 프로필</h1>
    <input v-model="UserProfile" placeholder="유저 프로필 정보">
    <li> {{ userProfile }} </li>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'UserProfile',
  data() {
    return {
      userProfile: {}
    }
  },
  methods: {
    async UserProfile() {
      const response = axios.get(`http://localhost:3000/api/find-one`)
      this.userProfile = response.data
    },
  created() {
    this.UserProfile()
  }
}
}
</script>