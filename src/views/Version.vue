<style scoped lang="less">
  .Version {
    display: flex;
    width: 100%;
    flex-direction: row;
    color: #333;

    .left {
      display: flex;
      flex-direction: column;
      width: 250px;
    }
    .right {
      display: flex;
      flex-direction: column;
      margin: 50px 100px 0 100px;
      .header {
        display: flex;
        justify-content: space-between;
        height: 50px;
        align-items: center;
        padding: 0 50px;

        .title {
          font-size: 22px;
        }
        .github {
          border: 1px solid #eee;
          padding: 6px 13px;
          border-radius: 5px;
          cursor: pointer;
        }
      }
      .list-con {
        margin-top: 20px;
        height: 70vh;
        overflow-y: auto;
        overflow-x: hidden;

        .ver-item {
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;

          .ver-head {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;

            .version-num {
              font-weight: 700;
              font-size: 24px;
            }
            .ver-head-r {
              display: flex;
              flex-direction: row;

              .date {
                margin-right: 10px;
                display: flex;
                align-items: center;
              }
              .download {
                display: flex;
                padding: 3px 8px;
                border: 1px solid #174afb;
                border-radius: 5px;
                color: #174afb;
                cursor: pointer;
              }
            }
          }
          .ver-content {
            .title {
              font-size: 18px;
              margin: 10px;
              font-weight: 700;
            }
            .content {
              margin: 5px 5px 5px 25px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
</style>

<template>
  <div class="Version">
    <div class="left">
      <side-bar v-if="isLoginGetter"></side-bar>
    </div>
    <div class="right">
      <div class="header">
        <div class="title">
          更新日志
        </div>
        <div class="github" @click="goGithub">
          Github
        </div>
      </div>
      <div class="list-con">
        <el-card class="ver-item" v-for="(item, idx) in versionList" :key="idx">
          <div slot="header" class="ver-head">
            <div class="version-num">{{item.version}}</div>
            <div class="ver-head-r">
              <div class="date">{{item.date}}</div>
              <div class="download" @click="downloadClient">下载</div>
            </div>
          </div>
          <div class="ver-content">
            <div class="add-con" v-if="item.addList">
              <div class="title">新增</div>
              <div class="content" v-for="(content, i) in item.addList" :key="i">
                ◆ {{content}}
              </div>
            </div>
            <div class="update-con" v-if="item.uptList">
              <div class="title">更新</div>
              <div class="content" v-for="(content, i) in item.uptList" :key="i">
                ◆ {{content}}
              </div>
            </div>
            <div class="delete-con" v-if="!!item.delList">
              <div class="title">移除</div>
              <div class="content" v-for="(content, i) in item.delList" :key="i">
                ◆ {{content}}
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  /**
   *
   * Live Template 0.0.1
   * Version
   */
  import {Component, Vue, Prop} from "vue-property-decorator"
  // @ts-ignore
  import SideBar from '@/components/SideBar'
  import {
    Getter,
    Mutation,
    namespace,
  } from 'vuex-class';

  const Auth = namespace('AuthModule');

  import {SysVersion, PageInfo} from '@/types/domain'
  import lang from '@/utils/lang'

  @Component({
    components: {
      SideBar
    }
  })
  export default class Version extends Vue {
    @Auth.Getter('isLogin') isLoginGetter:boolean;

    private versionList: SysVersion[] = []
    private pageNum: number = 0
    private pageSize: number = 5

    private total: number = 0
    private isLast: boolean = false

    created(): void {
      this.fetchData()
    }

    goGithub(): void {
      window.open('https://github.com/oahnus', '_blank')
    }

    downloadClient(item: SysVersion): void {
      if (lang.isEmpty(item.url)) {
        this.$notify.warning('客户端文件丢失')
        return;
      }
      window.open(item.url, '_blank')
    }

    static wrapVersionEntity(item: SysVersion): SysVersion {
      if (!item) {
        return item;
      }
      let {addJson, uptJson, delJson} = item
      if (lang.isNotEmpty(addJson)) {
        try {
          item.addList = JSON.parse(addJson)
        } catch (ignore) {}
      }
      if (lang.isNotEmpty(uptJson)) {
        try {
          item.uptList = JSON.parse(uptJson)
        } catch (ignore) {}
      }
      if (lang.isNotEmpty(delJson)) {
        try {
          item.delList = JSON.parse(delJson)
        } catch (ignore) {}
      }
      return item;
    }

    public async fetchData(): Promise<void> {
      let data: PageInfo<SysVersion> = await this.$http.get(this.$urls.versionList, {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      })

      let {total, list, isLastPage} = data
      this.isLast = isLastPage || false
      this.total = total || 0
      this.versionList = list.map(item => Version.wrapVersionEntity(item)) || []
    }
  }
</script>
