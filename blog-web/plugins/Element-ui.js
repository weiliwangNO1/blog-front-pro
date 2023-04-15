import Vue from 'vue';
import ElementUI from 'element-ui';

Vue.use(ElementUI);

/**
 * Nuxtjs引入element-ui
 * 1.在plugins目录下创建Element-ui.js文件
 * 2.在nuxt.config.js文件中的plugins属性中引入该文件并且指定该文件的目录，
 * 并且在build属性中天极爱transpile : [/^Element-ui/],
 * 3.在nuxt.config.js文件中的css属性中引入element-ui的组件样式和布局样式
 * css: [
 //引入全局样式
 //引入element-ui组件样式
 'element-ui/lib/theme-chalk/index.css',
 //引入element-ui布局样式
 'element-ui/lib/theme-chalk/display.css',
 ],
 *
 */
