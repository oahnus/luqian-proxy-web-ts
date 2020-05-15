import Vue from 'vue';
import Vuex from 'vuex';

import AuthModule from './Auth'
import AppTableModule from './AppTable'

Vue.use(Vuex);

export default new Vuex.Store({

  modules: {
    AuthModule,
    AppTableModule
  },
});
