import Vue from 'vue';
import Vuex from 'vuex';

import AuthModule from './Auth'

Vue.use(Vuex);


export default new Vuex.Store({

  modules: {
    AuthModule
  },
});
