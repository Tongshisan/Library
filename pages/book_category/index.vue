<template>
  <div class="book_category">
    <el-row class="book_category_menu">
      <el-col :span="4">
        <h5>图书分类</h5>
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="index" v-for="(item, index) in menuList" :key="index">
            <span slot="title">{{item}}</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: ["1", "2", "32"]
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
};
</script>
