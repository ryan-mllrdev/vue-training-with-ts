import Vue from "vue";
import Paginator from "../Paginator/Paginator.vue";
import UserFormModal from "../../components/Modal/UserForm/UserForm.vue";
import UserForm from "../UserForm/UserForm.vue";
import { IGithubUser } from "@/core/interfaces/IGithubUser";
import SearchBar from "../../components/SearchBar/SearchBar.vue";
import store from "@/store";

type IUser = IGithubUser & { selected: boolean };

interface DataObject {
  users: IUser[];
  showDialog: boolean;
  showEditPanel: boolean;
  selectedUser: IUser | null;
  previousSelected: IUser | null;
  baseApiURL: string;
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
      baseApiURL: process.env.VUE_APP_API_URL,
    };
  },
  methods: {
    openUserForm() {
      this.showDialog = true;
    },
    onSearch(users: IUser[]) {
      this.users = users;
    },
    onSelect(user: IUser) {
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
      const newUser: IUser = {
        ...mutation.payload,
      };
      if (mutation.type === "onUserCreated") {
        this.users.push(newUser);
      }
    });
  },
});
