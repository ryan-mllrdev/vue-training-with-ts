import { IGithubUser } from "@/core/interfaces/IGithubUser";
import store from "@/store";
import axios from "axios";
import Vue from "vue";
import { PropType } from "vue/types/options";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";

interface DataObject {
  user: IGithubUser | null;
  sending: boolean;
  formData: FormData | null;
  file: string;
  previewImageUrl: string;
  baseApiURL: string;
  saved: boolean;
}

export default Vue.extend({
  name: "UserForm",
  mixins: [validationMixin],
  props: {
    edit: Boolean,
    selectedUser: {
      type: Object as PropType<IGithubUser>,
    },
  },
  data(): DataObject {
    return {
      user: {
        id: 0,
        avatarUrl: "",
        login: "",
        reposUrl: "",
        url: "",
      },
      sending: false,
      formData: null,
      file: "",
      previewImageUrl: "",
      baseApiURL: process.env.VUE_APP_API_URL,
      saved: false
    };
  },
  validations: {
    user: {
      login: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(20),
      },
    },
  },
  methods: {
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
      this.user!.login = "";
      this.user!.avatarUrl = "";
      this.user!.reposUrl = "";
      this.user!.url = "";
      this.saved = false;
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },
    saveUser() {
      this.saved = false;
      this.sending = true;
      const {
        login,
        firstName,
        surName,
        url,
        avatarUrl,
        reposUrl,
        password,
      } = this.user!;
      const currentUser = {
        login,
        firstName,
        surName,
        url,
        avatarUrl,
        reposUrl,
        password,
      };
      console.log(currentUser);
      setTimeout(() => {
        if (this.edit) {
          // Function to update a user detail
          const updateUser = () => {
            axios
              .put(`${this.baseApiURL}/users/${this.user?.id}`, currentUser)
              .then((response) => {
                this.sending = false;
                this.saved = true;
              });
          };

          // Check if image has changed
          if (this.previewImageUrl) {
            this.uploadFile()
              .then((response) => {
                this.previewImageUrl = "";
                this.file = "";
                this.selectedUser.avatarUrl = currentUser.avatarUrl =
                  response.data;
                this.user = this.selectedUser;
                updateUser(); // Update the user after saving the image
              })
              .catch((error) => {
                console.log(error);
              });
          } else {
            updateUser();
          }
        } else {
          axios
            .post(`${this.baseApiURL}/users`, currentUser)
            .then((response) => {
              this.sending = false;
              this.clearForm();
              store.commit("onUserCreated", response.data);
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }, 2000);
    },
    closeUserForm() {
      this.$emit("onCloseDialog");
    },
    onSelectFile(event: any) {
      const file = event.target.files[0];
      this.previewImageUrl = URL.createObjectURL(file);

      this.formData = new FormData();
      this.formData.append("body", JSON.stringify(this.selectedUser));
      this.formData.append("file", file);
    },
    async uploadFile() {
      this.sending = true;
      return await axios.post(`${this.baseApiURL}/upload`, this.formData);
    },
    onChooseFile() {
      ((this.$refs.file as Vue).$el as HTMLElement).click();
    },
  },
  created() {
    store.subscribe((mutation, state) => {
      if (mutation.type === "onUserSelected") {
        this.user = mutation.payload;
      }
    });
  },
});
