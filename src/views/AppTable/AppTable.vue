<style scoped lang="less">
  .AppTable {
    width: 100%;
    margin: 10px;
    overflow-x: hidden;
  }
  .query-con {
    .btn-con {
      display: flex;
      justify-content: flex-end;
    }
    margin-bottom: 10px;
  }
  .data-con {

  }
</style>

<template>
  <div class="AppTable">
    <div class="query-con">
      <div class="btn-con">
        <el-button type="success" size="small" @click="handleAdd">添加</el-button>
      </div>
    </div>
    <div class="data-con">
      <el-table border
                :data="dataList"
                style="width: 100%;"
                @selection-change="handleSelectionChange">
        <el-table-column
                type="selection"
                align="center"
                width="50">
        </el-table-column>
        <el-table-column
                prop=""
                label="#"
                align="center"
                width="60"
        ><template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
        </el-table-column>
        <el-table-column
                prop="name"
                label="应用名称"
                header-align="center"
        ></el-table-column>
        <el-table-column
                prop="appId"
                label="应用id"
                header-align="center"
        ></el-table-column>
        <el-table-column
                prop="appSecret"
                label="应用密钥"
                header-align="center"
        ></el-table-column>
        <el-table-column
                prop=""
                align="center"
                width="120"
                label="操作"
        ><template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditRow(scope.row)">修改</el-button>
<!--          <el-button type="danger" size="mini" @click="handleDelRow(scope.row)">删除</el-button>-->
        </template>
        </el-table-column>
      </el-table>
    </div>

    <app-table-dialog ref="appTableDialog"></app-table-dialog>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * AppTable
   */
  import {Component, Vue, Prop} from "vue-property-decorator"
  import {AppTable} from '@/types/domain'

  // @ts-ignore
  import AppTableDialog from '@/views/AppTable/components/AppTableDialog.vue'

  import {
    Getter,
    Mutation,
    namespace,
  } from 'vuex-class';

  const AppModule = namespace('AppTableModule');

  @Component({
    components: {
      AppTableDialog
    }
  })
  export default class AppTablePage extends Vue {
    @AppModule.Mutation('setAppList') private setAppTableList: Function;

    private dataList: AppTable[] = [];
    private selectIds: number[] = [];

    public handleSelectionChange(selection: AppTable[]): void {
      this.selectIds = selection.map(app => app.id)
    }
    public handleEditRow(row: AppTable): void {
      let appTableDlg: AppTableDialog = this.$refs.appTableDialog
      appTableDlg.open(row)
    }
    public async handleDelRow(row: AppTable): Promise<void> {
      await this.$confirm('此操作将删除当前选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      console.log(row)
      // TODO 删除
    }
    public async handleAdd(): Promise<void> {
      let data = await this.$http.get(this.$urls.genAppSecret)
      console.log(data)
      if (data) {
        let appTable: AppTable = data
        this.dataList.push(appTable)
      }
    }

    public created(): void {
      this.fetchData()
    }

    private async fetchData(): Promise<void> {
      let data: AppTable[] = await this.$http.get(this.$urls.getAppList)
      this.dataList = data || []
      this.setAppTableList(data)
    }
  }
</script>
