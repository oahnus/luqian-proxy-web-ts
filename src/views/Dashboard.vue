<style scoped lang="less">
  .dashboard {
    margin: 10px;
    width: 100%;
    padding: 20px;
    .stat-label {
      font-size: 18px;
      color: #999999;
    }
    .stat-chart {
      margin-right: 20px;
      min-height: 300px;
    }
    .main-con {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .left {
        display: flex;
        max-width: 50%;
        flex: 1;
        margin-right: 5px;
        flex-direction: column;

        .today-stat {
          display: flex;
          margin: 30px 0 0 20px;
          flex-direction: column;
          font-size: 18px;
          div {
            line-height: 30px;
            margin: 5px 0;
            span {
              margin-right: 10px;
            }
          }

          height: 200px;
        }
        .bottom {
          display: flex;
          justify-content: flex-end;
        }
      }
      .right {
        display: flex;
        max-width: 50%;
        margin-left: 5px;
        flex: 1;
        flex-direction: column;

        .progress-con {
          margin-top: 10px;
          display: flex;
          justify-content: center;
        }
        .right-info {
          display: flex;
          flex-direction: column;
          justify-content: center;
          div {
            text-align: center;
            .info-label {
            }
            .info-value {}
          }
        }
      }
    }
  }
</style>
<template>
  <div class="dashboard">
    <div class="stat-label">流量走势 单位：({{statData.statUnit}})</div>
    <div class="stat-chart">
      <v-chart :forceFit="true" :height="height" :data="chartData" :scale="scale">
        <v-tooltip :crosshairs="crosshairs"></v-tooltip>
        <v-axis dataKey="date" :label="label"></v-axis>
        <v-line position="date*bytes" color='type'></v-line>
        <v-point position="date*bytes" color='type' size='4' shape='circle' :style="style"></v-point>
      </v-chart>
    </div>
    <div class="main-con">
      <el-card class="left">
        <div class="stat-label">今日数据</div>

        <div class="today-stat">
          <div>
            <span>入站流量: </span>{{statData.todayInBytes | byteFormatter}}
          </div>
          <div>
            <span>出站流量: </span>{{statData.todayOutBytes | byteFormatter}}
          </div>
          <div>
            <span>连接数: </span>{{statData.todayConCount || 0}}</div>
        </div>

        <div class="bottom">
          <el-button size="middle" @click="signIn" :disabled="isSigned">{{isSigned ? '已签到' : '签到'}}</el-button>
        </div>
      </el-card>
      <el-card class="right">
        <div class="stat-label">已用额度</div>
        <div class="progress-con">
          <el-progress type="dashboard"
                       :stroke-width="16"
                       :width="250"
                       stroke-linecap="round"
                       :percentage="percentage"
                       :color="colors"></el-progress>
        </div>
        <div class="right-info">
          <div>
            <span class="info-label">已用流量: </span>
            <span class="info-value">{{statData.usedTraffic | byteFormatter}}</span>
          </div>
          <div>
            <span class="info-label">总流量: </span>
            <span class="info-value">{{statData.trafficLimit | byteFormatter}}</span>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import {
    Getter,
    Mutation,
    namespace,
  } from 'vuex-class';
  const Auth = namespace('AuthModule');

  import {StatItem, Statistics} from '@/types/domain'
  import DataSet from '@antv/data-set'
  import {User} from '@/types/domain'

  const ONE_KB = 1024;
  const ONE_MB = ONE_KB * 1024;
  const ONE_GB = ONE_MB * 1024;
  const ONE_DAY = 60 * 60 * 24;

  const byteFormatter = function (bytesNum: number): string {
    if (bytesNum < ONE_KB) {
      return bytesNum + 'B'
    } else if (bytesNum < ONE_MB) {
      return (bytesNum / ONE_KB).toFixed(2) + 'KB'
    } else if (bytesNum < ONE_GB) {
      return (bytesNum / ONE_MB).toFixed(2) + 'MB'
    } else {
      return (bytesNum / ONE_GB).toFixed(2) + 'GB'
    }
  }

  @Component({
    filters: {
      byteFormatter: byteFormatter
    }
  })
  export default class HelloWorld extends Vue {
    @Auth.Getter('userInfo') userInfo: User;

    percentage: number = 0
    colors: any[] = [
      {color: '#f56c6c', percentage: 20},
      {color: '#e6a23c', percentage: 40},
      {color: '#5cb87a', percentage: 60},
      {color: '#1989fa', percentage: 80},
      {color: '#6f7ad3', percentage: 100}
    ]
    scale: any[] = [{
      dataKey: 'date',
    }];
    crosshairs: any = {
      type: 'line'
    };
    label: any = {
      formatter (val: any) {
        return val + '';
      }
    };
    style: any = {
      stroke: '#fff',
      lineWidth: 1
    };
    width: number = 600
    height: number = 300

    statData: Statistics = {
      statUnit: 'B',
      dateStats: [],
      todayInBytes: 0,
      todayConCount: 0,
      todayOutBytes: 0,
      trafficLimit: 0,
      usedTraffic: 0
    }
    chartData:any = []

    isSigned: boolean = false

    created() :void {
      this.checkData()
      this.fetchData()
    }

    async signIn(): Promise<void> {
      let needSetCookie = false
      try {
        let rewards = await this.$http.get(this.$urls.signIn);
        this.isSigned = true
        needSetCookie = true
        this.$notify.success(`签到成功, 获得${byteFormatter(rewards)}流量额度`)
      } catch (e) {
        console.error(e.message)
        if (e.message.includes('已签到')) {
          this.isSigned = true
          needSetCookie = true
        }
      } finally {
        if (needSetCookie) {
          let now = new Date()
          let usedTime = (now.getHours() * 60 + now.getMinutes()) * 60 + now.getSeconds();
          let expires = ONE_DAY - usedTime
          let userId = this.userInfo.id
          this.$cookies.set('isSigned' + userId, true, {expires: expires})
        }
      }
    }
    checkData(): void {
      let userId = this.userInfo.id
      let signed = this.$cookies.get('isSigned' + userId);
      this.isSigned = !!signed
    }
    draw(data: Statistics) {
      let {trafficLimit=0, usedTraffic=0} = data
      this.percentage = trafficLimit == 0 ? 0 : parseFloat(((usedTraffic / trafficLimit) * 100).toFixed(2));

      const dv = new DataSet.View().source(data.dateStats);
      dv.transform({
        type: 'fold',
        fields: ['inBytes', 'outBytes'],
        key: 'type',
        value: 'bytes',
      });
      this.chartData = dv.rows
    }
    async fetchData(): Promise<void> {
      let data: Statistics = await this.$http.get(this.$urls.getMeasureReport)
      if (data) {
        this.statData = data
        this.draw(data)
      }
    }
  }
</script>
