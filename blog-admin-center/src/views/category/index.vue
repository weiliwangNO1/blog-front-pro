<template>
  <div class="app-container">

    <!--文章类别查询条件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="分类名称：">
        <el-input v-model.trim="query.name" clearable ></el-input>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="query.status" style="width:80px" filterable clearable >
          <el-option v-for="item in statusSelect" :key="item.value" :label="item.name" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary"  plain @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" type="info"  plain @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="openAdd" plain >新增</el-button>
      </el-form-item>
    </el-form>

    <!--文章类别数据展示组件 -->
    <el-table
      :data="list"
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
        prop="name"
        align="center"
        width="160"
        label="分类名称">
      </el-table-column>
      <el-table-column
        prop="sort"
        label="优先级"
        align="center"
        width="80">
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        align="center"
        width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="更新时间"
        align="center"
        width="140">
      </el-table-column>
      <el-table-column
        prop="remark"
        align="center"
        label="备注">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-tooltip content="编辑分类" placement="top" effect="light">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip content="删除分类" placement="top" effect="light">
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--文章类别分页 -->
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

    <!--新增或编辑文章类别窗口 -->
    <edit   :title="edit.title" :visible="edit.visible"
            :formData="edit.formData" :remoteClose="remoteClose" />
  </div>
</template>

<script>

  import { getCateGoryList , getCategoryById, deleteCategoryById } from '@/api/category.js';

  import Edit from './edit';

  const statusSelect = [   //文章类别状态数组
    {'name' : '正常', 'value' : 1},
    {'name' : '禁用', 'value' : 0}
  ];

  export default {
    name: 'Category',
    components : {
      Edit,
    },
    created() {
      this.fetchCategoryData();  //加载页面，获取文章类别数据
    },
    data() {
      return {
        list: [],   //文章类别列表数据
        page : {  //分页对象
          current : 1,
          size : 20,
          total : 0,
        },
        query : {  //分页查询条件
          name : "",
          status : 0,
        },
        statusSelect , // statusSelect : statusSelect
        edit: { // 子组件中引用
          title: '',
          visible: false,
          formData: {   //子组件表单数据
            id: null,
            name: '',
            sort: null,
            remark : '',
          }
        }
      }
    },
    methods: {
      //获取文章类别数据
      async fetchCategoryData () {
       const {code, data} = await getCateGoryList(this.query, this.page.current, this.page.size);
       //判断是否成功获取数据
        if(code === 20000) {
          this.list = data.records;   //文章类别数据
          this.page.total = data.total;  //文章类别总记录数
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      async handleEdit(id) {   //编辑文章类别按钮
        //console.log("handleEdit:", id);
        const {code, data} = await getCategoryById(id);
        if(code === 20000) {  //成功获取文章类别数据
          //打开窗口
          this.edit.formData = data;  //数据赋值
          this.edit.title = "修改文章类别";
          this.edit.visible = true;
        }else {  //获取失败
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      handleDelete(id) {   //删除文章类别按钮
        //console.log("handleDelete:", id);
        this.$confirm("确定删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteCategoryById(id).then(response => {
            const {code} = response;
            if(code === 20000) { //删除成功
              this.$message.success("删除成功！");
              this.fetchCategoryData();  //重新加载数据
            }else {  //删除失败
              this.$message.error("删除失败！");
            }
          }).catch(error =>{
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！");
          })

        })
      },
      handleSizeChange(val) { //每页显示多少条记录，val记录数
        this.page.size = val;  //设置记录数
        this.fetchCategoryData();  //重新获取文章类别数据
      },
      handleCurrentChange(val) {  //跳转页码current  val
        this.page.current = val;  //设置current页码
        this.fetchCategoryData();  //重新获取文章类别数据
      },
      queryData() {   //条件查询数据
        this.page.current = 1;  //每次查询从第一页开始
        this.fetchCategoryData();  //查询数据
      },
      reload() {  //重置查询条件
        this.query = {};  //清空条件
        this.fetchCategoryData();  //查询数据
      },
      remoteClose() {  //子组件关闭窗口
        this.edit.formData = {};  //同时清空父组件里声明的data向子组件传递的数据
        this.edit.visible = false;  //关闭窗口
        this.fetchCategoryData();  //关闭窗口后，同时刷新文章类别界面
      },
      openAdd() {  //点击新增按钮，打开新增窗口
        this.edit.title = "新增文章类别";
        this.edit.visible = true;
      }
    }
  }
</script>
