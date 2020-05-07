import Vue from 'vue';
// @ts-ignore
import App from './App.vue';
import router from './router';
import store from './store';
import http from '@/utils/http'
import urls from '@/utils/urls'
import notify from '@/utils/notify'
import VueRouter, {RawLocation} from 'vue-router'

import {
  Button,
  Form, FormItem, Input,
  Message, Loading,
  RadioGroup, RadioButton,
  Drawer, Dropdown, DropdownMenu, DropdownItem, Submenu,
  Menu, MenuItem, MenuItemGroup,
  Table, TableColumn
} from 'element-ui'

Vue.use(Button).use(RadioButton).use(RadioGroup)
  .use(Form).use(FormItem).use(Input)
  .use(Table).use(TableColumn)
  .use(Menu).use(MenuItem).use(MenuItemGroup).use(Submenu)
  .use(Dropdown).use(DropdownItem).use(DropdownMenu)
  .use(Drawer)

Vue.prototype.$message = Message;
Vue.prototype.$http = http;
Vue.prototype.$urls = urls;
Vue.prototype.$notify = notify;
Vue.config.productionTip = false;

// 装饰器 扩展vue-router的push和replace方法, 解决NavigationDuplicated error
const originalPush = VueRouter.prototype.push;
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.push = function push(location: RawLocation) {
  // @ts-ignore
  return originalPush.call(this, location).catch((err: any) => err);
};
VueRouter.prototype.replace = function replace(location: RawLocation) {
  // @ts-ignore
  return originalReplace.call(this, location).catch((err: any) => err);
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
