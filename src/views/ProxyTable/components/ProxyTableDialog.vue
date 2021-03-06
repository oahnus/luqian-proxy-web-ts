<style scoped lang="less">
  .ProxyTableDialog {
    .full-size {
      width: 100%;
    }
  }
</style>

<template>
  <div class="ProxyTableDialog">
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
      width="450px"
      :modal-append-to-body="false">

      <el-form ref="form" label-width="100px">
        <el-form-item label="名称">
          <el-input v-model="form.name" class="full-size"></el-input>
        </el-form-item>
        <el-form-item label="所属应用">
          <el-select v-model="form.appId" placeholder="请选择关联应用" class="full-size" :value="form.appId">
            <el-option
              v-for="(item, index) in appList"
              :key="index"
              :label="item.name"
              :value="item.appId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务地址">
          <el-input v-model="form.serviceAddr"
                    class="full-size"
                    placeholder="格式: ip地址:端口"></el-input>
        </el-form-item>
        <el-form-item label="是否使用域名">
          <el-switch active-text="使用"
                     inactive-text="不使用"
                     @change="onIsUseDomainChange"
                     v-model="form.isUseDomain"
          ></el-switch>
        </el-form-item>
        <el-form-item label="是否支持https" v-if="form.isUseDomain">
          <el-switch active-text="使用"
                     inactive-text="不使用"
                     v-model="form.isHttps"
          ></el-switch>
        </el-form-item>

        <el-form-item label="对外端口" v-if="!form.isUseDomain">
          <el-input-number v-model="form.port"
                           class="full-size"
                           placeholder="2000 - 20000"
                           :step="1"
                           :min="2000"
                           :max="20000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="端口规则" v-if="!form.isUseDomain">
          <el-switch active-text="随机端口"
                     inactive-text="固定端口"
                     v-model="form.isRandom"
          ></el-switch>
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch active-text="启用"
                     inactive-text="停用"
                     v-model="form.enable"
          ></el-switch>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  /**
   * Live Template 0.0.1
   * AppTableDialog
   */
  import {Component, Vue, Prop} from "vue-property-decorator"
  import {ProxyTable, AppTable} from '@/types/domain'
  import lang from '@/utils/lang'
  import {
    Getter,
    Mutation,
    namespace,
  } from 'vuex-class';

  const AppModule = namespace('AppTableModule');

  @Component
  export default class ProxyTableDialog extends Vue {
    @AppModule.Mutation('setAppList') private setAppList: Function;

    private dialogVisible: boolean = false;
    private form: ProxyTable | any = null;
    private isEdit: boolean = false;

    private appList: AppTable[] = []

    public created(): void {
      this.form = this.initForm()
      this.fetchAppList()
    }

    async fetchAppList(): Promise<void> {
      let data: AppTable[] = await this.$http.get(this.$urls.getAppList)
      this.appList = data || []
    }

    public open(row: ProxyTable | null): void {
      if (row && row.id) {
        this.form = {...row}
        this.isEdit = true
      } else {
        this.form = this.initForm()
        this.isEdit = false
      }
      this.dialogVisible = true
    }

    initForm(): ProxyTable {
      return {
        id: -1,
        name: '',
        appId: '',
        serviceAddr: '',
        isRandom: false,
        sysUserId: -1,
        enable: true,
        isUseDomain: false,
        isHttps: false,
        port: undefined,
        domainId: -1,
        domain: ''
      }
    }

    public async onIsUseDomainChange(): Promise<void> {
      if (this.form.isUseDomain) {
        // 查询可用域名数量
        let dataMap:{availableSize: number, httpsSize: number} = await this.$http.get(this.$urls.checkDomainSize)
        let availableSize = dataMap.availableSize || 0
        let httpsSize = dataMap.httpsSize || 0
        // 可用域名数
        if (availableSize === 0) {
          this.$notify.warning('可用域名数量为0')
          this.form.isUseDomain = false
          this.form.isHttps = false
          return;
        }
        // https域名数
        if (this.form.isHttps && httpsSize === 0) {
          this.$notify.warning('可用https域名数量为0')
          this.form.isHttps = false
          return;
        }
      }
    }

    async handleSubmit(): Promise<void> {
      console.log(this.form)

      let {appId, serviceAddr, port, isRandom, isUseDomain} = this.form
      if (lang.isEmpty(appId)) {
        this.$notify.warning('未绑定关联应用')
        return
      }
      if (lang.isEmpty(serviceAddr)) {
        this.$notify.warning('内网服务地址不能为空')
        return
      }
      if (!isRandom &&!isUseDomain && lang.isEmpty(port)) {
        this.$notify.warning('固定端口时，端口号不能为空')
        return
      }
      if (!/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}):(\d{1,5})$/.test(serviceAddr)) {
        this.$notify.warning('服务地址格式错误')
        return
      }
      if (this.isEdit) {
        await this.$http.post(this.$urls.updateProxyTable, this.form)
        this.$notify.success('修改成功')
      } else {
        await this.$http.post(this.$urls.addProxyTable, this.form)
        this.$notify.success('添加成功')
      }
      this.$emit('success')
      this.dialogVisible = false
    }
  }
</script>
