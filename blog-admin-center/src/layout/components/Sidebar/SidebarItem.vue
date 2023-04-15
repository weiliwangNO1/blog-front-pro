<template>
  <div >
    <!-- 没有子菜单，即只有一级菜单，item 每个菜单对象 -->
    <template v-if=" !item.children || item.children.length === 0 ">
      <!-- :to="item.url" 请求路径, -->
      <app-link :to="item.url">
        <!-- index 唯一标识，class 样式 class="submenu-title-noDropdown"
        :class="{'submenu-title-noDropdown':!isNest}" -->
        <el-menu-item :index="item.url"
                      :class="{'submenu-title-noDropdown':!isNest}"
        >
          <!-- 引用了当前目录下的 item.vue 组件
          icon菜单图标，title菜单名称 -->
          <item :icon="item.icon" :title="item.name" />
        </el-menu-item>
      </app-link>
    </template>

    <!-- 有子菜单，index请求地址 -->
    <el-submenu v-else :index="item.id" >
      <!-- slot=”title"标识它下面是一级菜单名称 -->
      <template slot="title">
        <item :icon="item.icon" :title="item.name" />
      </template>
      <!-- 子菜单，再次引用自身组件, is-nest 显示箭头 V -->
      <sidebar-item v-for="child in item.children" :key="child.id" :item="child"
                    :is-nest="true" class="nest-menu"
      />
    </el-submenu>

  </div>
</template>

<script>
  import path from 'path'
  import { isExternal } from '@/utils/validate'
  import Item from './Item'
  import AppLink from './Link'
  import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
// route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  }
}
</script>
