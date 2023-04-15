<template>
  <!-- 弹窗 :close-on-click-modal="false"点击遮罩层不关闭窗口 -->
  <div>
    <!--status-icon当表单检验不通过是，输入框右侧有个x小图标 -->
    <el-form ref="formData"
             :model="formData"
             :rules="rules"
             label-width="100px"
             label-position="right">
      <!-- el-form-item里的prop属性做校验数据使用 -->
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title"
                  placeholder="请输入文章标题" clearable
        maxlength="50" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="标签" prop="labelIds">
        <!-- :show-all-levels="false"仅显示最后一级， :fiterable="true"可搜索 -->
        <el-cascader
        :disabled="disabled"
        style="display:block"
        v-model="formData.labelIds"
        :options="lablelOptions"
        :show-all-levels="false"
        :props="{multiple:true,emitPath:false,children:'labelList', value: 'id', label:'name'}"
        :filterable="true"
        clearable>
        </el-cascader>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <!-- 主题内容 markdown是用全局配置，不用import手动引入
            autofocus不用自动获取焦点
        -->
        <mavon-editor :autofocus="false" ref="md" placeholder="请在此处新增问题"
                      v-model="formData.mdContent"
        @change="getMdHtml" @imgAdd="uploadContentImg"
                      @imgDel="delContentImg" >

        </mavon-editor>
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="submitForm('formData')">发布问题</el-button>
    </el-row>
  </div>
</template>

<script>
  export default  {

    middleware : 'auth', ////中间件权限拦截，如果用户没有登录，那么跳转到登录页面

    validate({query}) {   //校验query是否传递了编辑文章的id
      if(query.id) {  //校验问答id是否为数值
        return /^\d+$/.test(query.id);
      }else {
        return true;
      }
    },
    data() {
      const validatelabel = (rule, value, callback) => {  //校验标签
        //value获取输入框的值
        //如果value有数值，并且选择的数量不超过5个
        if(value && value.length > 5) {
          this.disabled = true;
          callback(new Error('最多可选5个标签'))
        }else {
          //校验通过，放行
          callback();
          this.disabled = false;
        }
      };
      const validateContent = (rule, value, callback) => {  //检验markdown内容是否为空
        //markdown获取的值，不是value，
        //如果mdContent和htmlContent值都不为空
        if( this.formData.mdContent && this.formData.htmlContent ) {
          callback();
        }else {
          //markdown没有输入内容
          callback(new Error('请输入文章内容'));
        }
      };
      return {
        formData : {
          userId : this.$store.state.userInfo.uid,
          userImage : this.$store.state.userInfo.imageUrl,
          nickName : this.$store.state.userInfo.nickName,
        }, //表单数据
        disabled: false,  //标签输入框默认可输入
        labelOptions: [],  // 标签下拉框
        rules : {
          title : [{required:true, message:'请输入标题', trigger:'blur'}],
          labelIds : [
            { required : true, message: '请选择标签', trigger: 'change' },
            { validator : validatelabel, trigger: 'change' },
          ],
          content : [{ validator : validateContent, trigger : 'change' }]
        }
      }
    },
    methods: {
      //提交该表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          //表单校验通过
          if(valid) {
            console.log(this.formData);
            this.submitData();
          }else {  //表单校验未通过
            return false;
          }
        })
      },
      async submitData() {     //调用新增或者更新问题接口
        //判断formData的id是否为空，如果为空是新增，不为空则为修改
        if(this.formData.id) {  //修改
          console.log("formData:", this.formData);
          const {code, data} = await  this.$updateQuestion(this.formData);
          if(code === 20000) {  //问题修改成功，跳转到问题详情界面
            this.$message.success("问题修改成功！");
            await this.$router.push(`/question/${data}`);
          }else {  //问题修改失败
            this.$message.error("问题修改失败，请重试！");
          }
        }else {  //新增
          const {code, data} = await this.$addQuestion(this.formData);
          if(code === 20000) {  //新增问题成功
            this.$message.success("新增问题成功！");
            //跳转到问题详情页
            await this.$router.push(`/question/${data}`);
          }else {  //新增问题失败
            this.$message.error("服务器繁忙，请稍后重试！");
          }
        }
      },
      uploadImg(file) {  //上传图片 file为文件对象
        console.log("上传图片:", file);
        const data = new FormData();
        data.append("file", file.file);  //追加文件
        this.$uploadImg(data).then(response => {
            const { code, data} = response;  //获取保存后的图片url和状态
            if(code === 20000) {  //上传成功
              //调用删除图片功能，删除上一次上传的图片
              this.deleteImg();
              this.formData.imageUrl = data;  //新保存的图片路径地址重新赋值
            }else {  //上传失败
              this.$message.error("图片上传失败！，请重试！");
              return false;
            }
        }).catch(error => {
            console.log("上传图片错误：", error);
            this.$message.error("图片上传失败！请重试！");
        });
      },
      deleteImg() {  //删除图片，上传成功和关闭窗口调用删除上一次上传的图片
        if(this.formData.imageUrl) {  //如果图片路径不为空
          this.$deleteImg(this.formData.imageUrl).then(response => {
            const {code} = response;
            if(code !== 20000) {  //删除成功
              this.$message.error("删除图片失败！");
            }
          }).catch(error => {
            console.log("删除图片：", error);
            this.$message.error("删除图片失败！");
          });
        }
      },
      //mdContent: md内容 htmlContent:转成后的html内容
      getMdHtml(mdContent, htmlContent) {
        console.log("mdContent", mdContent);
        console.log("htmlContent", htmlContent);
        this.formData.mdContent = mdContent;
        this.formData.htmlContent = htmlContent;
      },
      //上传内容图片（第一个参数图片位置编号，file文件对象）
      uploadContentImg(pos, file) {
        //console.log("上传图片内容", file);
        //将图片上传到服务器
        let fd = new FormData();
        fd.append("file", file);
        this.$uploadImg(file).then(response => {
          const {code, data} = response;
          if(code === 20000) {
            //this.$message.success("图片上传成功！");
            //将图片回显到图片原来的位置，data为服务器图片路径地址
            this.$refs.md.$img2Url(pos, data);
          }
        }).catch(error => {
          console.log("markdown上传图片", error);
        });
      },
      //删除内容图片
      delContentImg(urlAndFileArr) {
        const fileUrl = urlAndFileArr[0];  //文件URL
        const file = urlAndFileArr[1];  //file对象
        //console.log("删除内容图片", fileUrl, file);
        this.$deleteImg(fileUrl);
      }
    },
    async asyncData({app, query}) {
      //获取所有的正常的分类和标签
      const {data : lablelOptions} = await app.$getCategoryAndLabel();
      if(query.id) {  //如果参数问答Id不为空，那么调用后台获取问答数据
        const {data: formData} = await app.$getQuestionById(query.id)
        return {lablelOptions, formData};
      }
      //后续是新增文章返回的数据
      return {lablelOptions};
    }
  }
</script>

<style >
  /* 样式布局只在本页有效 */
  .avatar-uploader .el-upload {
    border: 2px dashed #d9d9d9;
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
