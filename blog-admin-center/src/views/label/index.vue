<template>
  <div class="app-container">

    <!--标签查询条件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="标签名称：">
        <el-input v-model.trim="query.name" clearable ></el-input>
      </el-form-item>
      <el-form-item label="分类名称：">
        <el-select v-model="query.categoryId" style="width:140px" filterable clearable >
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary"  plain @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" type="info"  plain @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="openAdd" plain >新增</el-button>
      </el-form-item>
    </el-form>

    <!--标签数据展示组件 -->
    <el-table
      :data="labelList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="60">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="标签名称">
      </el-table-column>
      <el-table-column
        prop="categoryName"
        label="分类名称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="createDate"
        label="创建时间"
        align="center"
        width="140">
      </el-table-column>
      <el-table-column
        prop="updateDate"
        label="更新时间"
        align="center"
        width="140">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-tooltip content="编辑标签" placement="top" effect="light">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip content="删除标签" placement="top" effect="light">
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--标签数据分页 -->
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

    <!--新增或修改标签数据 -->
    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :categoryList="categoryList" :remoteClose="remoteClose" />
  </div>
</template>

<script>

  import { getLabelList , getLabelById, deleteLabelById } from '@/api/label';

  import { getNormalCategoryList } from '@/api/category';

  import Edit from './edit';

  export default {
    name: 'Label',
    components : {
      Edit,
    },
    data() {
      return {
        labelList : [],  //标签数据
        page: {
          current : 1,  //当前页码
          size : 20,  //每页记录数
          total : 0,  //总数
        },
        query: {},
        categoryList: [],  //正常的分类数据
        edit: { // 子组件中引用
          title: '',
          visible: false,
          formData: {   //子组件表单数据
            id: null,
            name: '',
            categoryId : null,
          }
        },
      }
    },
    created() {
      this.fetchLabelData();  //加载分页的标签数据
      this.getCategoryList();  //获取所有正常的分类数据
    },
    methods: {
      async fetchLabelData() {   //获取标签分页数据
        const { code, data } = await getLabelList(this.query, this.page.current, this.page.size);
        if(code === 20000) {
          this.labelList = data.records;  //重新赋值标签集合数据
          this.page.total = data.total;  //更新总记录数
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      async handleEdit(id) { //标签Id，编辑标签数据
        //console.log("编辑：", id);
        //根据标签id查询最新对应的标签数据
        const {code, data} = await getLabelById(id);
        if(code === 20000) {
          this.edit.formData = data;  //标签数据赋值
          this.edit.title = "更新标签";
          this.edit.visible = true;  //编辑窗口可见
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      handleDelete(id) {  //标签id，删除标签id
        //console.log("删除：", id);
        this.$confirm("确定删除标签?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteLabelById(id).then(response => {
            const {code} = response;
            if(code === 20000) {  //删除标签成功
              this.$message.success("删除成功！");
              this.fetchLabelData();  //重新加载数据
            }else {  //删除失败
              this.$message.error("服务器繁忙，请稍后重试")
            }
          }).catch(error => {
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！");
          })
        })
      },
      handleSizeChange(val) {  //当分页的size改变时触发，size
        this.page.size = val;
        this.fetchLabelData();  //重新加载数据
      },
      handleCurrentChange(val) {  //当分页的current改变时出发,current
        this.page.current = val;
        this.fetchLabelData();
      },
      async getCategoryList() {   //获取正常的分类数据
        const {data} = await getNormalCategoryList();
        this.categoryList = data;
      },
      queryData() {   //条件查询标签分页数据
        this.page.current = 1;  //从第一页开始查询
        this.fetchLabelData();  //根据条件查询标签数据
      },
      reload() {  //重置标签分页数据
        this.query = {};  //清空查询条件
        this.fetchLabelData();   //重新查询标签数据
      },
      openAdd() {   //新增标签数据
        this.getCategoryList();  //打开界面时，重新查询类别数据
        this.edit.visible = true;  //显示窗口
        this.edit.title = "新增标签";  //新增标签窗口
      },
      remoteClose() {  //关闭新增或修改标签窗口
        this.edit.visible = false;
        this.edit.formData = {}; //清空数据
        this.fetchLabelData();  //重新加载标签数据
      }
    }

  }
</script>
