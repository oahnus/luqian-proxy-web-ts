<style scoped lang="less">
  .AppTable {
    /*width: 100%;*/
    margin: 10px;
    overflow-x: hidden;
  }
</style>

<template>
  <div class="AppTable">
    <el-table border :data="dataList">
      <el-table-column
              prop="date"
              label="日期"
              width="180">
      </el-table-column>
      <el-table-column
              prop="name"
              label="姓名"
              width="180">
      </el-table-column>
      <el-table-column
              prop="address"
              label="地址">
      </el-table-column>
    </el-table>

  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * AppTable
   */
  import {Component, Vue, Prop} from "vue-property-decorator"

  @Component
  export default class AppTable extends Vue {
    private dataList: Array<any> = [];

    public created(): void {
      this.fetchData()
    }

    private async fetchData(): Promise<void> {
      let data = await this.$http.get(this.$urls.getAppList)
      console.log(data)
    }
  }
</script>
