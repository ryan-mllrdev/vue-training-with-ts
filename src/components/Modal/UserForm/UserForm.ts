import Vue from "vue";
import UserForm from "../../UserForm/UserForm.vue";

interface DataObject {
  showDialog: boolean;
}

export default Vue.extend({
  name: "UserFormModal",
  components: {
    UserForm,
  },
  data(): DataObject {
    return {
      showDialog: false,
    };
  },
  methods: {
    showUserForm() {
      this.showDialog = true;
    },
    closeUserForm() {
      this.showDialog = false;
    },
  },
});
