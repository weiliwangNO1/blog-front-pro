<template>
  <div class="app-container">
    <!--用户查询条件 -->
    <el-form :inline="true" :model="query" size="small">
      <el-form-item label="用户名：">
        <el-input v-model.trim="query.username" clearable ></el-input>
      </el-form-item>
      <el-form-item label="手机号：">
        <el-input v-model.trim="query.mobile" clearable ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" type="primary"  plain @click="queryData">查询</el-button>
        <el-button icon="el-icon-refresh" type="info"  plain @click="reload">重置</el-button>
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="openAdd" plain >新增账户</el-button>
      </el-form-item>
    </el-form>

    <!--用户数据展示组件 -->
    <el-table
      :data="userList"
      border
      style="width: 100%">
      <el-table-column
        type="index"
        align="center"
        label="序号"
        width="60">
      </el-table-column>
      <el-table-column
        prop="username"
        align="center"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="nickName"
        label="昵称"
        align="center">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        align="center">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        align="center">
      </el-table-column>
      <el-table-column
        prop="isAccountNonExpired"
        label="账号过期"
        align="center">
        <template slot-scope="scope">
          <!--帐户是否过期(1 未过期，0已过期) -->
          <el-tag v-if="scope.row.isAccountNonExpired === 0" type="danger">过期</el-tag>
          <el-tag v-if="scope.row.isAccountNonExpired === 1" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isAccountNonLocked"
        label="账号锁定"
        align="center">
        <template slot-scope="scope">
          <!--帐户是否被锁定(1 未锁定，0已锁定) -->
          <el-tag v-if="scope.row.isAccountNonLocked === 0" type="danger">锁定</el-tag>
          <el-tag v-if="scope.row.isAccountNonLocked === 1" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isCredentialsNonExpired"
        label="密码过期"
        align="center">
        <template slot-scope="scope">
          <!--密码是否过期(1 未过期，0已过期) -->
          <el-tag v-if="scope.row.isCredentialsNonExpired === 0" type="danger">过期</el-tag>
          <el-tag v-if="scope.row.isCredentialsNonExpired === 1" type="success">正常</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="isEnabled"
        label="账户可用"
        align="center">
        <template slot-scope="scope">
          <!--帐户是否可用(1 可用，0 删除用户) -->
          <el-tag v-if="scope.row.isEnabled === 0" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.isEnabled === 1" type="success">可用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="180">
        <template slot-scope="scope">
          <el-tooltip v-if="scope.row.isEnabled === 1" class="item" effect="light" content="编辑账户" placement="top">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row.id)" icon="el-icon-edit" circle></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.isEnabled === 1" class="item" effect="light" content="禁用账户" placement="top">
            <el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" icon="el-icon-delete" circle></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.isEnabled === 1" class="item" effect="light" content="权限分配" placement="top">
            <el-button type="success" size="mini" @click="handleRole(scope.row.id)" icon="el-icon-setting" circle></el-button>
          </el-tooltip>
          <el-tooltip v-if="scope.row.isEnabled === 1" class="item" effect="light" content="修改密码" placement="top">
            <el-button type="warning" size="mini" @click="handlePwd(scope.row.id)" icon="el-icon-s-check" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!--用户数据分页 -->
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

    <!--新增或编辑账户 -->
    <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"  />

    <!--分配角色组件 -->
    <el-dialog
      title="分配角色"
      :visible.sync="role.visible"
      width="60%">
      <role :roleIds="role.roleIds" @saveUserRole="saveUserRole" :clickUser="role.clickUser" />
    </el-dialog>

    <!-- 修改密码组件-->
    <password title="修改用户密码" :userId="pwd.userId" :visible="pwd.visible" :remoteClose="remotePwdClose" />


  </div>
</template>

<script>

  import { getUserList , getUserbyId, deleteUserById ,getRoleIdsByUserId, saveUserRole} from '@/api/user'

  import Edit from './edit'

  import Role from '../role/index'  //引入角色列表组件

  import Password from './password'  //引入修改密码组件

  export default {
    name: 'User',
    components: {
      Edit,
      Role,
      Password
    },
    data() {
      return {
        userList :[],  //用户列表数据
        page: {
          current : 1,
          size : 20,
          total : 0
        },
        query : {},
        edit: {
          title : '',
          visible : false,
          formData : {},// 新增或修改用户表单数据
        },
        role: {
          userId : null,  //选中的用户id
          visible: false,  //用户分配角色界面是否可见
          roleIds: [],  //用户分配的角色id集合
          clickUser : null,  //
        },
        pwd: {  //用于修改用户新密码
          userId : null,
          visible : false,
        }
      }
    },
    created() {
      this.fetchUserData();
    },
    methods: {
      async fetchUserData() {  //分页获取用户数据
        const {code, data} = await getUserList(this.query, this.page.current, this.page.size);
        if(code === 20000) {
          this.userList = data.records;
          this.page.total = data.total;
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      handleSizeChange(val) {  //当分页插件size改变时触发事件
        this.page.size = val;
        this.fetchUserData();  //查询用户数据
      },
      handleCurrentChange(val) {  //当分页插件current改变时触发事件
        this.page.current = val;
        this.fetchUserData();  //查询用户数据
      },
      queryData() {  //查询账户数据
        this.page.current = 1;
        this.fetchUserData();  //查询数据
      },
      reload() {  //重置查询数据
        this.query = {};
        this.fetchUserData();
      },
      openAdd() {  //新增账户
        this.edit.title = "新增账户【账户名和密码一致】";
        this.edit.visible = true;  //打开窗口
      },
      async handleEdit(id) {  //编辑账户 id为账户id
        const {code, data} = await getUserbyId(id);
        if(code === 20000) {
          this.edit.visible = true;
          this.edit.formData = data;
          this.edit.title = "更新用户";
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
        }
      },
      handleDelete(id) {  //禁用账户， id为账户id
        this.$confirm("确定禁用该账户（谨慎操作）?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          deleteUserById(id).then(response => {
            const {code} = response;
            if(code === 20000) {  //删除成功
              this.$message.success("删除成功！");
              this.fetchUserData();  //重新加载用户数据
            }else {  //删除失败
              this.$message.error("服务器繁忙，请稍后重试！");
            }
          }).catch(error => {
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！");
          })
        })
      },
      async handleRole(id) {  //分配账户权限 id为账户id
        this.role.userId = id;  //设置选中的用户id
        const {code, data} = await getRoleIdsByUserId(id);
        if(code === 20000) {
          this.role.roleIds = data;  //拥有的角色id集合
          this.role.visible = true;  //打开角色分配列表
          this.role.clickUser = Math.round(Math.random()*100) + '';
        }else {
          this.$message.error("服务器繁忙，请稍后重试！")
        }
      },
      handlePwd(id) {   //修改密码  id为账户id
        this.pwd.userId = id;
        this.pwd.visible = true;  //打开修改密码窗口
      },
      remotePwdClose() {  //关闭用户修改密码窗口
        this.pwd.userId = null;
        this.pwd.visible = false;
        this.fetchUserData();  //重新查询用户数据
      },
      remoteClose() {  //关闭窗口
        this.edit.visible = false;
        this.edit.clickUser = null;
        this.edit.formData = {};
        this.fetchUserData();  //刷新数据
      },
      async saveUserRole(checkRoleIds) {  //用户分配角色,checkRoleIds是角色id数组
        //console.log("checkRoleIds:", checkRoleIds);
        this.role.visible = false;  //关闭窗口
        const {code} = await saveUserRole(this.role.userId, checkRoleIds);
        if(code === 20000) {  //分配成功
          this.$message.success("分配成功！");
        }else {  //分配失败
          this.$message.error("服务器繁忙，请稍后重试！");
        }
        await this.fetchUserData();
      }
    }
  }
</script>
