<template>
    <!-- 顶部区域 -->
    <div class="mxg-header">
        <div class="logo">
            <a href="//blog.weiliwang.top" title="维利博客门户网">
                <img src="@/assets/image/blog1.png" height="50px">
            </a>
        </div>
    </div>
</template>

<!-- scoped代表样式只在本页面有效 -->
<style scoped>
    .mxg-header {
        width: 100%;
        height: 80px;
        border-top: 3px solid #345DC2;
        z-index:10;
    }

    .logo {
        width:1200px;
        margin:0 auto; /* 居中 */
        overflow: hidden;
        margin-top: 15px;
    }
</style>