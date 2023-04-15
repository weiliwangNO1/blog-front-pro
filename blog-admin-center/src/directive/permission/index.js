import store from '@/store'
export default {
// 指令钩子
  inserted(el, binding) {
    const { value } = binding
// 用户拥有的所有权限按钮
    const buttonList = store.getters && store.getters.buttonList
    if (value) {
// some 遇到 return true 就是终止遍历
      const hasPermission = buttonList.some(button => {
        return value === button
      })
// 无权限则移除元素
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`需要指定权限标识！如 v-permission="article:add"`)
    }
  }
}
