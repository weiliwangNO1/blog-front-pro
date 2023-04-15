<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose">
    <!-- 新增或编辑表单-->
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" label-position="right"
             style="width: 400px;"  class="demo-ruleForm">
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name" clearable ></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" style="width: 300px;" :min="1" :max="100" ></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" maxlength="300"
                  show-word-limit :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入备注" v-model="formData.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm('formData')">确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>

  import { addCategroy, updateCategory } from '@/api/category.js'

  export default {
    props: {
      title: {   //标题
        type: String,
        default : '',
      },
      visible : {   //是否可见
        type : Boolean,
        default : false,
      },
      formData: {  //表单数据
        type: Object,
        default : {},
      },
      remoteClose : Function,  //用于关闭窗口
    },
    data() {
      return {
        rules : {  //表单校验规则
          name: [   //分类名称
            {required: true, message : '请输入分类名称', trigger: 'blur'}
          ],
          status: [
            {required : true, message: '请勾选状态', trigger: 'change'}
          ],
          sort: [
            {required : true, message: '请选择排序', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm(formData) {  //提交表单
        this.$refs[formData].validate((valid) => {
            if(valid) {   //校验通过
              //this.$message.success("提交信息");
              this.submitData();
            }else {  //校验不通过
              //this.$message.warning("请完善信息再提交！");
              return false; //返回false
            }
        })
      },
      handleClose(done) {  //关闭窗口
        this.$refs['formData'].resetFields();  //关闭窗口同时清空表单里的内容
        this.remoteClose();  //关闭子组件窗口
      },
      async submitData() {   //提交新增或修改文章类别数据
        if(this.formData.id) {  //如果id存在，那么是修改
          const {code} = await updateCategory(this.formData);
          if(code === 20000) {  //如果修改成功
            this.$message.success("修改成功！");
            this.handleClose();  //关闭窗口
          }else {  //修改失败
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }else {  //新增操作
          const {code} = await addCategroy(this.formData);
          if(code === 20000) {  //新增或修改成功
            this.$message.success("新增成功！");
            this.handleClose();  //关闭窗口
          }else {  //操作失败
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }
      }

    }

  }
</script>
