require("dotenv").config();
 

const { defineConfig } = require('@vue/cli-service');
console.log(11,process.env.VUE_APP_API_URL)
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: process.env.VUE_APP_API_URL,
        changeOrigin: true,
      },
    },
  },
});
