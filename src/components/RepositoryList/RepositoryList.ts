import { IUserRepository } from "@/core/interfaces/IUserRepository";
import axios from "axios";
import Vue from "vue";

interface DataObject {
  repositories: IUserRepository[];
  currentUser: string;
}

export default Vue.extend({
  name: "RepositoryList",
  data(): DataObject {
    return {
      repositories: [],
      currentUser: "",
    };
  },
  methods: {
    getUserRepositories(user: string) {
      axios
        .get(`https://api.github.com/users/${user}/repos`)
        .then((response) => {
          this.repositories = response.data;
        });
    },
  },
  created() {
    this.getUserRepositories((this.currentUser = this.$route.params.id));
  },
});
