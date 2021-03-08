import Vue from "vue";

export default Vue.extend({
    name: "Paginator",
    props: {
        pages: Number
    },
    methods: {
        onSelectPage(page: number) {
            console.log(page);
        }
    }
});