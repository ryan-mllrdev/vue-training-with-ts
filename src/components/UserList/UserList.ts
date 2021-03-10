import Vue from "vue";
import Paginator from "../Paginator/Paginator.vue";
import UserForm from "../../components/Modal/UserForm/UserForm.vue";
import { IGithubUser } from "@/core/interfaces/IGithubUser";
import SearchBar from "../../components/SearchBar/SearchBar.vue";
import store from "@/store";

interface DataObject {
  users: IGithubUser[];
  showDialog: boolean;
}

export default Vue.extend({
  name: "UserList",
  components: {
    Paginator,
    UserForm,
    SearchBar
  },
  data (): DataObject {
    return {
      showDialog: false,
      users: []
    }
  },
  methods: {
    openUserForm() {
      this.showDialog = true;
    },
    onSearch(users: IGithubUser[]) {
      this.users = users;
    },
  },
  created () {
    store.subscribe((mutation, state) => {
      const newUser: IGithubUser = {
        ...mutation.payload
      };
      if (mutation.type === 'onUserCreated') {
        this.users.push(newUser);
      }
    })
  }
});
