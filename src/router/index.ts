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
    component: () => import(/* webpackChunkName: "about" */ '../views/Welcome.vue'),
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: {
      showSideBar: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/Dashboard.vue'),
  },
  {
    path: '/application',
    name: 'Application',
    meta: {
      showSideBar: true,
    },
    component: () => import(/* webpackChunkName: "about" */ '../views/AppTable.vue'),
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
