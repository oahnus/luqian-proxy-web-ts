<style scoped lang="less">
  .ProxyTable {
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
  <div class="ProxyTable">
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
          {{ scope.$index + 1}}
        </template>
        </el-table-column>
        <el-table-column
                label="应用Id"
                header-align="center"
                align="left"
                prop="appId"
        ></el-table-column>
        <el-table-column
                label="服务地址"
                header-align="center"
                align="left"
                prop="serviceAddr"
        ></el-table-column>
        <el-table-column
                label="对外端口"
                width="130"
                align="center"
                prop="port">
          <template slot-scope="scope">
            <div v-if="scope.row.isUseDomain">
              -
            </div>
            <div v-else>
              {{ scope.row.port }} {{scope.row.isRandom ? '(随机)' : '(固定)'}}
            </div>
          </template>
        </el-table-column>
        <el-table-column
                label="域名"
                header-align="center"
                align="left"
                prop="port">
          <template slot-scope="scope">
            <div v-if="scope.row.isUseDomain">
              {{scope.row.domain || '-'}}
            </div>
            <div v-else>
              -
            </div>
          </template>
        </el-table-column>
        <el-table-column
                label="Https"
                align="center"
                width="80px"
                prop="port">
          <template slot-scope="scope">
            <div v-if="scope.row.isUseDomain">
              {{scope.row.isHttps ? '支持' : '不支持'}}
            </div>
            <div v-else>
              -
            </div>
          </template>
        </el-table-column>
        <el-table-column
                label="状态"
                align="center"
                width="80px"
                prop="">
          <template slot-scope="scope">
            {{scope.row.active ? '运行中' : '未运行'}}
          </template>
        </el-table-column>
        <el-table-column
                label="是否可用"
                align="center"
                width="80px"
                prop="">
          <template slot-scope="scope">
            {{scope.row.enable ? '可用' : '禁用'}}

<!--            <el-switch active-text="启用"-->
<!--                       inactive-text="停用"-->
<!--                       @change="handleStatusChange"-->
<!--                       v-model="scope.row.enable"-->
<!--            ></el-switch>-->
          </template>
        </el-table-column>
        <el-table-column
                label="创建时间"
                align="center"
                show-overflow-tooltip
                prop="createTime"
        ></el-table-column>
        <el-table-column
                prop=""
                align="center"
                min-width="100"
                label="操作"
        ><template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEditRow(scope.row)">修改</el-button>
          <el-button type="danger" size="mini" @click="handleDelRow(scope.row)">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
    </div>

    <proxy-table-dialog ref="proxyDialog" @success="handleDlgSuccess"></proxy-table-dialog>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * AppTable
   */
  import {Component, Vue, Prop} from "vue-property-decorator"

  import {ProxyTable} from '@/types/domain'

  // @ts-ignore
  import ProxyTableDialog from '@/views/ProxyTable/components/ProxyTableDialog.vue';

  @Component({
    components: {
      ProxyTableDialog
    }
  })
  export default class ProxyTablePage extends Vue {
    private dataList: ProxyTable[] = [];
    private selectIds: number[] = [];

    private handleSelectionChange(selection: ProxyTable[]): void {
      this.selectIds = selection.map(p => p.id)
    }
    private handleDlgSuccess(): void {
      this.fetchData()
    }
    private handleStatusChange(row: ProxyTable): void {

    }
    private handleEditRow(row: ProxyTable): void {
      let proxyDlg: ProxyTableDialog = this.$refs.proxyDialog
      proxyDlg.open(row)
    }
    public async handleDelRow(row: ProxyTable): Promise<void> {
      await this.$confirm('此操作将删除当前选中数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      await this.$http.get(this.$urls.delProxyTable, {params: {id: row.id}})
      this.$notify.success('删除成功')
      this.fetchData()
    }
    public async handleAdd(): Promise<void> {
      let proxyDlg: any = this.$refs.proxyDialog
      proxyDlg.open(null)
    }

    public created(): void {
      this.fetchData()
    }

    private async fetchData(): Promise<void> {
      let data = await this.$http.get(this.$urls.getProxyTableList)
      this.dataList = data || []
    }
  }
</script>
