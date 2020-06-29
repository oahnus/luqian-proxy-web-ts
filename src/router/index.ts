import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'Welcome',
    meta: {
      showSideBar: false,
    },
    component: () => import(/* webpackChunkName: "welcome" */ '../views/Welcome.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      showSideBar: true,
    },
    component: () => import(/* webpackChunkName: "dashboard" */ '../views/Dashboard.vue'),
  },
  {
    path: '/application',
    name: 'Application',
    meta: {
      showSideBar: true,
    },
    component: () => import(/* webpackChunkName: "appTable" */ '../views/AppTable/AppTable.vue'),
  },
  {
    path: '/proxy',
    name: 'Proxy',
    meta: {
      showSideBar: true,
    },
    component: () => import(/* webpackChunkName: "proxyTable" */ '../views/ProxyTable/ProxyTable.vue'),
  },
  {
    path: '/version',
    name: 'Version',
    meta: {
      showSideBar: false,
    },
    component: () => import(/* webpackChunkName: "version" */ '../views/Version.vue'),
  },
  {
    path: '/domain',
    name: 'Domain',
    meta: {
      showSideBar: true,
    },
    component: () => import(/* webpackChunkName: "version" */ '../views/Domain/DomainTable.vue'),
  },
  {
    path: '/about',
    name: 'About',
    meta: {
      showSideBar: false,
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
