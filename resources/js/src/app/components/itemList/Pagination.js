import Url from '../../mixins/url';
import Vue from 'vue';

const options = {
    mixins: [Url],

    delimiters: ['${', '}'],

    props: [
        'template'
    ],

    data() {
        return {
            lastPageMax: 0
        };
    },

    computed: {
        pageMax() {
            if (this.isLoading) {
                return this.lastPageMax;
            }

            let pageMax = this.totalItems / parseInt(this.itemsPerPage);

            if (this.totalItems % parseInt(this.itemsPerPage) > 0) {
                pageMax += 1;
            }

            this.lastPageMax = parseInt(pageMax) || 1;

            return parseInt(pageMax) || 1;
        },

        // eslint-disable-next-line no-undef
        ...Vuex.mapState({
            page: state => state.itemList.page || 1,
            isLoading: state => state.itemList.isLoading,
            itemsPerPage: state => state.itemList.itemsPerPage,
            totalItems: state => state.itemList.totalItems
        })
    },

    created() {
        this.$options.template = this.template;

        const urlParams = this.getUrlParams(document.location.search);
        const page = urlParams.page || 1;

        this.$store.commit('setItemListPage', parseInt(page));
    },

    methods: {
        setPage(page) {
            this.setUrlParamValue('page', page);
        }
    }
};

if (window.flCeresConfig.isSearchPage || window.flCeresConfig.activeOnCatPage) {
    // eslint-disable-next-line
    Vue.component('Pagination', options);
    Vue.component('CustomPagination', options);
}
