<style scoped lang="less">
  .Welcome {
    .main-con {
      height: calc(100vh - 64px);
      overflow-y: hidden;

      .introduce {
        margin-top: 200px;
        margin-left: 200px;
        display: flex;
        flex-direction: column;

        .title {
          display: flex;
          flex-direction: row;

          .app-name {
            font-size: 50px;
            padding: 6px 13px;
          }
          .sub-title {
            font-size: 26px;
            padding-top: 26px;
            margin-left: 10px;
          }
        }
        .desc {
          margin-left: 10px;
          margin-top: 20px;
          font-size: 18px;
          color: #666;
        }
        .btn-con {
          margin-top: 50px;
          margin-left: 50px;
          .btn {
            width: 120px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="Welcome">
    <div class="main-con">
      <div class="introduce">
        <div class="title">
          <div class="app-name">
            O-Proxy
          </div>
          <div class="sub-title">
            简单内网代理
          </div>
        </div>
        <div class="desc">

        </div>
        <div class="btn-con">
          <el-button class="btn" type="primary" @click="goVersionPage">下载使用</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * Welcome
   */
  import {Component, Vue, Prop} from 'vue-property-decorator'

  @Component
  export default class WelcomePage extends Vue {
    goVersionPage(): void {
      this.$router.push('/version')
    }
  }
</script>
