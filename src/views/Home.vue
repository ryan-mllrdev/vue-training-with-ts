<template>
  <div class="tab2Container">
    <SearchBar searchBarTitle="SEARCH: " @onSearch="onSearch($event)" />
    <UserList v-bind:users="users" />
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import Vue from "vue";
import SearchBar from "../components/SearchBar/SearchBar.vue"; // @ is an alias to /src
import UserList from "../components/UserList/UserList.vue"; // @ is an alias to /src
import { IGithubUser } from "@/core/interfaces/IGithubUser";

interface DataObject {
  users: IGithubUser[];
}

export default Vue.extend({
  name: "Home",
  components: {
    SearchBar,
    UserList,
  },
  data(): DataObject {
    return {
      users: [],
    };
  },
  methods: {
    onSearch(users: IGithubUser[]) {
      this.users = users;
    },
  },
});
</script>
