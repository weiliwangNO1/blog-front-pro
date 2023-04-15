<template>
  <div class="app-container">

    <!--广告查询条件 -->
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
        <el-button icon="el-icon-circle-plus-outline" type="success"  plain @click="openAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <!--广告数据展示组件 -->
    <el-table
      :data="advertList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="60">
      </el-table-column>
      <!--<el-table-column
        prop="id"
        label="主键">
      </el-table-column>-->
      <el-table-column
        prop="title"
        align="center"
        width="140"
        label="广告标题">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="广告图片"
        width="140"
        align="center">
        <template slot-scope="scope">
          <el-image
            style="width: 90px; height: 60px"
            :src="scope.row.imageUrl"
            :preview-src-list="[scope.row.imageUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column
        prop="advertUrl"
        align="center"
        width="120"
        label="广告链接">
      </el-table-column>
      <el-table-column
        prop="advertTarget"
        align="center"
        label="跳转方式">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.advertTarget === '_blank'" type="success">新窗口打开</el-tag>
          <el-tag v-if="scope.row.advertTarget === '_self'" >本窗口打开</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="position"
        label="广告位置"
        align="center"
        width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.position === 1" type="success">首页轮播</el-tag>
          <el-tag v-if="scope.row.position === 2" >右侧轮播</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag v-if="scope.row.status === 0" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        align="center"
        width="80"
        label="优先级">
      </el-table-column>
      <el-table-column
        prop="createDate"
        align="center"
        width="100"
        label="创建时间">
        <template slot-scope="scope">
          {{formatDate(scope.row.createDate)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateDate"
        label="更新时间"
        align="center"
        width="100">
        <template slot-scope="scope">
          {{formatDate(scope.row.updateDate)}}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-tooltip content="编辑广告" placement="top" effect="light">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip content="删除广告" placement="top" effect="light">
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--广告分页组件 -->
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

    <!-- 新增或编辑广告组件-->
    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData"
     :oldImageUrl="edit.oldImageUrl" :remoteClose="remoteClose" />

  </div>
</template>


<script>

  import { getAdvertList ,getAdvertById, deleteAdvert } from '@/api/advert'

  //格式化日期插件
  import { format } from '@/utils/date'

  const statusSelect = [  //文章状态定义一个常量数组
    { 'name': '正常', 'value' :1 },
    { 'name': '禁用', 'value' :0 }
  ]

  import Edit from './edit';

  export default {
    name: 'Advert',
    components : {
      Edit,  //新增或编辑广告组件
    },
    data() {
      return {
        advertList: [],  //广告数据
        page: {
          current : 1,
          size : 20,
          total : 0,
        },
        query : {},  //查询条件
        statusSelect,  //广告状态下拉框数据
        edit: {
          title : '',
          visible : false,
          oldImageUrl : null,  //编辑时显示的原始图片url
          formData : {
            imageUrl : null,  //广告图片，必须要有该值，不然图片上传后不能回显
          }
        },
      }
    },
    created() {
      this.fetchAdvertData();  //加载获取分页广告数据
    },
    methods: {
      async fetchAdvertData() {  //获取分页广告数据
        const {data} = await getAdvertList(this.query, this.page.current, this.page.size);
        this.page.total = data.total;  //更新数量
        this.advertList = data.records;  //更新广告信息
      },
      formatDate(date) {  //格式化日期组件
        return format(date);
      },
      async handleEdit(id) {  //编辑广告,id为广告id
        const {code, data} = await getAdvertById(id);
        if(code === 20000) {
          this.edit.formData = data;
          //先保存旧图片路径
          this.edit.oldImageUrl = data.imageUrl;
          //打开修改广告窗口
          this.edit.visible = true;
          this.edit.title = "修改广告";
        }else {
         this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      handleDelete(id) {  //删除(禁用)广告，id为广告id
        this.$confirm("确定禁用该广告?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteAdvert(id).then(response => {
            const {code} = response;
            if(code === 20000) {
              this.$message.success("成功禁用该广告！");
              this.fetchAdvertData();  //重新刷新广告界面
            }else {
              this.$message.error("服务器繁忙，请稍后重试！");
            }
          }).catch(error => {
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！");
          })
        })
      },
      handleSizeChange(val) {  //当广告页面的size发生变化时触发
        this.page.size = val;
        this.fetchAdvertData();  //查询广告数据
      },
      handleCurrentChange(val) { //当广告页面的current发生变化时触发
        this.page.current = val;
        this.fetchAdvertData();  //查询广告信息
      },
      queryData() {   //查询广告数据
        this.page.current = 1;  //从第一页开始查询
        this.fetchAdvertData();  //查询广告信息
      },
      reload() {  //重置查询
        this.query = {};  //清空查询条件
        this.fetchAdvertData();  //查询广告信息
      },
      remoteClose() {  //关闭新增或编辑广告界面
        this.edit.formData = {imageUrl: null};
        this.edit.visible = false;
        this.fetchAdvertData();  //重新查询广告数据
      },
      openAdd() {  //点击新增按钮，打开新增广告界面
        this.edit.visible= true;
        this.edit.title = "新增广告";

      }
    }
  }
</script>
