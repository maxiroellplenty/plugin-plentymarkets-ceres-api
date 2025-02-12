<template>
  <form
    method="GET"
    action="/search"
    onsubmit="return flSearchSubmitEventHandler(event, this);"
  >
    <div class="container-max" :class="{'p-0' : $ceres.isShopBuilder}">
      <div class="position-relative">
        <div class="d-flex flex-grow-1 position-relative my-2">
          <input
            ref="searchInput"
            name="query"
            type="search"
            class="search-input flex-grow-1 px-3 py-2"
            autofocus
            :placeholder="$translate('Ceres::Template.headerSearchPlaceholder')"
            :aria-label="$translate('Ceres::Template.headerSearchTerm')"
            @keyup.enter="prepareSearch()"
            @keyup.down="keydown()"
            @keyup.up="keyup()"
            @focus="isSearchFocused = true"
            @blur="onBlurSearchField($event)"
          >

          <slot name="search-button">
            <button
                class="search-submit px-3"
                type="submit"
                @click="search()"
                :aria-label="$translate('Ceres::Template.headerSearch')"
            >
              <i class="fa fa-search"></i>
            </button>
          </slot>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from '@vue/composition-api';
import { TemplateOverridable } from '../../shared/interfaces';
import UrlBuilder from '../../shared/UrlBuilder';
import * as jQuery from 'jquery';

interface ItemSearchProps extends TemplateOverridable {
  showItemImages: boolean;
  forwardToSingleItem: boolean;
}

export default defineComponent({
  name: 'FindologicItemSearch',
  props: {
    template: {
      type: String,
      default: '#vue-item-search'
    },
    showItemImages: {
      type: Boolean,
      default: false
    },
    forwardToSingleItem: {
      type: Boolean,
      default: false
    }
  },
  setup: (props: ItemSearchProps, { root }) => {
    root.$options.template = props.template;

    const promiseCount = ref(0);
    const autocompleteResult = ref([]);
    const selectedAutocompleteIndex = ref(-1);
    const isSearchFocused = ref(false);
    const searchInput = ref('');

    const selectedAutocompleteItem = computed(() => null);

    const search = () => {
      const searchBox = $('#searchBox') as unknown as jQuery.Accordion;

      searchBox.collapse('hide');
    };

    // Implement methods required by the Ceres template.
    const autocomplete = () => null;
    const selectAutocompleteItem = () => null;
    const keyup = () => null;
    const keydown = () => null;

    onMounted(() => {
      root.$nextTick(() => {
        const urlParams = UrlBuilder.getUrlParams(document.location.search);

        root.$store.commit('setItemListSearchString', urlParams.query);

        const rawQuery = urlParams.query ? urlParams.query as string : '';

        // Manually regex out all "+" signs as decodeURIComponent does not take care of that.
        // If we wouldn't replace them with spaces, "+" signs would be displayed in the search field.
        searchInput.value = decodeURIComponent(rawQuery.replace(/\+/g, ' '));
      });
    });

    root.$props.forwardToSingleItem = window.App.config.search.forwardToSingleItem;

    return {
      promiseCount,
      autocompleteResult,
      selectedAutocompleteIndex,
      isSearchFocused,
      searchInput,
      selectedAutocompleteItem,
      search,
      autocomplete,
      selectAutocompleteItem,
      keyup,
      keydown,
    };
  }
});
</script>

<style scoped>

</style>
