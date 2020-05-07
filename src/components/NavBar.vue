<style scoped lang="less">
  .NavBar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0 20px;
    border: 1px solid #e5e5e5;
  }
  .nav-l {

  }
  .nav-r {
    .nav-drop {
      display: flex;
      flex-direction: row;
      align-items: center;
      cursor: pointer;

      .username {
        margin-left: 10px;
      }
    }
  }
  .unLogin {
    display: flex;
    flex-direction: row;
  }
  .unLogin > div {
    margin: 0 5px;
    border: 1px solid #e5e5e5;
    border-radius: 5px;
    padding: 7px 13px;
    min-width: 60px;
    cursor: pointer;
  }
  .avatar {
    width: 40px;
    height: 40px;
    border: 2px solid #fff;
    border-radius: 50%;
    background: #e5e5e5;

    img {
      width: 30px;
      height: 30px;
    }
  }
  .login-form-con {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40%;
    padding: 0 15%;
  }
  .form {
    display: flex;
    flex-direction: column;
    width: 100%;

    .f-input {
      margin: 3px 0;
      width: 100%;
    }

    .err-msg {
      color: orangered;
      font-size: 14px;
      margin-left: 3px;
      height: 16px;
    }
  }
  .header {
    display: flex;
    justify-content: center;
    font-size: 25px;
    margin-bottom: 40px;
    font-weight: bold;
    letter-spacing: 5px;
  }
  .btn-con {
    display: flex;
    flex-direction: column;
    width: 100%;

    .main-btn{
      margin-top: 10px;
    }

    .extra-btn {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin: 0 10px 5px 10px;
      
      .gray {
        color: #999;
      }
    }
  }
</style>

<template>
  <div>
    <div class="NavBar">
      <div class="nav-l">
        Home
      </div>
      <div class="nav-r">
        <div class="unLogin" v-if="!isLoginGetter">
          <div @click="showLoginForm">Login</div>
        </div>
        <div class="inLogin" v-else>
          <el-dropdown @command="handleDropdownCmd">
            <div class="nav-drop">
              <div class="avatar">
                <img src="../assets/user.png" alt="user">
              </div>
              <div class="username">
                {{userInfoGetter.username}}
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="setting" disabled>设置</el-dropdown-item>
              <el-dropdown-item command="resetPass" disabled>修改密码</el-dropdown-item>
              <el-dropdown-item command="logout" divided>退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>

    <el-drawer
      title="Login"
      append-to-body
      :with-header="false"
      :visible.sync="showDrawer"
      direction="rtl">
      <div class="login-form-con">
        <div class="header">
          <div>{{hasAccount ? 'Login' : 'Register'}}</div>
        </div>
        <div class="form">
          <el-input v-model="loginForm.username"
                    class="f-input"
                    @focus="handleInputFocus"
                    placeholder="username"></el-input>
          <div class="err-msg">{{ !!usernameErr ? usernameErr : ''}}</div>
          <el-input v-model="loginForm.password"
                    placeholder="password"
                    class="f-input"
                    @focus="handleInputFocus"
                    type="password"></el-input>
          <div class="err-msg" v-if="!!passwordErr">{{!!passwordErr ? passwordErr : ''}}</div>
        </div>

        <div class="btn-con">
          <el-button size="medium"
                     v-if="hasAccount"
                     class="main-btn"
                     @click="submitLogin"
                     type="primary">登 录</el-button>
          <el-button size="medium"
                     v-else
                     class="main-btn"
                     @click="submitRegister"
                     type="primary">注 册</el-button>
          <div class="extra-btn">
            <el-button type="text" class="gray" @click="switchToRegister">注册</el-button>
            <el-button type="text" class="gray"></el-button>
          </div>

        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * NavBar
   */
  import {Component, Vue, Prop} from "vue-property-decorator"
  import {
    Getter,
    Mutation,
    namespace,
  } from 'vuex-class';

  import lang from '@/utils/lang'
  import {User} from '@/types/domain'

  const Auth = namespace('AuthModule');

  class LoginForm {
    public username: string
    public password: string
    public captcha?: string
  }

  @Component
  export default class NavBar extends Vue {
    @Auth.Getter('isLogin') isLoginGetter:boolean;
    @Auth.Getter('userInfo') userInfoGetter:User;
    @Auth.Mutation('setUserInfo') setUserInfo: Function;
    @Auth.Mutation('setIsLogin') setIsLogin: Function;

    showDrawer: boolean = false;
    hasAccount: boolean = true;

    usernameErr: string = '';
    passwordErr: string = '';

    loginForm:LoginForm = {
      username: 'ligoudan',
      password: '123456',
    }

    public created(): void {
      this.clearErrMsg()
      this.fetchUserInfo()
    }

    handleInputFocus(): void {
      this.clearErrMsg()
    }
    switchToRegister() {
      this.hasAccount = false
    }
    handleDropdownCmd(cmd: string): void {
      switch (cmd) {
        case 'logout':
          this.$http.get(this.$urls.logout)
          this.setIsLogin(false)
          this.setUserInfo({username: '', id: -1})
          this.$router.replace('/')
          break;
        case 'setting':
          break;
        case 'resetPass':
          break;
        default:
          console.warn('unknown command')
      }
    }

    public showLoginForm(): void {
      this.showDrawer = true
    }

    clearErrMsg(): void {
      this.usernameErr = '';
      this.passwordErr = '';
    }

    public async fetchUserInfo(): Promise<void> {
      let data = await this.$http.get(this.$urls.getUserInfo)
      console.log(data)

      if (data) {
        let user: User = data
        this.setUserInfo(user)
        this.setIsLogin(true)
        this.$router.replace('/dashboard')
      }
    }

    public async submitRegister(): Promise<void> {
      this.clearErrMsg()
      if (lang.isEmpty(this.loginForm.username)) {
        this.usernameErr = '用户名不能为空'
        return;
      }
      if (this.loginForm.username.length < 6) {
        this.usernameErr = '用户名不能小于6个字符'
        return;
      }
      if (lang.isEmpty(this.loginForm.password)) {
        this.passwordErr = '密码不能为空'
        return;
      }
      await this.$http.post(this.$urls.register, this.loginForm)

      this.sendLoginForm()
    }

    public async sendLoginForm(): Promise<void> {
      let formData = new FormData();
      formData.append('username', this.loginForm.username)
      formData.append('password', this.loginForm.password)
      const data = await this.$http.post(this.$urls.login, formData)
      if (data) {
        let user: User = data
        this.setIsLogin(true)
        this.setUserInfo(user)
        this.showDrawer = false
        this.$router.push('/dashboard')
      }
      console.log(data)
    }

    public async submitLogin(): Promise<void> {
      this.clearErrMsg()
      if (lang.isEmpty(this.loginForm.username)) {
        this.usernameErr = '用户名不能为空'
        return;
      }
      if (this.loginForm.username.length < 6) {
        this.usernameErr = '用户名不能小于6个字符'
        return;
      }
      if (lang.isEmpty(this.loginForm.password)) {
        this.passwordErr = '密码不能为空'
        return;
      }
      this.sendLoginForm()
    }
  }
</script>
