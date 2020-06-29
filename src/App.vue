<template>
  <div id="app">
    <nav-bar></nav-bar>
    <div class="main-container">
      <div class="left" v-if="$route.meta.showSideBar">
        <side-bar></side-bar>
      </div>
      <div class="right">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  // @ts-ignore
  import NavBar from '@/components/NavBar'
  // @ts-ignore
  import SideBar from '@/components/SideBar'
  import {Component, Vue, Prop} from "vue-property-decorator"

  import {
    Getter,
    Mutation,
    namespace,
  } from 'vuex-class';

  const Auth = namespace('AuthModule');

  @Component({
    components: {
      NavBar, SideBar,
    }
  })
  export default class App extends Vue {
    @Auth.Getter('isLogin') isLoginGetter:boolean;

    public created(): void {
      if (this.isLoginGetter) {
        this.$router.replace('/dashboard')
      } else {
        this.$router.replace('/')
      }
    }
  }
</script>

<style lang="less">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    padding: 0;
  }
  .main-container {
    display: flex;
    flex-direction: row;
    height: calc(100vh - 65px);
    .left {

    }
    .right {
      display: flex;
      flex: 1;
    }
  }
  body, html {
    padding: 0;
    margin: 0;
  }
</style>
