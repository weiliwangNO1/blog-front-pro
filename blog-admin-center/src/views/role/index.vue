<template>
  <div class="app-container">
    <!--角色查询条件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="角色名称：">
        <el-input v-model.trim="query.name" clearable ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary"  plain @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" type="info"  plain @click="reload">重置</el-button>
        <el-button v-if="!roleIds" icon="el-icon-circle-plus-outline" type="success" @click="openAdd" plain >新增</el-button>

        <el-button v-if="roleIds" icon="el-icon-connection" type="success" @click="handSelectionRole" plain >角色分配</el-button>
      </el-form-item>
    </el-form>

    <!--角色数据展示组件 -->
    <el-table
      :data="roleList"
      border
      ref="roleDataTable"
      row-key="id"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <!--reserve-selection多选框时，设置该属性为true,翻页后可以回显勾选，需要和row-key="id"配合使用 -->
      <el-table-column
        type="selection"
        :reserve-selection="true"
        width="55">
      </el-table-column>
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
        label="角色名称">
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align="center">
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        v-if="!roleIds"
        width="200">
        <template slot-scope="scope">
          <el-tooltip content="分配权限" placement="top" effect="light">
            <el-button type="success" size="mini" @click="handlePermission(scope.row.id)" icon="el-icon-setting" plain></el-button>
          </el-tooltip>
          <el-tooltip content="编辑角色" placement="top" effect="light">
            <el-button type="primary"  size="mini" @click="handleEdit(scope.row.id)" icon="el-icon-edit" plain></el-button>
          </el-tooltip>
          <el-tooltip content="删除角色" placement="top" effect="light">
            <el-button type="danger"  size="mini" @click="handleDelete(scope.row.id)" icon="el-icon-delete" plain></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--角色分页 -->
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

    <!--新增或修改角色 -->
    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose" />

    <!--分配菜单 -->
    <permission title="分配权限" :visible="per.visible" :remoteClose="remotePerClose" :roleId="per.roleId" />

  </div>
</template>

<script>

  import {getRoleList, getRoleById , deleteRoleById } from '@/api/role'

  import Edit from './edit'

  import Permission from './permission'

  export default {
    name: 'Role',
    components: {
      Edit,
      Permission
    },
    props: {
      roleIds : {
        type : Array,
        default : null,
      },
      clickUser : {  //监听，如果为ture，那么重新获取角色数据
        type : String,
        default : null,
      }
    },
    data() {
      return {
        roleList: [],  //角色列表
        page: {
          current : 1,
          size : 20,
          total : 0
        },
        query : {},  //查询条件
        edit: {  //新增或修改角色
          title : '',
          visible: false,  //默认关闭
          formData: {},  //新增或修改角色表单
        },
        per: {  //角色分配菜单
          roleId : null, //角色id
          visible : false,  //默认关闭分配菜单窗口
        },
        checkSelectionRole : [],  //被勾选的角色对象数组
      }
    },
    watch: {
      clickUser(newVal) {
        if(newVal) {  //监听isOpen为true时，重新查询数据
          this.queryData();
        }
      }
    },
    created() {
      this.fetchRoleData();
    },
    methods: {
      async fetchRoleData() {  //分页获取角色列表数据
        const {code, data} = await getRoleList(this.query, this.page.current, this.page.size);
        if(code === 20000) {
          this.roleList = data.records;
          this.page.total = data.total;

          //如果index.vue作为组件被引入
          this.checkRole();
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      checkRole() {  //如果roleIds不为空，获取数据后，勾选选中的角色
        this.$refs.roleDataTable.clearSelection();  //先清空勾选的
        if(this.roleIds) {  //如果roleIds不为空
          this.roleList.forEach(item => {
            if(this.roleIds.indexOf(item.id) !== -1) {  //说明角色Id相等
              this.$refs.roleDataTable.toggleRowSelection(item);  //勾选
            }
          })
        }
      },
      handlePermission(id) {  //分配权限id为角色id
        debugger;
        this.per.visible = true;
        this.per.roleId = id;
      },
      async handleEdit(id) {  //编辑角色参数为角色id
        const {code , data} = await getRoleById(id);
        if(code === 20000) {
          this.edit.title = "更新角色";
          this.edit.visible = true; //打开更新窗口
          this.edit.formData = data;
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      handleDelete(id) {   //删除角色参数为角色id
        this.$confirm("确定删除该角色?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteRoleById(id).then(response => {
            this.$message.success("删除成功！");
            this.fetchRoleData();  //重新查询角色数据
          }).catch(error => {
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！");
          })
        })
      },
      handleSizeChange(val) {  //当size变化触发事件
        this.page.size = val;
        this.fetchRoleData();  //重新加载角色数据
      },
      handleCurrentChange(val) {  //当current变化触发事件
        this.page.current = val;
        this.fetchRoleData();  //重新加载角色数据
      },
      queryData() {  //查询角色数据
        this.page.current = 1;
        this.fetchRoleData();
      },
      reload() {  //重置条件，重新查询
        this.query = {};  //清空查询条件
        this.fetchRoleData();
      },
      openAdd() {  //新增角色
        this.edit.title = "新增角色";
        this.edit.visible = true;
      },
      remoteClose() {  //关闭新增或修改角色窗口
        this.formData = {};  //清除表单数据
        this.edit.visible = false;  //关闭新增或编辑角色窗口
        this.fetchRoleData();  //重新查询数据
      },
      remotePerClose() {  //关闭分配权限弹窗
        this.per.visible = false;
        this.per.roleId = null;
        this.fetchRoleData(); //重新查询角色数据
      },
      handleSelectionChange(val) {  //当勾选框勾选后触发事件
        this.checkSelectionRole = val; //赋值，获取最新的角色勾选数据
      },
      handSelectionRole() {  //角色分配事件
        this.$confirm("确定分配角色?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const checkRoleIds = [];  //角色数组id
          this.checkSelectionRole.forEach(item => {
            checkRoleIds.push(item.id);  //角色id放入集合
          })
          this.$emit('saveUserRole', checkRoleIds);
        })
      }
    }
  }
</script>


<style>
  .box {
    width: 400px;

  .top {
    text-align: center;
  }

  .left {
    float: left;
    width: 60px;
  }

  .right {
    float: right;
    width: 60px;
  }

  .bottom {
    clear: both;
    text-align: center;
  }

  .item {
    margin: 4px;
  }

  .left .el-tooltip__popper,
  .right .el-tooltip__popper {
    padding: 8px 10px;
  }
  }

</style>
