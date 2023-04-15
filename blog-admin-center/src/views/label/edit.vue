<template>
  <!--新增或修改标签页面 -->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="400px"
    :before-close="handleClose">
    <!-- 新增或编辑表单-->
    <el-form :model="formData" :rules="rules"  ref="formData" label-width="100px" label-position="right"
             style="width: 300px;"  class="demo-ruleForm">
      <el-form-item label="标签名称" prop="name">
        <el-input v-model="formData.name" clearable ></el-input>
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryId">
        <el-select v-model="formData.categoryId"  filterable clearable >
          <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitForm('formData')">确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>

  import { addLabel, updateLabel } from '@/api/label.js'

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
      categoryList : {   //类别集合数据
        type : Array,
        default: [],
      },
      remoteClose: Function,  //关闭窗口方法
    },
    data() {
      return {
        rules: {   //表单数据校验，属性检查是一个数组
          name: [
            {required : true, message: '请输入标签名称', trigger: 'blur'}
          ],
          categoryId: [
            {required : true, message: '请选择类别名称', trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      handleClose() {   //关闭窗口
        this.$refs['formData'].resetFields();  //清空表单值
        this.remoteClose();  //关闭窗口
      },
      submitForm(formName) {  //提交新增或修改标签数据
        if(this.formData.id) {  //修改
          this.$refs[formName].validate((valid) => {
            if(valid) {  //修改操作校验通过
              updateLabel(this.formData).then(response => {
                const {code} = response;
                if(code === 20000) {  //更新成功
                  this.$message.success("更新成功！");
                  this.handleClose();  //关闭窗口
                }else {  //更新失败
                  this.$message.error("服务器繁忙，请稍后重试！");
                }
              }).catch(error => {
                console.log(error);
                this.$message.error("服务器繁忙，请稍后重试！");
                return false;
              });
            }else {  //修改操作校验不通过
              return false;
              //this.$message.error("服务器繁忙，请稍后重试！");
            }
          });
        }else {  //新增
          this.$refs[formName].validate((valid) => {
            if(valid) {  //新增操作校验通过
              addLabel(this.formData).then(response => {
                const {code} = response;
                if(code === 20000) {   //新增成功
                  this.$message.success("标签新增成功！");
                  this.handleClose();  //关闭窗口
                }else {  //新增不成功
                  this.$message.error("服务器繁忙，请稍后重试！");
                }
              }).catch(error => {
                console.log(error);
                this.$message.error("服务器繁忙，请稍后重试！");
                return false;
              })
            }else {  //校验不通过
              return false;
            }
          });
        }
      }
    }
  }
</script>
