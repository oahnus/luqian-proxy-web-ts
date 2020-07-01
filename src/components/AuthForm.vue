<style scoped lang="less">
  .AuthForm {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-top: 40%;
    padding: 0 15%;

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
  }
</style>

<style lang="less">
  .AuthForm {
    .el-input-group__append {
      padding: 0!important;
    }
  }
</style>
<template>
  <div class="AuthForm">
    <div class="header">
      <div>{{isLogin ? '登  录' : '注  册'}}</div>
    </div>
    <div class="form">
      <div v-if="isLogin">
        <el-form ref="loginForm" :model="form" :rules="loginRules">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="密码" @keyup.enter.native="onSubmit" type="password"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div v-else>
        <el-form ref="registerForm" :model="form" :rules="registerRules">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="密码" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="password2">
            <el-input v-model="form.password2" placeholder="确认密码" type="password"></el-input>
          </el-form-item>
          <el-form-item prop="catpcha">
            <el-input placeholder="验证码" v-model="form.captcha" @keyup.enter.native="onSubmit">
              <template slot="append" style="padding: 0;">
                <img :src="captchaUrl" @click="refreshCaptcha" alt="captcha" style="height: 35px;">
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="btn-con">
      <el-button size="medium"
                 class="main-btn"
                 @click="onSubmit"
                 type="primary">{{isLogin ? '登 录' : '注 册'}}</el-button>

      <div class="extra-btn">
        <el-button v-if="isLogin"
                   type="text"
                   class="gray"
                   @click="showRegister">注册</el-button>
        <el-button v-else
                   type="text"
                   class="gray"
                   @click="showLogin">已有账号, 去登录</el-button>

        <el-button type="text" class="gray"></el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * AuthForm
   */
  import {Component, Vue, Prop} from "vue-property-decorator"

  import {AuthFormObj} from '@/types/common'
  import {Form} from 'element-ui'

  @Component
  export default class AuthForm extends Vue {
    @Prop({required: true}) form: AuthFormObj
    private isLogin: boolean = true;
    private ticket: string = ''
    private captchaUrl: string = ''

    private validatePassword2 = (rule: any, value: string, callback: Function): void => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    }

    private loginRules: any = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 6, message: '长度在6个字符以上', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '长度在6个字符以上', trigger: 'blur' }
      ],
    }

    private registerRules: any = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 6, message: '长度在6个字符以上', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '长度在6个字符以上', trigger: 'blur' }
      ],
      password2: [
        { validator: this.validatePassword2, trigger: 'blur' }
      ],
      captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
      ],
    }

    init(): void {
      this.isLogin = true
      // @ts-ignore
      this.$refs.LoginForm.clearValidate()
      this.getTicket()
    }

    public checkUsername(): void {
      this.$http.get(this.$urls.checkUsername, {params: {username: this.form.username}})
        .then((res: boolean) => {
          if (res) {
            // 提示用户名已存在
          }
        })
    }

    private getTicket(): void {
      this.$http.get(this.$urls.captchaTicket).then((ticket: string) => {
        this.ticket = ticket
        this.form.ticket = ticket
        let t = new Date().getTime()
        this.captchaUrl = `/api${this.$urls.captchaImgUrl}?ticket=${this.ticket}&t=${t}`
      })
    }
    updated(): void {
      if (this.isLogin) {
        // @ts-ignore
        let loginForm: Form = this.$refs.loginForm
        if (loginForm) {
          loginForm.clearValidate()
        }
      } else {
        // @ts-ignore
        let registerForm: Form = this.$refs.registerForm
        if (registerForm) {
          registerForm.clearValidate()
        }
      }
    }

    public showRegister(): void {
      this.getTicket()
      this.isLogin = false
    }
    public showLogin(): void {
      this.isLogin = true
    }

    public refreshCaptcha(): void {
      this.getTicket()
    }

    public onSubmit(): void {
      let that = this
      if (this.isLogin) {
        // @ts-ignore
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            that.$emit('login', that.form)
          } else {

          }
        });
      } else {
        // @ts-ignore
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            that.$emit("register", that.form)
          }
        });
      }
    }
  }
</script>
