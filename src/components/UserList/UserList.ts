import Vue from "vue";
import Paginator from "../Paginator/Paginator.vue";
import UserFormModal from "../../components/Modal/UserForm/UserForm.vue";
import UserForm from "../UserForm/UserForm.vue";
import { IGithubUser } from "@/core/interfaces/IGithubUser";
import SearchBar from "../../components/SearchBar/SearchBar.vue";
import store from "@/store";

interface DataObject {
  users: IGithubUser[];
  showDialog: boolean;
  showEditPanel: boolean;
  selectedUser: IGithubUser | null;
  previousSelected: IGithubUser | null;
}

export default Vue.extend({
  name: "UserList",
  components: {
    Paginator,
    UserFormModal,
    UserForm,
    SearchBar,
  },
  data(): DataObject {
    return {
      showDialog: false,
      users: [],
      showEditPanel: false,
      selectedUser: null,
      previousSelected: null,
    };
  },
  methods: {
    openUserForm() {
      this.showDialog = true;
    },
    onSearch(users: IGithubUser[]) {
      this.users = users;
    },
    onSelect(user: IGithubUser) {
      user.selected = true;
      this.showEditPanel = false;
      setTimeout(() => {
        this.showEditPanel = true;
      }, 100);
      this.selectedUser = user;
      if (!this.previousSelected) {
        this.previousSelected = this.selectedUser;
      } else {
        if (this.previousSelected.id !== this.selectedUser.id) {
          this.previousSelected.selected = false;
          this.previousSelected = this.selectedUser;
        }
      }
      store.commit("onUserSelected", this.selectedUser);
    },
    onHideEditPanel() {
      this.showEditPanel = false;
    },
  },
  created() {
    this.showEditPanel = false;
    store.subscribe((mutation, state) => {
      const newUser: IGithubUser = {
        ...mutation.payload,
      };
      if (mutation.type === "onUserCreated") {
        this.users.push(newUser);
      }
    });
  },
});
