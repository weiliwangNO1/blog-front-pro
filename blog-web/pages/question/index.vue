<template>
  <div>
    <el-tabs value="hot"  type="card" @tab-click="handleClick">
      <el-tab-pane label="热门回答" name="hot">
        <div v-if="hotVisable" ><question-list :page="page" :listData="listData" name="hot" @fetch-data="fetchData" /></div>
        <dvi v-else > 暂无热门数据 </dvi>
      </el-tab-pane>
      <el-tab-pane label="最新回答" name="new">
        <div v-if="newVisable"><question-list :page="page" :listData="listData" name="new" @fetch-data="fetchData" /></div>
        <div v-else> 暂无最新回答 </div>
      </el-tab-pane>
      <el-tab-pane label="等待回答" name="wait">
        <div v-if="waitVisable"><question-list :page="page" :listData="listData" name="wait" @fetch-data="fetchData" /></div>
        <div v-else> 暂无等待回答 </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>

  import questionList from '@/components/question/List';

  export default {

    components: {
      questionList,
    },
    data() {
      return {
        hotVisable: false,
        newVisable: false,
        waitVisable: false,
      }
    },
    methods: {
      handleClick(tab, event) {
        //console.log(tab.name);
        this.fetchData(tab.name, 1, 20);  //tab切换，current设置为1初始页
      },
      async fetchData(name, current, val) {  //点击分页，获取数据，name类别，current页码
        this.page.current = current;  //设置当前页码
        this.page.size = val;  //每页记录数
        switch (name) {
          case 'hot':   //热门问答
            const {code, data} = await this.$getHotList(this.page);
            if(code === 20000) {
              if(data && data.total > 0 && data.records.length > 0) {
                this.hotVisable = true;
                this.page.total = data.total;
                this.listData = data.records;
              }else {  //没有热门数据
                this.hotVisable = false;
              }
            }else {
              this.hotVisable = false;
            }
            break;
          case 'new':   //最新问答
            const {code : code1, data: data1} = await this.$getNewList(this.page);
            if(code1 === 20000) {
              if(data1 && data1.total > 0 && data1.records.length > 0) {
                this.newVisable = true;
                this.page.total = data1.total;
                this.listData = data1.records;
              }else {  //没有热门数据
                this.newVisable = false;
              }
            }else {
              this.newVisable = false;
            }
            break;
          case 'wait':   //等待问答
            const {code :code2 , data :data2} = await  this.$getWaitList(this.page);
            if(code2 === 20000) {
              if(data2 && data2.total > 0 && data2.records.length > 0) {
                this.waitVisable = true;
                this.page.total = data2.total;
                this.listData = data2.records;
              }else {  //没有热门数据
                this.newVisable = false;
              }
            }else {
              this.newVisable = false;
            }
            break;
          default:   //默认加载热门问答
            const {code : code3, data: data3} = await this.$getHotList(this.page);
            if(code3 === 20000) {
              if(data3 && data3.total > 0 && data3.records.length > 0) {
                this.hotVisable = true;
                this.page.total = data3.total;
                this.listData = data3.records;
              }else {  //没有热门数据
                this.hotVisable = false;
              }
            }else {
              this.hotVisable = false;
            }
            break;
        }
      }
    },
    async asyncData({ app }) {
      //默认加载热门回答信息
      const page = {
        size: 20,
        total: 0,
        current: 1
      }
      const {code, data} = await app.$getHotList(page);
      if(code === 20000) { //后台正确返回数据
        page.total = data.total;
        if(data.total > 0 && data.records.length > 0) { //有数据
          return { page, listData : data.records, hotVisable: true };
        }else {  //没有数据
          return { page, listData: [], hotVisable:false };
        }
      }else {  //后台没有加载数据
        return {page, listData: [], hotVisable:false};
      }
    }
  }
</script>
