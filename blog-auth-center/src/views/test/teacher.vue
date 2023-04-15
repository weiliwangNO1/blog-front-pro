<template>
    <div>
        <el-row :gutter="20" style="margin:30px"  type="flex" justify="center">
            <el-col :span="6"><span>姓名</span></el-col>
            <el-col :span="6"><el-input
                    placeholder="请输入姓名"
                    v-model="teacher.name"
                    clearable>
            </el-input></el-col>
            <el-col :span="6"><span>年龄</span></el-col>
            <el-col :span="6"><el-input-number v-model="teacher.age"  :min="1" :max="120" label=""></el-input-number></el-col>
        </el-row>
        <el-row :gutter="20" style="margin:30px" type="flex" justify="center">
            <el-col :span="6"><span>性别</span></el-col>
            <el-col :span="6"><el-radio-group v-model="teacher.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="0">女</el-radio>
            </el-radio-group></el-col>
            <el-col :span="6"><span>地址</span></el-col>
            <el-col :span="6"><el-input
                    placeholder="请输入地址"
                    v-model="teacher.address"
                    clearable>
            </el-input></el-col>
        </el-row>
        <el-divider content-position="left">以下是子组件</el-divider>
        <div style="margin-top: 30px">
            <student-child  @studentdata="studentdata" :name="teacher.name" :age="teacher.age" :sex="teacher.sex" :address="teacher.address" ></student-child>
        </div>
    </div>
</template>

<script>

    import studentChild from '@/views/test/student';

    export default {
        components: {
            studentChild
        },
        data() {
            return {
                teacher: {
                    name : '',
                    age : 1,
                    sex : 1,
                    address : '',
                }
            }
        },
        methods: {
            studentdata(edit) {
                debugger;
                console.log("子组件返回给父组件的内容：", edit.content);
               this.$message.success("子组件返回给父组件的内容：" + edit.content);
            },
        }
    }
</script>