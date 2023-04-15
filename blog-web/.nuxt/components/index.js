export { default as NuxtLogo } from '../..\\components\\NuxtLogo.vue'
export { default as Tutorial } from '../..\\components\\Tutorial.vue'
export { default as ArticleList } from '../..\\components\\article\\List.vue'
export { default as LayoutFooter } from '../..\\components\\layout\\Footer.vue'
export { default as LayoutHeader } from '../..\\components\\layout\\Header.vue'
export { default as QuestionList } from '../..\\components\\question\\List.vue'
export { default as UserEdit } from '../..\\components\\user\\Edit.vue'
export { default as UserPassword } from '../..\\components\\user\\Password.vue'
export { default as CommonAffix } from '../..\\components\\common\\Affix\\index.vue'
export { default as CommonComment } from '../..\\components\\common\\Comment\\index.vue'
export { default as CommonCommentList } from '../..\\components\\common\\Comment\\List.vue'
export { default as CommonDirectory } from '../..\\components\\common\\Directory\\index.vue'

// nuxt/nuxt.js#8607
function wrapFunctional(options) {
  if (!options || !options.functional) {
    return options
  }

  const propKeys = Array.isArray(options.props) ? options.props : Object.keys(options.props || {})

  return {
    render(h) {
      const attrs = {}
      const props = {}

      for (const key in this.$attrs) {
        if (propKeys.includes(key)) {
          props[key] = this.$attrs[key]
        } else {
          attrs[key] = this.$attrs[key]
        }
      }

      return h(options, {
        on: this.$listeners,
        attrs,
        props,
        scopedSlots: this.$scopedSlots,
      }, this.$slots.default)
    }
  }
}
