<template>
    <div>
        <!-- 顶部内容 -->
        <layout-header></layout-header>

        <!-- 主体内容 -->
        <div class="mxg-main">
            <router-view></router-view>
        </div>

        <!-- 底部内容 -->
        <layout-footer></layout-footer>
    </div>

</template>


<script>
    import LayoutHeader from '@/components/layout/LayoutHeader/index.vue';
    import LayoutFooter from '@/components/layout/LayoutFooter/index.vue';

    export default {

        components: {
            LayoutHeader,
            LayoutFooter
        }
    }
</script>

<!-- scoped代表样式只在本页面有效 -->
<style scoped>
    .mxg-main {
        min-height: 450px;
        width: 100%;
    }
</style>