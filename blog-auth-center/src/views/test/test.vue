<template>
    <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            >
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item v-if="!userInfo" label="用户名">
                <el-input  v-model="formInline.username" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item v-if="!userInfo" label="姓名">
                <el-input v-model="formInline.nickName" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="审批人">
                <el-input v-model="formInline.user" placeholder="审批人"></el-input>
            </el-form-item>
            <el-form-item label="活动区域">
                <el-select v-model="formInline.region" placeholder="活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="backchilddata">查询</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
    export default {
        computed: {
            userInfo() {
                return this.$store.state.userInfo;
            }
        },
        created() {
            //auth.js文件作为store目录下index.js的模块，那么获取登录用户数据方式：this.$store.auth.userInfo
            debugger;
            this.formInline.username = this.$store.state.auth.userInfo.username;
            this.formInline.nickName = this.$store.state.auth.userInfo.nickName;
        },
        data() {
            return {
                dialogVisible : false,
                formInline: {
                    user: '',
                    region: '',
                    username : '',
                    nickName : '',
                }
            }
        },
        methods: {
            backchilddata() {
                //子组件向父组件传值
                if(this.formInline.user === "") {
                    this.$message.warning("请填写审批人！");
                    return false;
                }
                if(this.formInline.region === "") {
                    this.$message.warning("请选择活动区域！");
                    return false;
                }
                this.$emit("backchilddata", this.formInline);

            },
            init (item) {
                console.log("子组件获取数据：",item);
                this.dialogVisible = true;
            }
        }
    }
</script>

