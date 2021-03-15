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
        avatarUrl: null,
        login: null,
        reposUrl: null,
        url: null,
      },
      sending: false,
      formData: null,
      file: "",
      previewImageUrl: "",
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
      setTimeout(() => {
        if (this.edit) {
          axios
            .put(`http://localhost:3000/user/${this.user?.id}`, this.user)
            .then((response) => {
              this.sending = false;
            });
        } else {
          axios
            .post("http://localhost:3000/user", this.user)
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
      this.previewImageUrl =  URL.createObjectURL(file);

      this.formData = new FormData();
      this.formData.append("body", JSON.stringify(this.selectedUser));
      this.formData.append("file", file);
    },
    onUploadFile() {
      this.sending = true;
      axios
        .post("http://localhost:3000/upload", this.formData)
        .then((response) => {
          this.previewImageUrl = "";
          this.file = "";
          this.selectedUser.avatarUrl = response.data;
          this.user = this.selectedUser;
          this.saveUser();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    onChooseFile() {
      ((this.$refs.file as Vue).$el as HTMLElement).click();
    }
  },
  created() {
    store.subscribe((mutation, state) => {
      if (mutation.type === "onUserSelected") {
        this.user = mutation.payload;
      }
    });
  },
});
