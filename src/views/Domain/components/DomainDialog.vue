<style scoped>
  .DomainDialog {
  }
</style>

<template>
  <div class="DomainDialog">
    <el-dialog
      :title="isEdit ? '编辑' : '新增'"
      :visible.sync="dialogVisible"
      width="450px"
      :modal-append-to-body="false">

      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="域名名称">
          <el-input v-model="form.name" width="100%"></el-input>
        </el-form-item>
        <el-form-item label="域名地址" required>
          <el-input v-model="form.domain" width="100%"></el-input>
        </el-form-item>
        <el-form-item label="https支持" required>
          <el-select v-model="form.https" placeholder="请选择" value="">
            <el-option label="是" :value="true"></el-option>
            <el-option label="否" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="绑定端口">
          <el-input-number :controls="false"
                           v-model="form.port"
                           :min="30001"
                           :max="31000"
                           width="100%"></el-input-number>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * DomainDialog
   */
  import {Component, Vue, Prop} from "vue-property-decorator"
  import {SysDomain} from "@/types/domain"

  @Component
  export default class DomainDialog extends Vue {
    private dialogVisible: boolean = false
    private isEdit: boolean = false
    private form: SysDomain = this.initForm()

    public open(form: SysDomain): void {
      if (form) {
        this.form = {...form}
        this.isEdit = true
      } else {
        this.initForm()
        this.isEdit = false
      }
      this.dialogVisible = true
    }

    public close(): void {
      this.dialogVisible = false
    }

    private async onSubmit(): Promise<void> {
      // check
      // TODO 检查form表单

      if (this.isEdit) {
        await this.$http.post(this.$urls.updateDomain, this.form)
      } else {
        await this.$http.post(this.$urls.createDomain, this.form)
      }
      this.close()
      this.$emit('success')
    }

    private initForm(): SysDomain {
      return {
        id: undefined,
        domain: '',
        name: '',
        https: false,
        port: undefined
      }
    }
  }
</script>
