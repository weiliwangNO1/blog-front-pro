<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    width="80%"
    :before-close="handleClose">

    <!-- 查看或审核文章-->
    <el-form :model="formData"  ref="formData" label-width="100px" label-position="right">
      <el-form-item label="标题" >
        <el-input v-model="formData.title" readonly ></el-input>
      </el-form-item>
      <el-form-item label="标签" >
        <!-- mulitiple标识可以多选，emitPath为false表示只返回节点值，后续是更改prop名称 -->
        <el-cascader
          disabled
          style="display: block"
          v-model="formData.labelIds"
          :options="labelOptions"
          :props="{ multiple: true , emitPath: false, value: 'id' , label: 'name', children: 'labelList' }"
          clearable></el-cascader>
      </el-form-item>
      <el-form-item label="主图" >
        <img :src="formData.imageUrl" class="avatar" style="width:178px; height:178px; display: block" />
      </el-form-item>
      <el-form-item label="是否公开" >
        <el-radio-group v-model="formData.ispublic" disabled>
          <el-radio :label="0">不公开</el-radio>
          <el-radio :label="1">公开</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="简介" prop="remark">
        <el-input type="textarea" maxlength="300" readonly
                  show-word-limit :autosize="{ minRows: 2, maxRows: 4}"
                   v-model="formData.summary"></el-input>
      </el-form-item>
      <el-form-item label="内容" >
        <!-- editable设置为不可编辑 -->
        <mavon-editor ref="md" v-model="formData.mdContent" :editable="false" />
      </el-form-item>
      <!-- isAudit为trur则展示 -->
      <el-form-item align="center" v-if="isAudit">
        <el-button type="primary" size="mini" @click="auditSuccess">审核通过</el-button>
        <el-button size="mini" type="info" @click="handleClose">关闭窗口</el-button>
        <el-button size="mini" type="danger" @click="auditFail">审核不通过</el-button>
      </el-form-item>
    </el-form>


  </el-dialog>
</template>

<script>

  import { getArticleById , auditSuccess, auditFail } from '@/api/article'

  import { getCategoryAndLabel } from '@/api/category';

  // 1. 引入 mavon-editor 组件与样式
  import { mavonEditor } from 'mavon-editor';
  import 'mavon-editor/dist/css/index.css';

  export default {
    components: {
      mavonEditor
    },
    props: {
      id : null,  //文章id
      isAudit: {  //true审核，false查看
        type : Boolean,
        default : true,  //默认审核
      },
      title: {   //标题
        type: String,
        default : '',
      },
      visible : {   //是否可见
        type : Boolean,
        default : false,
      },
      remoteClose: Function,  //关闭查看或审核窗口
    },
    watch: {
      visible(newVal, oldVal) {  //监听visible属性，当visible为true时调用获取文章数据
        if(newVal) {
          this.getLabelOptions();  //获取所有正常的分类和标签
          this.getArticle();  //通过文章id获取文章信息
        }
      }
    },
    data() {
      return {
        formData : {
          imageUrl : null,
        },  //表单数据
        labelOptions: [],  //显示级联选择器结果
      }
    },
    methods: {
      handleClose() {  //关闭窗口
        this.remoteClose(); //调用父组件关闭窗口
      },
      auditSuccess() {  //审核通过
        this.$confirm("确定该文章审核通过吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          auditSuccess(this.id).then(response => {
            const {code} = response;
            if(code === 20000) {  //审核通过
              this.$message.success("审核通过！");
              this.handleClose();  //关闭窗口
            }else {
              this.$message.error("服务器繁忙，请稍后重试！");
            }
          }).catch(error => {
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！");
          })
        })
      },
      auditFail() {  //审核不通过
        this.$confirm("确定该文章审核不通过吗?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          auditFail(this.id).then(response => {
            const {code} = response;
            if(code === 20000) {
              this.$message.success("操作成功！");
              this.handleClose();  //关闭窗口
            }else {
              this.$message.error("服务器繁忙，请稍后重试！");
            }
          }).catch(error => {
            console.log(error);
            this.$message.error("服务器繁忙，请稍后重试！");
          })
        })
      },
      async getArticle() {  //根据文章id获取文章信息
        const {code , data} = await getArticleById(this.id);
        if(code === 20000) {
          this.formData = data;
        }else {
          this.$message.error("服务器繁忙，请稍后重试！");
          this.handleClose();  //关闭窗口
        }
      },
      async getLabelOptions() {  //获取所有正常的分类和标签
        const {data} =  await getCategoryAndLabel();
        this.labelOptions = data;
      }
    }
  }
</script>
