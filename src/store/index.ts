import { IGithubUser } from "@/core/interfaces/IGithubUser";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

interface StateObject {
  users: IGithubUser[];
}

export default new Vuex.Store({
  state(): StateObject {
    return {
      users: []
    }
  },
  mutations: {
    onUserCreated(state: StateObject, user: IGithubUser) {
      state.users.push(user);
    }
  },
  actions: {},
  modules: {}
});
