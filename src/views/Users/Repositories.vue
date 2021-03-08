<template>
  <RepositoryList v-bind:repositories="repositories" />
</template>

<style lang="scss" scoped></style>

<script lang="ts">
import Vue from "vue";
import RepositoryList from "../../components/RepositoryList/RepositoryList.vue"; // @ is an alias to /src
import { IUserRepository } from "@/core/interfaces/IUserRepository";

interface DataObject {
  repositories: IUserRepository[];
}

export default Vue.extend({
  name: "Repositories",
  components: {
    RepositoryList,
  },
  data(): DataObject {
    return {
      repositories: [],
    };
  },
  methods: {
    onSearch(repositories: IUserRepository[]) {
      this.repositories = repositories;
    },
  },
});
</script>
