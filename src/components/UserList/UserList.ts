import Vue from "vue";
import Paginator from "../Paginator/Paginator.vue";

export default Vue.extend({
  name: "UserList",
  components: {
    Paginator
  },
  props: {
      users: Array
  }
});
