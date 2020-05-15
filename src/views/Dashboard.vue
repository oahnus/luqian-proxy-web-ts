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
    }
    .main-con {

    }
  }
</style>
<template>
  <div class="dashboard">
    <div class="stat-label">流量走势</div>
    <div class="stat-chart">
      <v-chart :forceFit="true" :height="height" :width="width" :data="chartData" :scale="scale">
        <v-tooltip :crosshairs="crosshairs"></v-tooltip>
        <v-axis dataKey="date" :label="label"></v-axis>
        <v-line position="date*bytes" color='type'></v-line>
        <v-point position="date*bytes" color='type' size='4' shape='circle' :style="style"></v-point>
      </v-chart>
    </div>
    <div class="main-con">
      <div>adfas</div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import {StatItem, Statistics} from '@/types/domain'
  import DataSet from '@antv/data-set'

  enum TrafficType {
    IN = '入网流量',
    OUT = '出网流量'
  }

  class ChartItem {
    date: String
    type: String
    bytes: number = 0
  }
  @Component
  export default class HelloWorld extends Vue {
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

    statData: Statistics
    chartData:any = []

    created() :void {
      this.fetchData()
    }

    async fetchData(): Promise<void> {
      let data: Statistics = await this.$http.get(this.$urls.getMeasureReport)
      console.log(data)
      if (data) {
        this.statData = data
        let chartItems: any = []
        data.dateStats.forEach(item => {
          let chartItem1 = new ChartItem();
          chartItem1.date = item.date
          chartItem1.type = TrafficType.IN + ''
          chartItem1.bytes = item.inBytes

          let chartItem2 = new ChartItem();
          chartItem2.date = item.date
          chartItem2.type = TrafficType.OUT + ''
          chartItem2.bytes = item.outBytes

          chartItems.push(chartItem1)
          chartItems.push(chartItem2)
        })

        const dv = new DataSet.View().source(data.dateStats);
        dv.transform({
          type: 'fold',
          fields: ['inBytes', 'outBytes'],
          key: 'type',
          value: 'bytes',
        });
        this.chartData = dv.rows
      }

    }
  }
</script>
