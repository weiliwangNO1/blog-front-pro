<template>
  <!--新增或编辑广告 -->
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="700px"
    :before-close="handleClose">
    <!-- 新增或编辑表单-->
    <el-form :model="formData" :rules="rules"  ref="formData" label-width="100px" label-position="right"
              class="demo-ruleForm">
      <el-form-item label="广告图片" prop="imageUrl">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="uploadMainImg"
          >
          <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="广告标题" prop="title">
        <el-input v-model="formData.title" clearable ></el-input>
      </el-form-item>
      <el-form-item label="广告链接" prop="advertUrl">
        <el-input v-model="formData.advertUrl" clearable ></el-input>
      </el-form-item>
      <el-form-item label="跳转方式" prop="advertTarget">
        <el-select v-model="formData.advertTarget" clearable style="width: 560px">
          <el-option
            v-for="item in advertTargetList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="广告位置" prop="position">
        <el-input-number v-model="formData.position" style="width: 560px"  :min="1" :max="2" ></el-input-number>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">正常</el-radio>
          <el-radio :label="0">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="优先级" prop="sort">
        <el-input-number v-model="formData.sort" style="width: 560px" :min="1" :max="100" ></el-input-number>
      </el-form-item>
      <el-form-item align="center">
        <el-button type="primary" size="mini" @click="submitForm('formData')">确定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>

<script>
  import {addCategroy, updateCategory} from "@/api/category";

  import { uploadImg, deleteImg } from '@/api/common';

  import { addAdvert, updateAdvert} from '@/api/advert'

  const advertTargetList = [  //广告跳转方式数组
    {'label' : '新窗口打开', 'value' : '_blank'},
    {'label' : '当前窗口打开', 'value' : '_self'},
  ]

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
      oldImageUrl: String, // 点击编辑时，查询出来的原始图片
      remoteClose : Function,  //用于关闭窗口
    },
    data() {
      return {
        rules : {  //表单校验规则
          imageUrl: [   //广告图片
            {required: true, message : '请上传广告图片', trigger: 'blur'}
          ],
          title: [
            {required : true, message: '请填写广告标题', trigger: 'blur'}
          ],
          advertUrl: [
            {required : true, message: '请填写广告链接', trigger: 'blur'}
          ],
          advertTarget : [
            {required : true, message: '请选择广告跳转方式', trigger: 'change'}
          ],
          position: [
            {required : true, message: '请选择广告位置', trigger: 'blur'}
          ],
          status: [
            {required : true, message: '请选择广告状态', trigger: 'change'}
          ],
          sort: [
            {required: true, message: '请选择广告优先级', trigger: 'blur'}
          ]
        },
        advertTargetList,  //广告跳转方式数组
      }
    },
    methods: {
      uploadMainImg(file) {  //上传广告图片
        //console.log("上传文件：", file);
        //封装表单对象
        const data = new FormData();
        data.append('file', file.file);
        //上传图片
        uploadImg(data).then(response => {
          //console.log(response)
          // 以防图片多次上传，上传成功后，把原来的图片删除
          this.deleteImg();  //上传后，删除之前的图片
          this.formData.imageUrl = response.data;  //然后新的图片url重新赋值
        }).catch(() => {
          this.$message.error("图片上传失败！")
        })
      },
      deleteImg() {  //上传成功后，删除之前的图片
        //防止图片上传后，表单没有提交，这样就不能把进入修改页面时最初的图片删除
        //如果删除了下次再点击修改，就找不到图片了
        if(this.formData.imageUrl && this.formData.imageUrl !== this.oldImageUrl) {
          //两者图片不相同，那么就删除原来的图片
          deleteImg(this.formData.imageUrl);
        }
      },
      submitForm(formData) {  //提交表单
        this.$refs[formData].validate((valid) => {
          if(valid) {   //校验通过
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
      async submitData() {   //提交新增或修改广告信息
        if(this.formData.id) {  //如果id存在，那么是修改
          const {code} = await updateAdvert(this.formData);
          if(code === 20000) {  //如果修改成功
            this.$message.success("广告修改成功！");
            this.handleClose();  //关闭窗口
          }else {  //修改失败
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }else {  //新增操作
          const {code} = await addAdvert(this.formData);
          if(code === 20000) {  //新增或修改成功
            this.$message.success("广告新增成功！");
            this.handleClose();  //关闭窗口
          }else {  //操作失败
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }
      }

    }
  }
</script>


<style >
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
