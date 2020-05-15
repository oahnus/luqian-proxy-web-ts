<style scoped lang="less">
  .AppTableDialog {

  }
</style>

<template>
  <div class="AppTableDialog">
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="30%"
      :modal-append-to-body="false">

      <el-form ref="form" label-width="80px">
        <el-form-item label="应用名称">
          <el-input v-model="form.name"></el-input>
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
   *
   * Live Template 0.0.1
   * AppTableDialog
   */
  import {Component, Vue, Prop} from "vue-property-decorator"
  import {AppTable} from '@/types/domain'
  @Component
  export default class AppTableDialog extends Vue {
    dialogVisible: boolean = false;
    form: AppTable | any = {name: ''};

    public open(row: AppTable): void {
      this.form = {...row}
      this.dialogVisible = true
    }

    public async handleSubmit(): Promise<void> {
      console.log(this.form)
    }
  }
</script>
