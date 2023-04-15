<template>
    <div>
        <!-- 弹窗 -->
        <div v-show="visiable">
            <!-- 这里展示内容层 -->
            <div class="content">
                <span v-html="message"></span>
            </div>
            <!-- 半透明背景层-->
            <div class="over"></div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                visiable : true,
                message : "请稍等，正在重新进行身份认证....",
                redirectURL : null,   //
            }
        },
        created() {
            //获取页面跳转的重定向地址
            this.redirectURL = this.$route.query.redirectURL || '/';
            this.refreshLogin();
        },
        methods: {
            //刷新令牌，重新登录
            refreshLogin() {
                this.$store.dispatch("UserRefreshToken").then(response => {
                    //成功获取了刷新令牌，那么跳转
                    alert("成功重新获取令牌！");
                    if(this.redirectURL !== '/') {
                        window.location.href = this.redirectURL;
                    }else {  //如果redirectURL没有值，那么重新跳转导登录页
                        window.location.href = '/';
                    }
                }).catch(error => {  //获取刷新令牌失败或者没有刷新令牌
                    if(this.redirectURL !== '/') {
                        this.message = '您的身份信息已过期，请<a href="/?redirectURL=${this.redirectURL}" >重新登录</a>';
                    }else {
                        this.message = '您的身份信息已过期，请<a href="/" >重新登录</a>';
                    }
                });
            }
        }
    }
</script>


<!-- 样式仅对当前页面有效-->
<style scoped>

    .content {
        position: fixed;
        height: 120px;
        width: 500px;
        line-height: 120px;
        text-align: center;
        font-size: 19px;
        color: #303133;
        background-color: #fff;
        border-radius: 0.25rem;
        left: 50%;
        top: 30%;
        transform: translate(-50%, -50%);
        z-index: 1000;
    }
    a {
        color: #345dc2;
        text-decoration: none;
    }
    a:hover {
        text-decoration: underline;
    }
    .over {
        position: fixed;
        width: 100%;
        height: 100%;
        opacity: 0.5; /* 透明度为50% */
        filter: alpha(opacity=50);
        top: 0;
        left: 0;
        z-index: 999;
        background-color: #000;
    }

</style>