import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _659c598c = () => interopDefault(import('..\\pages\\label\\index.vue' /* webpackChunkName: "pages/label/index" */))
const _ebbd6524 = () => interopDefault(import('..\\pages\\question\\index.vue' /* webpackChunkName: "pages/question/index" */))
const _1483d169 = () => interopDefault(import('..\\pages\\user\\index.vue' /* webpackChunkName: "pages/user/index" */))
const _47517942 = () => interopDefault(import('..\\pages\\article\\edit.vue' /* webpackChunkName: "pages/article/edit" */))
const _3c24701e = () => interopDefault(import('..\\pages\\question\\edit.vue' /* webpackChunkName: "pages/question/edit" */))
const _0f1b15b2 = () => interopDefault(import('..\\pages\\article\\_id.vue' /* webpackChunkName: "pages/article/_id" */))
const _49696218 = () => interopDefault(import('..\\pages\\label\\_id.vue' /* webpackChunkName: "pages/label/_id" */))
const _da405954 = () => interopDefault(import('..\\pages\\question\\_id.vue' /* webpackChunkName: "pages/question/_id" */))
const _3ef0bd14 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _55a44254 = () => interopDefault(import('..\\pages\\index\\_id.vue' /* webpackChunkName: "pages/index/_id" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/label",
    component: _659c598c,
    name: "label"
  }, {
    path: "/question",
    component: _ebbd6524,
    name: "question"
  }, {
    path: "/user",
    component: _1483d169,
    name: "user"
  }, {
    path: "/article/edit",
    component: _47517942,
    name: "article-edit"
  }, {
    path: "/question/edit",
    component: _3c24701e,
    name: "question-edit"
  }, {
    path: "/article/:id?",
    component: _0f1b15b2,
    name: "article-id"
  }, {
    path: "/label/:id",
    component: _49696218,
    name: "label-id"
  }, {
    path: "/question/:id",
    component: _da405954,
    name: "question-id"
  }, {
    path: "/",
    component: _3ef0bd14,
    name: "index",
    children: [{
      path: ":id?",
      component: _55a44254,
      name: "index-id"
    }]
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
