<template>
  <!--弹窗-->
  <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose"
             width="380px">
    <el-form :rules="rules" ref="formData" :model="formData" label-width="100px"
             style="width: 300px;">
      <el-form-item label="新密码：" prop="newPassword">
        <el-input type="password" placeholder="请输入新密码" v-model="formData.newPassword">
        </el-input>
      </el-form-item>
      <el-form-item label="确认密码：" prop="repPassword">
        <el-input type="password" placeholder="请输入确认密码" v-model="formData.repPassword"></el-input>
      </el-form-item>
      <el-form-item align="right">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="submitForm('formData')">确 定</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>

  import { updateUserPassword } from '@/api/user'

  export default {
    //接收父组件传递的属性
    props: {
      userId : null ,//用户id
      visible : {
        type : Boolean,
        default : false,
      },
      title : {  //标题
        type : String,
        default : ''
      },
      remoteClose : Function //用于关闭窗口
    },
    data() {
      // 校验确认密码是否一致
      const validateRepPassword = (rule, value, callback) => {
        if(value === this.formData.newPassword) {
          // 相等,则通过
          callback()
        }else {
          callback(new Error('两次输入的密码不一致'))
        }
      };

      return {
        formData: {},
        rules: {
          newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }],
          repPassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { validator: validateRepPassword, trigger: 'blur' }
          ]
        }
      }
    },
    methods:{
      //关闭弹窗
      handleClose(done) {
        //清空表单
        this.$refs['formData'].resetFields();
        this.remoteClose();
      },
      //提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {  //验证通过
            this.$confirm("确定修改密码?", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              this.formData.userId = this.userId;  //把用户id赋值到formData里
              updateUserPassword(this.formData).then(response => {
                const {code} = response;
                if(code === 20000) {
                  this.$message.success("修改成功");
                  this.handleClose();
                }else {
                  this.$message.error("服务器繁忙，请稍后重试！");
                }
              }).catch(error => {  //提交失败
                console.log(error);
                this.$message.error("服务器繁忙，请稍后重试！");
              })
            })
          }else{  //验证不通过
            return false;
          }
        })
      }
    }
  }
</script>
