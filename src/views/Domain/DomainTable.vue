<style scoped lang="less">
  .DomainTable {
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
  <div class="DomainTable">
    <div class="query-con">
      <div class="btn-con">
        <el-button v-if="hasCreatePerm" type="success" size="small" @click="handleAdd">添加</el-button>
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

        <el-table-column prop="name"
                         label="名称"
                         header-align="center"
        ></el-table-column>
        <el-table-column prop="domain"
                         header-align="center"
                         label="域名"
        ></el-table-column>
        <el-table-column prop=""
                         align="center"
                         label="https">
          <template slot-scope="scope">
            {{ scope.row.https ? "支持" : "不支持" || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="port"
                         align="center"
                         label="绑定端口"
                         width="100"
        ></el-table-column>
        <el-table-column prop=""
                         align="center"
                         label="运行状态">
          <template slot-scope="scope">
            <div>
              {{ scope.row.isActive ? '使用中' : '未使用' || '-' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop=""
                         min-width="80"
                         align="center"
                         label="启用状态">
          <template slot-scope="scope">
            <div v-if="hasUpdatePerm">
              <el-switch v-model="scope.row.enable"
                         :active-value="true"
                         active-text="启用"
                         inactive-text="禁用"
                         @change="onDomainEnableChange(scope.row.id, arguments[0])"
                         :inactive-value="false"></el-switch>
            </div>
            <div v-else>
              {{ scope.row.enable ? '启用' : '禁用' || '-' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
                prop=""
                align="center"
                label="操作"
        ><template slot-scope="scope">
          <el-button v-if="hasUpdatePerm"
                     type="primary"
                     size="mini"
                     @click="handleEditRow(scope.row)">修改</el-button>
        </template>
        </el-table-column>
      </el-table>
    </div>

    <domain-dialog ref="domainDialog" @success="handleDlgSuccess"></domain-dialog>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * AppTable
   */
  import {Component, Vue, Prop} from "vue-property-decorator"
  import {
    namespace,
  } from 'vuex-class';
  const Auth = namespace('AuthModule');
  import {SysDomain, User} from '@/types/domain'

  // @ts-ignore
  import DomainDialog from '@/views/Domain/components/DomainDialog.vue';

  @Component({
    components: {
      DomainDialog
    }
  })
  export default class ProxyTablePage extends Vue {
    @Auth.State('user') userInfo: User;

    private dataList: SysDomain[] = [];
    private selectIds: number[] = [];

    get hasCreatePerm(): boolean {
      let permList = this.userInfo.permissionList;
      if (permList) {
        return permList.findIndex(perm => perm.value === 'addDomain') !== -1
      }
      return false;
    }

    /**
     * 域名修改权限
     */
    get hasUpdatePerm(): boolean {
      let permList = this.userInfo.permissionList;
      if (permList) {
        return permList.findIndex(perm => perm.value === 'updateDomain') !== -1
      }
      return false;
    }

    async onDomainEnableChange(id: number, val: boolean): Promise<void> {
      let self = this
      this.$http.post(this.$urls.changeDomainStatus, null, {params: {enable: val, id: id}})
        .then(() => {
          self.$notify.success('修改成功')
        })
        .catch((err: any) => {
          let dataItem: SysDomain | undefined = self.dataList.find(item => item.id === id)
          if (dataItem) {
            dataItem.enable = !val
          }
        })
    }
    handleSelectionChange(selection: SysDomain[]): void {
      this.selectIds = selection.map(p => p.id)
    }
    handleDlgSuccess(): void {
      this.fetchData()
    }
    handleEditRow(row: SysDomain): void {
      let domainDialog: any = this.$refs.domainDialog
      domainDialog.open(row)
    }
    async handleAdd(): Promise<void> {
      let domainDialog: any = this.$refs.domainDialog
      domainDialog.open(null)
    }

    public created(): void {
      this.fetchData()
    }

    private async fetchData(): Promise<void> {
      let data:SysDomain[] = await this.$http.get(this.$urls.getDomainList)
      this.dataList = data || []
    }
  }
</script>
