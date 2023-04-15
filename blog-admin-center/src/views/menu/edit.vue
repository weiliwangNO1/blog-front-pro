<template>
  <!--新增或修改菜单 -->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="500px"
    :before-close="handleClose">
    <!-- 新增或编辑表单-->
    <el-form :model="formData"  :rules="rules" ref="formData" label-width="100px" label-position="right"
             style="width: 400px;"  class="demo-ruleForm">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="formData.type">
          <el-radio :label="1">目录</el-radio>
          <el-radio :label="2">菜单</el-radio>
          <!-- 如果parentId为0，那么不显示按钮 -->
          <el-radio :label="3"  v-if="formData.parentId !== 0">按钮</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="formData.name" style="width: 300px;" clearable ></el-input>
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" style="width: 300px;" clearable ></el-input>
      </el-form-item>
      <!--如果新增类型tyep为3,按钮时，不显示请求地址和图标一栏 -->
      <el-form-item label="请求地址" prop="url" v-if="formData.type !== 3">
        <el-input v-model="formData.url" style="width: 300px;" clearable ></el-input>
      </el-form-item>
      <el-form-item label="图标" prop="icon" v-if="formData.type !== 3">
        <!--<el-input v-model="formData.icon" style="width: 300px;" clearable ></el-input>-->
        <icon-picker v-model="formData.icon"  style="width: 300px;"  ></icon-picker>
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

  import { addMenu, updateMenu } from '@/api/menu'

  export default {
    props: {
      title : {
        type : String,
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
    components: {

    },
    data() {
      return {
        rules: {
          type: [
            {required : true, message: '请选择类型', trigger: 'change'}
          ],
          name: [
            {required : true, message: '请填写名称', trigger: 'blur'}
          ],
          code: [
            {required : true, message: '请填写权限标识', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      handleClose() {   //关闭窗口
        this.$refs['formData'].resetFields();  //清空表单值
        this.remoteClose();  //关闭窗口
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {  //校验表单
          if(valid) {  //校验通过
            //如果选择type类型为3，按钮类型，那么需要清除请求地址url和图标icon
            if(this.formData.type === 3) {
              this.formData.url = '';  //清除请求地址
              this.formData.icon = '';  //清除图标
            }
            this.submitData();  //提交数据
          }else {  //校验不通过
            return false;
          }
        })
      },
      async submitData() {  //提交数据
        if(this.formData.id) {  //修改菜单操作
          const {code} = await updateMenu(this.formData);
          if(code === 20000) {  //修改成功
            this.$message.success("修改成功！");
            this.handleClose();  //关闭窗口
          }else {
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }else {  //新增菜单操作
          const {code} = await addMenu(this.formData);
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
