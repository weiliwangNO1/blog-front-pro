<template>
  <!--新增或修改角色界面 -->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="400px"
    :before-close="handleClose">
    <!-- 新增或编辑表单-->
    <el-form :model="formData" :rules="rules"  ref="formData" label-width="100px" label-position="right"
             style="width: 300px;"  class="demo-ruleForm">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" clearable ></el-input>
      </el-form-item>
      <el-form-item label="角色备注" prop="remark">
        <el-input type="textarea" maxlength="300"
                  show-word-limit :autosize="{ minRows: 2, maxRows: 4}"
                  v-model="formData.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm('formData')">确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>

  import { addRole, updateRole } from '@/api/role'

  export default {
    props: {
      title: {
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
          name: [
            {required : true, message: '请输入角色名称', trigger: 'blur'}
          ],
          remark: [
            {required : true, message: '请输入角色备注', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleClose() {  //关闭窗口
        this.$refs['formData'].resetFields();
        this.remoteClose();
      },
      submitForm(formName) {  //新增或修改角色
        this.$refs[formName].validate((valid) => {
          if(valid) {  //校验通过
            this.submitData();
          }else {  //校验不通过
            return false;
          }
        })
      },
      async submitData() {  //提交新增或修改角色数据
        if(this.formData.id) {  //编辑角色
          const {code} = await updateRole(this.formData);
          if(code === 20000) {   //更新角色成功
            this.$message.success("更新成功！");
            this.handleClose();  //关闭窗口
          }else {  //更新角色失败
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }else {  //新增角色
          const {code} = await addRole(this.formData);
          if(code === 20000) {  //新增成功
            this.$message.success("新增成功！");
            this.handleClose();  //关闭窗口
          }else {  //新增失败
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }
      }
    }
  }
</script>
