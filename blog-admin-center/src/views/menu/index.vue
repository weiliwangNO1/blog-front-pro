<template>
  <div class="app-container">

    <!--菜单查询条件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="菜单名称：">
        <el-input v-model.trim="query.name" clearable ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary"  plain @click="fetchMenuData">查询</el-button>
        <el-button icon="el-icon-refresh" type="info"  plain @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="handleAdd(0)" plain >新增</el-button>
      </el-form-item>
    </el-form>

    <!--菜单列表数据展示组件 -->
    <el-table
      :data="menuList"
      row-key="id"
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
        align="left"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="url"
        label="请求地址"
        align="center">
      </el-table-column>
      <el-table-column
        prop="code"
        label="权限标识"
        align="center">
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型"
        align="center">
        <template slot-scope="scope">
          <!-- 类型(1目录，2菜单，3按钮)-->
          <el-tag v-if="scope.row.type === 1" type="success">目录</el-tag>
          <el-tag v-if="scope.row.type === 2" type="primary">菜单</el-tag>
          <el-tag v-if="scope.row.type === 3" type="danger" >按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="icon"
        label="图标"
        align="center">
        <template slot-scope="scope">
          <!--加载图标 -->
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        align="center"
        label="排序">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="160">
        <template slot-scope="scope">
          <el-tooltip content="新增" placement="top" effect="light">
            <el-button type="success" size="mini" @click="handleAdd(scope.row.id)" icon="el-icon-circle-plus-outline" circle></el-button>
          </el-tooltip>
          <el-tooltip content="编辑" placement="top" effect="light">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--新增或修改表单组件 -->
    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose" />

  </div>
</template>

<script>

  import { getMenuList, getMenuById, deleteMenuById } from '@/api/menu'

  import Edit from './edit'

  export default {
    name: 'Menu',
    components : {
      Edit
    },
    data() {
      return {
        menuList: [],  //菜单数据
        query : {},  //查询条件
        edit: {
          title : '',  //组件标题
          visible: false,  //默认关闭窗口
          formData: {},  //子组件表单数据
        }
      }
    },
    created() {
      this.fetchMenuData();  //加载菜单列表数据
    },
    methods : {
      async fetchMenuData() {   //获取菜单列表数据
        const {code, data} = await getMenuList(this.query);
        if(code === 20000) {  //获取菜单列表数据
          this.menuList = data;
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      handleAdd(id) {  //新增菜单，id为父菜单id partentId,如果parentId为0，那么是新增目录
        this.edit.title = "新增菜单"
        this.edit.visible = true; //打开新增菜单窗口
        this.edit.formData.parentId = id;  //把parentId赋值给子组件
      },
      async handleEdit(id) {  //编辑菜单,id为当前菜单id
        const {code, data} = await getMenuById(id);
        if(code === 20000) {
          this.edit.formData = data;
          this.edit.title = '编辑菜单';
          this.edit.visible = true; //打开窗口
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      handleDelete(id) {  //删除菜单，id为当前菜单id
        this.$confirm("确定删除该菜单与子节点菜单?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          console.log("id: ", id);
          deleteMenuById(id).then(response => {
            const {code} = response;
            if(code === 20000) {  //删除成功
              this.$message.success("删除成功！");
              this.fetchMenuData(); //重新加载菜单数据
            }else {  //删除失败
              this.$message.error("服务器繁忙，请稍后重试！")
            }
          }).catch(error => {  //发生错误
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！")
          })
        })
      },
      reload() {   //重置
        this.query = {};
        this.fetchMenuData();  //重新查询菜单信息
      },
      remoteClose() {  //关闭子组件窗口
        this.edit.formData = {};  //清空子组件表单数据
        this.edit.visible = false; //关闭窗口
      }
    }
  }
</script>
