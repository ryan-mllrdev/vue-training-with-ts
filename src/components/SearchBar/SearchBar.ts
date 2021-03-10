import Vue from "vue";
import { IGithubUser } from "@/core/interfaces/IGithubUser";
import axios from "axios";
import store from "@/store";

interface DataObject {
  results: IGithubUser[];
  filteredResults: IGithubUser[];
  searchKeyword: string;
}

export default Vue.extend({
  name: "SearchBar",
  props: {
    searchButtonText: String,
    searchBarTitle: String,
  },
  data(): DataObject {
    return {
      results: [],
      filteredResults: [],
      searchKeyword: "",
    };
  },
  methods: {
    getSampleResults() {
      // axios.get("https://api.github.com/users?since=1").then((response) => {
        axios.get('http://localhost:3000/users').then((response) => {
        // console.log(response);
        this.filteredResults = this.results = response.data;
        this.onResultsUpdated(this.filteredResults);
      });
    },
    onSearch() {
      const contains = (value: string | undefined | null, keyword: string) => {
        return value?.toLowerCase().includes(keyword.toLocaleLowerCase());
      };
      this.filteredResults = this.results.filter((result) => {
        return (
          contains(result.id.toString(), this.searchKeyword) ||
          contains(result.login, this.searchKeyword) ||
          this.searchKeyword === ""
        );
      });
      this.onResultsUpdated(this.filteredResults);
    },
    onResultsUpdated(newResults: IGithubUser[]) {
      this.$emit("onSearch", newResults);
    }
  },
  mounted() {
    this.getSampleResults();
  },
});
