<template>
  <div>
    <!-- 种类数量条形图 -->
    <div id="bookInfo" style="width:100%;height: 440px"></div>
    <!-- 种类占比图 -->
    <div id="bookCategoryPie" style="width: 500px;height: 400px"></div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "Echarts",
  data() {
    return {};
  },
  created() {},
  mounted() {
    let vm = this;
    vm.getBookCategoryAndCount();
  },
  methods: {
    // 获取书籍种类和数量
    async getBookCategoryAndCount() {
      let vm = this;
      Vue.axios({
        method: "post",
        url: "/api/book",
        request_id: 12345,
        data: {
          cmd: "getBookCategoryAndCount",
          body: {}
        }
      })
        .then(response => {
          vm.processBookCategoryAndCountData(response);
        })
        .catch(error => {
          console.log(error);
        });
    },
    // 处理图书种类数量数据
    processBookCategoryAndCountData(data) {
      let vm = this;
      let chartIDBar = "bookInfo";
      let chartIDPie = 'bookCategoryPie'
      let xData = data.data.body.data.map(item => item.book_type);
      let barDataArr = data.data.body.data.map(item => item.count);
      let legendBar = data.data.body.data.map(item => item.book_type);
      let dataPie = data.data.body.data.map((item) => {
        return {
          name: item.book_type,
          value: item.count
        }
      })
      // 画种类数量条形图
      vm.drawBookCategoryCountChart(chartIDBar, legendBar, xData, barDataArr);
      // 画种类占比饼图
      vm.drawBookCategoryCountPie(chartIDPie, dataPie)
    },
    // 画图书种类数量条形图
    drawBookCategoryCountChart(chartID, legend, xData, data) {
      let vm = this;
      let myEchart = vm.$echarts.init(document.getElementById(chartID));
      let option = {
        title: {
          text: "图书种类数量"
        },
        legend: {
          data: legend
        },
        label: {
          show: true,
          position: "top",
          formatter: "{c}"
        },
        tooltip: {
          show: true,
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          },
          formatter: '{b}: {c}'
        },
        xAxis: {
          type: "category",
          data: xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            type: "bar",
            data: data
          }
        ]
      };
      myEchart.setOption(option);
      // 图大小随窗口大小变化
      window.onresize = () => {
        echart.resize();
      };
    },
    // 画图书种类占比图
    drawBookCategoryCountPie(chartID, data) {
      let vm = this
      let myEchart = vm.$echarts.init(document.getElementById(chartID))
      let option = {
        series:[
          {
            type: 'pie',
            data: data
          }
        ]
      }
      myEchart.setOption(option)
    }
  }
};
</script>