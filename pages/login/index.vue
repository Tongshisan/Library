<template>
  <div class="mod_login">
    <div class="mod_login_content">
      <div class="mod_login_content_body">
        <el-tabs v-model="activeTab" @tab-click="LoginOrReg">
          <el-tab-pane label="登录" name="Login"></el-tab-pane>
          <el-tab-pane label="注册" name="Reg"></el-tab-pane>
        </el-tabs>
        <div class="mod_login_body_login" v-show="selectLogin">
          <el-form :model="login" label-width="80px" :rules="rules">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="login.username" clearable></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="login.password" clearable show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitLogin()" :disabled="loginBtnDis">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="mod_login_body_reg" v-show="!selectLogin">
          <el-form label-width="80px" :model="reg" :rules="rules" ref="reg">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="reg.username" clearable ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="reg.password" clearable show-password></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkPsw">
              <el-input v-model="reg.checkPsw" clearable show-password></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="userReg()" :disabled="regBtnDis">注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    let validatePsw = (rule, value, callback) => {
      if (value !== this.reg.password) {
        callback(new Error("两次输入密码不一致!"));
      }
    };
    let validateRegUsername = (rule, value, callback) => {
      if(value.length < 6) {
        callback(new Error('请输入最少6位用户名'))
      }
    }
    return {
      activeTab: "Login",
      selectLogin: true,
      login: {
        username: "",
        password: ""
      },
      reg: {
        username: "",
        password: "",
        checkPsw: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          {
            validator: validateRegUsername,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ],
        checkPsw: [
          {
            required: true,
            message: "请再次输入密码",
            trigger: "blur"
          },
          {
            validator: validatePsw,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    async submitLogin() {
      let vm = this;
      console.log(vm.login.username);
      let loginRes
      try {
        loginRes = await Vue.axios({
          method: 'post',
          url: '/api/user',
          data: {
            cmd: 'UserLogin',
            body: {
              username: vm.login.username,
              password: vm.login.password
            }
          }
        })
      } catch (error) {
        console.log(error)
      }
      if(vm.checkCode(loginRes.data.code)) {
        vm.$message({
          message: '登录成功',
          type: 'success'
        })
        vm.$router.push({name: 'book_info'})
      }
    },
    changeLogin() {
      let vm = this;
      vm.selectLogin = true;
    },
    changeReg() {
      let vm = this;
      vm.selectLogin = false;
    },
    LoginOrReg(tab, event) {
      let vm = this;
      if (tab.name === "Login") {
        vm.selectLogin = true;
      } else {
        vm.selectLogin = false;
      }
    },
    // 注册
    async userReg() {
      let vm = this;
      // 首先检测要注册的用户名是否已被注册
      let checkUserData;
      try {
        checkUserData = await Vue.axios({
          method: "post",
          url: "/api/user",
          data: {
            cmd: "CheckUser",
            body: {
              username: vm.reg.username
            }
          }
        });
      } catch (error) {
        console.log(error);
      }
      if (vm.checkCode(checkUserData.data.code)) {
        // 用户可以注册
        let userRegData;
        try {
          userRegData = await Vue.axios({
            method: "post",
            url: "/api/user",
            request_id: 12345,
            data: {
              cmd: "UserReg",
              body: {
                username: vm.reg.username,
                password: vm.reg.password
              }
            }
          });
        } catch (error) {
          console.log(error);
        }
        if(vm.checkCode(userRegData.data.code)) {
          vm.$message({
            message: '注册成功',
            type: 'success'
          })
          vm.login.username = vm.reg.username
          vm.reg.username = ''
          vm.reg.password = ''
          vm.reg.checkPsw = ''
          vm.activeTab = 'Login'
          vm.selectLogin = true;
        }
      }
    },
    // 检查返回code
    checkCode(code) {
      let vm = this
      if(code ===0) {
        return true
      } else if(code === 1) {
        console.log('用户名已存在')
        vm.$message.error('用户名已存在')
      } else if(code === 2) {
        vm.$message.error('用户名不存在')
      } else if(code === 3) {
        vm.$message.error('用户名或密码错误')
      }
    }

  },
  computed: {
    regBtnDis: function() {
      let vm = this;
      if (
        vm.reg.username === "" ||
        vm.reg.username === undefined ||
        vm.reg.password === "" ||
        vm.reg.password === undefined ||
        vm.reg.checkPsw === "" ||
        vm.reg.checkPsw === undefined ||
        vm.reg.password !== vm.reg.checkPsw
      ) {
        return true;
      } else {
        return false;
      }
    },
    loginBtnDis: function() {
      let vm = this;
      if (
        vm.login.username === "" ||
        vm.login.username === undefined ||
        vm.login.password === "" ||
        vm.login.password === undefined
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>