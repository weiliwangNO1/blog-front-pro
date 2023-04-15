<template>
  <!--新增或修改用户页面 -->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose">
    <!-- 新增或编辑表单-->
    <el-form :model="formData" :rules="rules"  ref="formData" label-width="100px" label-position="right"
             style="width: 400px;"  class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input  :disabled="formData.id" v-model="formData.username" clearable ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="formData.nickName" clearable ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="formData.mobile" clearable ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" clearable ></el-input>
      </el-form-item>
      <el-form-item label="账号过期" prop="isAccountNonExpired">
        <el-radio-group v-model="formData.isAccountNonExpired">
          <el-radio :label="1" border>未过期</el-radio>
          <el-radio :label="0" border>已过期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="密码过期" prop="isCredentialsNonExpired">
        <el-radio-group v-model="formData.isCredentialsNonExpired">
          <el-radio :label="1" border>未过期</el-radio>
          <el-radio :label="0" border>已过期</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账号锁定" prop="isAccountNonLocked">
        <el-radio-group v-model="formData.isAccountNonLocked">
          <el-radio :label="1" border>未锁定</el-radio>
          <el-radio :label="0" border>已锁定</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm('formData')">确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>

  import { addUser, updateUser } from '@/api/user'

  export default {
    props: {
      title : {
        type : String,
        default : ''
      },
      visible: {
        type : Boolean,
        default : false
      },
      formData: {
        type : Object,
        default : {}
      },
      remoteClose: Function,
    },
    data() {
      return {
        rules: {
          username: [
            {required : true, message: '请输入用户名', trigger: 'blur'},
            { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
          ],
          nickName: [
            {required : true, message: '请输入昵称', trigger: 'blur'}
          ],
          mobile: [
            {required : true, message: '请输入手机号', trigger: 'blur'}
          ],
          email: [
            {required : true, message : '请输入邮箱地址', trigger: 'blur'}
          ],
          isAccountNonExpired: [
            {required : true, message: '请选择账号是否过期', trigger: 'change'}
          ],
          isCredentialsNonExpired: [
            {required : true, message: '请选择密码是否过期', trigger: 'change'}
          ],
          isAccountNonLocked: [
            {required : true, message: '请选择账号是否锁定', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      handleClose() {  //关闭窗口
        this.$refs['formData'].resetFields();
        this.remoteClose();
      },
      submitForm(formName) {  //提交数据
        this.$refs[formName].validate((valid) => {
          if(valid) {  //表单校验成功
            this.submitData();
          }else {
            return false;
          }
        })
      },
      async submitData() {   //提交新增或修改账户数据
        if(this.formData.id) {  //更新用户
          const {code} = await updateUser(this.formData);
          if(code === 20000) {  //更新成功
            this.$message.success("更新成功！");
            this.handleClose();  //关闭窗口
          }else {  //更新失败
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }else {  //新增用户
          const {code} = await addUser(this.formData);
          if(code === 20000) {
            this.$message.success("新增成功");
            this.handleClose();  //关闭窗口
          }else {
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }
      }
    }
  }
</script>
