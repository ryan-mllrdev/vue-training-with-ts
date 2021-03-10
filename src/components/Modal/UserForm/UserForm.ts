import { IGithubUser } from "@/core/interfaces/IGithubUser";
import store from "@/store";
import axios from "axios";
import Vue from "vue";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
} from "vuelidate/lib/validators";

interface DataObject {
  showDialog: boolean;
  user: IGithubUser | null;
  sending: boolean;
}

export default Vue.extend({
  name: "UserForm",
  mixins: [validationMixin],
  data(): DataObject {
    return {
      showDialog: false,
      user: {
          id: 0,
          avatarUrl: null,
          login: null,
          reposUrl: null,
          url: null,
      },
      sending: false,
    };
  },
  validations: {
    user: {
      login: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(20)
      },
    },
  },
  methods: {
    showUserForm() {
      this.showDialog = true;
    },
    closeUserForm() {
      this.showDialog = false;
    },
    save() {
      console.log("Saving...");
      this.showDialog = false;
    },
    getValidationClass(fieldName: string) {
      const field = this.$v.user[fieldName];

      if (field) {
        return {
          "md-invalid": field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.user!.login = null;
      this.user!.avatarUrl = null;
      this.user!.reposUrl = null;
      this.user!.url = null;
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
    saveUser() {
      this.sending = true;
      axios.post('http://localhost:3000/user', this.user).then(response => {
        // console.log(response);
        this.sending = false;
        this.clearForm();
        store.commit('onUserCreated', response.data);
      }).catch(error => {
          console.log(error);
      });
    },
  },
});
