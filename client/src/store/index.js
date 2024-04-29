import { createStore } from 'vuex';

export default createStore({
  state() {
    return {
      selectedCategory: null,
    };
  },
  mutations: {
    setSelectedCategory(state, category) {
      state.selectedCategory = category;
    },
  },
  getters: {
    getSelectedCategory: (state) => state.selectedCategory,
  },
});
