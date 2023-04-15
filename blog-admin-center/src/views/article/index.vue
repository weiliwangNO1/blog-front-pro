<template>
  <div class="app-container">
    <!-- 新增文章-->
    <!--文章查询条件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="文章标题：">
        <el-input v-model.trim="query.title" clearable ></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="query.status" style="width:120px" filterable clearable >
          <el-option v-for="item in statusSelect" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary"  plain @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" type="info"  plain @click="reload">重置</el-button>
      </el-form-item>
    </el-form>

    <!--文章分页数据展示组件 -->
    <el-table
      :data="articleList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="60">
      </el-table-column>
      <el-table-column
        prop="title"
        align="center"
        width="260"
        label="文章标题">
      </el-table-column>
      <el-table-column
        prop="viewCount"
        label="浏览量"
        align="center">
      </el-table-column>
      <el-table-column
        prop="thumhup"
        label="点赞数"
        align="center">
      </el-table-column>
      <el-table-column
        prop="ispublic"
        label="是否公开"
        align="center">
        <template slot-scope="scope">
          <!--0: 不公开 1：公开 -->
          <el-tag v-if="scope.row.ispublic === 0" type="danger">不公开</el-tag>
          <el-tag v-if="scope.row.ispublic === 1" type="success">公开</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="文章状态"
        min-width="100px"
        align="center">
        <template slot-scope="scope">
          <!-- 0: 已删除, 1:未审核，2:已审核,3: 审核未通过 -->
          <el-tag v-if="scope.row.status === 0" type="info">已删除</el-tag>
          <el-tag v-if="scope.row.status === 1" >未审核</el-tag>
          <el-tag v-if="scope.row.status === 2" type="success">已审核</el-tag>
          <el-tag v-if="scope.row.status === 3" type="danger">审核未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateDate"
        label="更新时间"
        align="center"
        width="160">
        <template slot-scope="scope">
          {{formatDate(scope.row.updateDate)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="left"
        width="230">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="openAuditLook(scope.row.id)" plain>查看</el-button>
          <!--审核：当status状态为1时显示审核按钮。删除：当status状态不等于0时显示删除按钮 -->
          <el-button type="primary" v-if="scope.row.status === 1" size="mini" @click="openAudit(scope.row.id)" plain>审核</el-button>
          <el-button type="danger" v-if="scope.row.status !== 0" size="mini" @click="handleDelete(scope.row.id)" plain>删除</el-button>
        </template>
      </el-table-column>

      <el-empty v-if="!articleList" description="暂无数据"></el-empty>
    </el-table>

    <!--文章分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      size="medium"
      :current-page="page.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.total">
    </el-pagination>

    <!--查看或审核文章窗口界面 -->
    <audit :id="audit.id" :isAudit="audit.isAduit" :title="audit.title" :visible="audit.visible" :remoteClose="remoteClose"   />

  </div>
</template>

<script>

  import { getArticleList , deleteArticleById } from '@/api/article'

  //格式化日期插件
  import { format } from '@/utils/date'

  //查看或审核文章界面
  import Audit from './audit';

  const statusSelect = [  //文章状态定义一个常量数组
    { 'name': '未审核', 'value' :1 },
    { 'name': '已审核', 'value' :2 },
    { 'name': '审核未通过', 'value' :3 },
    { 'name': '已删除', 'value' :0 }
  ]

  export default {
    name: 'Article',
    components: {
      Audit
    },
    data() {
      return {
        articleList: [],  //文章数据
        page: {
          current: 1, //当前页码
          size : 20,  //每页记录数
          total: 0,  //文章总数
        },
        query : {},  //查询条件
        statusSelect,  //文章审核状态下拉框数据
        audit: {
          id: null,  //文章id
          isAduit : true,  //true审核，false查看
          title : '',  //标题
          visible : false,  //窗口关闭状态
        }
      }
    },
    created() {
      this.fetchArticleData();  //初始加载文章分页数据
    },
    methods: {
      async fetchArticleData() {  //获取文章列表数据
          const {code, data} = await getArticleList(this.query, this.page.current, this.page.size);
          if(code === 20000) {
            this.articleList = data.records;  //文章数据赋值
            this.page.total = data.total;  //文章总数
          }else {
            this.$message.error("服务器繁忙，请稍后重试！");
          }
      },
      formatDate(date) {  //格式化日期组件
        return format(date);
      },
      handleSizeChange(val) {  //当页面size变化触发事件
        this.page.size = val;
        this.fetchArticleData();  //重新查询数据
      },
      handleCurrentChange(val) {  //当页面current变化触发事件
        this.page.current = val;
        this.fetchArticleData();  //重新查询数据
      },
      queryData() {  //条件分页查询文章数据
        this.page.current = 1;  //从第一页开始
        this.fetchArticleData();  //查询数据
      },
      reload() {   //重置分页查询文章数据
        this.query = {};  //清除查询条件
        this.fetchArticleData();  //查询数据
      },
      openAudit(id) { //文章审核  id文章id
        this.audit.id = id;  //文章id
        this.audit.isAduit = true;  //审核文章界面
        this.audit.visible = true;  //打开界面
        this.audit.title = "审核文章";
      },
      openAuditLook(id) {  //查看文章  id文章id
        this.audit.id = id;  //文章id
        this.audit.isAduit = false; //查看文章，关闭审核按钮
        this.audit.visible = true;  //打开界面
        this.audit.title = "查看文章";
      },
      remoteClose() {  //关闭查看或审核文章窗口
        this.audit.visible = false;
        this.fetchArticleData();  //关闭窗口后，重新查询文章数据
      },
      handleDelete(id) {  //删除文章
        this.$confirm("确定删除该文章?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteArticleById(id).then(response => {
            const {code} = response;
            if(code === 20000) {  //删除成功
              this.$message.success("删除成功！");
              this.fetchArticleData();  //重新获取文章列表数据
            }else {
              this.$message.error("服务器繁忙，请稍后重试！");
            }
          }).catch(error => {
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！");
          })
        })
      }
    }
  }
</script>
