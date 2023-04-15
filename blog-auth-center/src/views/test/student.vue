<template>
    <div>
        <el-row :gutter="20" style="margin:30px"   type="flex" justify="center">
            <el-col :span="24">
                <span>子组件接收数据次数：</span><el-tag type="success">{{count}}</el-tag>
            </el-col>
        </el-row>
        <el-row :gutter="20" style="margin:30px"   type="flex" justify="center">
            <el-col :span="6"><span>姓名</span></el-col>
            <el-col :span="6"><el-input
                    placeholder="请输入姓名"
                    v-model="name"
                    disabled
                    clearable>
            </el-input></el-col>
            <el-col :span="6"><span>年龄</span></el-col>
            <el-col :span="6"><el-input-number disabled v-model="age"  :min="1" :max="120" label=""></el-input-number></el-col>
        </el-row>
        <el-row :gutter="20" style="margin:30px" type="flex" justify="center">
            <el-col :span="6"><span>性别</span></el-col>
            <el-col :span="6"><el-radio-group disabled v-model="sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
            </el-radio-group></el-col>
            <el-col :span="6"><span>地址</span></el-col>
            <el-col :span="6"><el-input
                    disabled
                    placeholder=""
                    v-model="address"
                    clearable>
            </el-input></el-col>
        </el-row>
        <el-row :gutter="20" style="margin:30px" type="flex" justify="center">
            <el-col :span="6"><span>请输入内容</span></el-col>
            <el-col :span="18"><el-input
                    placeholder=""
                    v-model="edit.content"
                    clearable>
            </el-input></el-col>
        </el-row>
        <el-row :gutter="20" style="margin:30px" type="flex" justify="center">
            <el-col :span="24"><el-button  @click="editContent" type="success" round>提交</el-button></el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                count : 0,
                edit: {
                    content : '',
                }
            }
        },
        props: {
            name : {
                type : String,
                default : '',
            },
            age : {
              type : Number,
              default : 1,
            },
            sex : {
                type : Number,
                default : 1,
            },
            address : {
                type : String,
                default : '',
            },
        },
        methods: {
            editContent() {
                if(this.edit.content === "") {
                    this.$message.warning("请输入内容！");
                    return false;
                }
                debugger;
                //this.$message.success("提交内容：" + this.edit.content);
                this.$emit("studentdata", this.edit);
            }
        },
        watch:{
            age : function(newValue, oldValue) {
                console.log("年龄oldValue：", oldValue);
                console.log("年龄newValue：", newValue);
                this.count++;
            },
            sex : function(newValue , oldValue) {
                console.log("性别oldValue：", oldValue);
                console.log("性别newValue：", newValue);
                this.count++;
            }
        }
    }
</script>