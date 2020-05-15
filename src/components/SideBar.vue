<style scoped lang="less">
  .SideBar {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    max-width: 250px;

    .side-menu {
      height: 100%;
    }
  }
  .show-side {
    width: 250px;
  }
</style>

<template>
  <div class="SideBar" :class="isCollapse ? '' : 'show-side'">
    <el-menu :default-active="activeIndex"
             class="side-menu"
             @open=""
             @close=""
             @select="handleMenuSelect"
             :collapse="isCollapse">
      <el-menu-item index="collapse">
        <i class="el-icon-menu"></i>
        <span slot="title" v-if="isCollapse">展开</span>
        <span slot="title" v-else>折叠</span>
      </el-menu-item>

<!--      <el-submenu index="1">-->
<!--        <template slot="title">-->
<!--          <i class="el-icon-location"></i>-->
<!--          <span slot="title">控制台</span>-->
<!--        </template>-->

<!--        <el-menu-item index="1-4-1">选项1</el-menu-item>-->
<!--        <el-menu-item index="1-4-2">选项2</el-menu-item>-->
<!--      </el-submenu>-->
      <el-menu-item index="dashboard">
        <i class="el-icon-s-marketing"></i>
        <span slot="title">控制台</span>
      </el-menu-item>
      <el-menu-item index="application">
        <i class="el-icon-key"></i>
        <span slot="title">应用管理</span>
      </el-menu-item>
      <el-menu-item index="proxy">
        <i class="el-icon-s-promotion"></i>
        <span slot="title">代理设置</span>
      </el-menu-item>
      <el-menu-item index="setting" disabled>
        <i class="el-icon-s-tools"></i>
        <span slot="title">设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * SideBar
   */
  import {Component, Vue, Prop} from "vue-property-decorator"

  @Component
  export default class SideBar extends Vue {
    isCollapse: boolean = false
    activeIndex: string = 'dashboard'

    created(): void {
      let {path} = this.$route
      switch (path) {
        case '/application':
          this.activeIndex = 'application'
          break
        case '/dashboard':
          this.activeIndex = 'dashboard'
          break
        case '/proxy':
          this.activeIndex = 'proxy'
          break
        default:
      }
    }

    public handleMenuSelect(index:string, indexPath:any): void {
      switch (index) {
        case 'collapse':
          this.isCollapse = !this.isCollapse
          break
        case 'application':
          this.$router.push('/application')
          break
        case 'dashboard':
          this.$router.push('/dashboard')
          break
        case 'proxy':
          this.$router.push('/proxy')
          break
        default:
      }
    }
  }
</script>
