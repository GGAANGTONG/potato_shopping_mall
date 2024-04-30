<template>
  <div class="modal" v-if="isOpen">
    <div class="modal-content">
      <span class="close" @click="closeModal">&times;</span>
      <div v-html="message"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['message', 'isOpen'],
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal {
  display: flex;
  position: fixed;
  z-index: 999;
  min-width: 230px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: auto;
  font-size: 12px;
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
