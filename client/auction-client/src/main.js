import Vue from 'vue';
import App from './App.vue';
import Home from './Home.vue';
import Users from './Users.vue';
import Auctions from './Auctions.vue';

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import VueResource from 'vue-resource';
Vue.use(VueResource);

import VueCookies from 'vue-cookies';
Vue.use(VueCookies);


const routes = [
  {
      path: "/",
      name:"home",
      component: Home
  },
  {
    path: "/user/:userId",
    name: "user",
    component: Users
  },
  {
    path: "/login",
    name: "login",
    component: Users
  },
  {
    path: "/register",
    name: "register",
    component: Users
  },

  {
    path: "/auctions",
    name: "auctions",
    component: Auctions
  },
  {
    path: "/auctions/:auctionId",
    name: "auction",
    component: Auctions
  },
  {
    path: "/createAuction",
    name: "createAuction",
    component: Auctions
  }
];

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
