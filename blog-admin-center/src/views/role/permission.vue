<template>
  <!-- 分配菜单弹窗-->
  <el-dialog :before-close="handleClose" width="500px"
    :title="title" :visible="visible">
    <!-- v-loading值为true显示加载中 -->
    <el-form v-loading="loading" label-width="80px">
      <!-- el-form 组件中的 v-loading 值为 true 显示加载中
        el-tree 相关属性说明
        data 数据集合
        default-checked-keys 默认勾选
        node-key 每个树节点用来作为唯一标识的属性
        show-checkbox 显示勾选框
        accordion 每次只打开一个同级树节点展开
        highlight-current 高亮当前选中节点 -->
      <el-tree ref="tree" :data="menuList" :default-checked-keys="menuIds"
      :props="{children: 'children', label : 'name'}"
      node-key="id" show-checkbox
      accordion highlight-current >
      </el-tree>
      <el-form-item align="center" >
        <el-button type="info" size="mini" @click="handleClose">取消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('formData')" >确定</el-button>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>

<script>

  import { getMenuList } from '@/api/menu'

  import { getMenuIdsByRoleId , saveRoleMenu } from '@/api/role'

  export default {
    props: {
      roleId : null,  //角色id
      visible: {
        type: Boolean,
        default : false
      },
      title : {
        type : String,
        default : ''
      },
      remoteClose : Function,
    },
    watch: {
      visible(newVal, oldVla) {  //监听权限分配窗口是否被打开
        if(newVal) {  //说明已经打开权限分配窗口
          this.getMenuList();
        }
      }
    },
    data() {
      return {
        menuIds: [],  //角色所有拥有的菜单id集合
        menuList: [],    //所有菜单数据
        loading : false,
      }
    },
    methods: {
      handleClose() {   //关闭窗口
        this.menuIds = [];
        this.menuList = [];
        this.remoteClose();  //关闭窗口
      },
      async submitForm(formName) {  //提交表单
        // 获取所有被选中的菜单id
        const checkedMenuIds = this.$refs.tree.getCheckedKeys()
        // 获取半选中（父节点）的菜单id +++
        const parentIds = this.$refs.tree.getHalfCheckedKeys()
        // 合并菜单id +++
        const menuIds = parentIds.concat(checkedMenuIds)
        //2.调用保存角色菜单接口
        const {code} = await saveRoleMenu(this.roleId, menuIds );
        if(code === 20000) {  //提交成功
          this.$message.success("保存成功！");
          this.handleClose();  //关闭窗口
        }else {  //提交失败
          this.$message.error("服务器繁忙，请稍后重试！");
        }

      },
      async getMenuList() {  //查询所有菜单
        this.loading = true;
        const {code, data} = await getMenuList({});
        if(code === 20000) {
          this.menuList = data;
          await this.getMenuIdsByRoleId();
        }else {  //获取数据失败
          this.$message.error("服务器繁忙，请稍后重试！");
          this.handleClose();
        }
        this.loading = false;  //取消加载
      },
      async getMenuIdsByRoleId() {
        const {data} = await getMenuIdsByRoleId(this.roleId);
        //this.menuIds = data;
        // 循环回显子节点数据 +++
        data.forEach(id => {
          // 获取节点对象
          const node = this.$refs.tree.getNode(id)
          // 是否为子节点，
          if(node.isLeaf){
            // 是子节点则勾选，所有子节点勾选后父节点会自动勾选，所以不用去勾选父节点
            this.$refs.tree.setChecked(node, true)
          }
        })
      }
    }
  }
</script>
