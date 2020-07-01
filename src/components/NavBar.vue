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
    width: 228px;
    border-right: 1px solid #e5e5e5;
    line-height: 50px;
    font-size: 24px;
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
    div {
      display: flex;
      justify-content: center;
    }
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
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 30px;
      height: 30px;
    }
  }
</style>

<template>
  <div>
    <div class="NavBar">
      <div class="nav-l">
        O-Proxy
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
                {{userInfo.username}}
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
      size="450px"
      :with-header="false"
      :visible.sync="showDrawer"
      direction="rtl">
      <auth-form :form="authForm" ref="authForm" @login="submitLogin" @register="submitRegister"></auth-form>
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
    namespace,
  } from 'vuex-class';

  import lang from '@/utils/lang'
  import {User} from '@/types/domain'
  import {AuthFormObj} from '@/types/common'
  // @ts-ignore
  import AuthForm from './AuthForm.vue'

  const Auth = namespace('AuthModule');

  @Component({
    components: {
      AuthForm
    }
  })
  export default class NavBar extends Vue {
    @Auth.Mutation('setUserInfo') setUserInfo: Function;
    @Auth.Mutation('setIsLogin') setIsLogin: Function;
    @Auth.State('inLogin') isLogin: boolean;
    @Auth.State('user') userInfo: User;

    showDrawer: boolean = false;

    authForm: AuthFormObj = {
      username: '',
      password: '',
    }

    get isLoginGetter(): boolean {
      return this.$store.state.AuthModule.inLogin;
    }

    public created(): void {
      this.fetchUserInfo()
    }

    handleDropdownCmd(cmd: string): void {
      switch (cmd) {
        case 'logout':
          this.$http.get(this.$urls.logout)
          this.setIsLogin(false)
          this.setUserInfo(null)
          this.$cookies.remove('token')
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
      this.authForm = { username: '', password: '' }
      let authFormElem: AuthForm = this.$refs.authForm
      if (authFormElem) {
        authFormElem.init()
      }
    }

    public async fetchUserInfo(): Promise<void> {
      let data = await this.$http.get(this.$urls.getUserInfo)

      if (data) {
        let user: User = data
        this.setUserInfo(user)

        let {path} = this.$route
        if (path === '/' || path === '') {
          this.$router.replace('/dashboard')
        }
      }
    }

    public async submitRegister(): Promise<void> {
      try {
        await this.$http.post(this.$urls.register, this.authForm)
      } catch (e) {
        let authFormElem: AuthForm = this.$refs.authForm
        if (authFormElem) {
          authFormElem.refreshCaptcha()
        }
        return
      }
      this.sendLoginForm()
    }

    public async sendLoginForm(): Promise<void> {
      let formData = new FormData();
      formData.append('username', this.authForm.username)
      formData.append('password', this.authForm.password)
      try {
        const token = await this.$http.post(this.$urls.login, formData)
        if (token) {
          this.showDrawer = false
          this.$cookies.set('token', token)
          this.fetchUserInfo()
        }
      } catch (e) {
        console.log('%c[NavBar-sendLoginForm]', 'color: #63ADD1', e.response)

      }
    }

    public submitLogin(): void {
      this.sendLoginForm()
    }
  }
</script>
