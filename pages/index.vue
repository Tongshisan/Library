<template>
  <div class="container">
    <el-button @click="index()">。。。</el-button>
  </div>
</template>

<script>
import Vue from "vue";
import Logo from "~/components/Logo.vue";

export default {
  components: {
    Logo
  },
  mounted() {
    let vm = this;
    vm.init();
  },
  methods: {
    index() {
      let vm = this;
      vm.$router.push({ name: "login" });
    },
    async init() {
      let vm = this;
      let data;
      try {
        data = await Vue.axios({
          method: "post",
          url: "/api/user",
          data: {
            cmd: "CheckLogin",
            body: {}
          }
        });
      } catch (error) {
        console.log(error);
      }
      if(data.data.is_login) {
        vm.$message({
          message: '已登录',
          type: 'success'
        })
      } else {
        vm.$router.push({name: 'login'})
      }
    }
  }
};
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
