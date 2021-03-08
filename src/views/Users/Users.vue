<template>
  <div class="tab2Container">
    <SearchBar searchBarTitle="SEARCH: " @onSearch="onSearch($event)" />
    <UserList :users="users" />
  </div>
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import Vue from "vue";
import SearchBar from "../../components/SearchBar/SearchBar.vue";
import UserList from "../../components/UserList/UserList.vue";
import { IGithubUser } from "@/core/interfaces/IGithubUser";

interface DataObject {
  users: IGithubUser[];
}

export default Vue.extend({
  name: "Users",
  components: {
    SearchBar,
    UserList
  },
  data(): DataObject {
    return {
      users: []
    };
  },
  methods: {
    onSearch(users: IGithubUser[]) {
      this.users = users;
    }
  }
});
</script>
