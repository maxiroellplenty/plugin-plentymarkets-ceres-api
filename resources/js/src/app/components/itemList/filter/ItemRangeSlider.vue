<template>
  <!-- SSR:template(findologic-item-range-slider) -->
  <div class="fl-range-slider-container">
    <div class="row">
      <div class="col-md-6 col-xs-6">
        <input
          v-model="valueFrom"
          class="fl-range-input"
        >
        <span
          class="fl-unit"
          v-text="facet.unit"
        />
      </div>
      <div class="col-md-6 col-xs-6">
        <input
          v-model="valueTo"
          class="fl-range-input"
        >
        <span
          class="fl-unit"
          v-text="facet.unit"
        />
      </div>
    </div>
    <div class="row fl-range-slider-row">
      <div class="col-md-9 col-sm-9 col-xs-12">
        <div
          :id="sanitizedFacetId"
          class="fl-range-slider"
        />
      </div>
      <div class="col-md-3 col-sm-3 col-xs-12 fl-range-slider-submit-btn-container">
        <button
          v-tooltip
          type="button"
          class="btn btn-primary fl-range-slider-submit-btn"
          :class="{'disabled': isDisabled}"
          data-toggle="tooltip"
          data-placement="top"
          :title="TranslationService.translate('Ceres::Template.itemApply')"
          rel="nofollow"
          @click="triggerFilter()"
        >
          <icon
            icon="fa-check"
            :loading="isLoading"
          />
        </button>
      </div>
    </div>
  </div>
  <!-- /SSR -->
</template>

<script lang="ts">
import { FacetAware, TemplateOverridable } from '../../../shared/interfaces';
import { computed, defineComponent, onMounted, ref, watch } from '@vue/composition-api';
import UrlBuilder, { PriceFacetValue } from '../../../shared/UrlBuilder';
import TranslationService from '../../../shared/TranslationService';
import * as noUiSlider from 'noUiSlider';

interface ItemRangeSliderProps extends TemplateOverridable, FacetAware { }

export default defineComponent({
  name: 'ItemRangeSlider',
  props: {
    facet: {
      type: Object,
      required: true
    }
  },
  setup: (props: ItemRangeSliderProps, { root }) => {
    const valueFrom = ref();
    const valueTo = ref();
    const facet = props.facet;

    const isLoading = computed(() => root.$store.state.isLoading);
    const sanitizedFacetId = computed(() => {
      return 'fl-range-slider-' + props.facet.id
          .replace(/\W/g, '-')
          .replace(/-+/, '-')
          .replace(/-$/, '');
    });
    const isDisabled = computed(() => {
        return parseFloat(valueFrom.value) > parseFloat(valueTo.value) ||
          isNaN(valueFrom.value) ||
          isNaN(valueTo.value) ||
          valueFrom.value === '' ||
          valueTo.value === '' ||
          root.$store.state.isLoading;
    });

    const getMaxValue = (): number => {
      if (!facet.values || facet.values.length === 0) {
        return Number.MAX_SAFE_INTEGER;
      }

      const maxValue = facet.values[facet.values?.length - 1].name.split(' - ')[1];

      return maxValue ? parseFloat(maxValue) : Number.MAX_SAFE_INTEGER;
    };

    const triggerFilter = () => {
      if (!isDisabled.value) {
        const facetValue = {
          min: parseFloat(valueFrom.value) ? valueFrom.value : 0,
          max: valueTo.value ? parseFloat(valueTo.value) : getMaxValue()
        } as PriceFacetValue;

        UrlBuilder.updateSelectedFilters(facet, facet.id, facetValue);
      }
    };

    const fixDecimalSeparator = (value: string|number): string => {
      if (typeof value === 'number') {
        value = value.toString();
      }

      if (value.includes('.')) {
        value = value.replace(',', '');
      } else {
        value = value.replace(',', '.');
      }

      return value;
    };

    const setCustomValidationMessage = (): void => {
      const elements = root.$el.querySelectorAll('input.fl-range-input[data-custom-validation-message]') as unknown as HTMLInputElement[];

      elements.forEach((input: HTMLInputElement) => {
        // Must be reset before the validity check as existence of custom validity counts as a validation error.
        input.setCustomValidity('');

        if (!input.checkValidity()) {
          input.setCustomValidity(input.dataset.customValidationMessage as string);
        }
      });
    };

    onMounted(() => {
      const values = UrlBuilder.getSelectedFilterValue(props.facet.id);
      valueFrom.value = (values ? values.min : props.facet.minValue) || '';
      valueTo.value = (values ? values.max : props.facet.maxValue) || '';

      $(document).ready(function () {
        const element: noUiSlider.Instance = document.getElementById(sanitizedFacetId.value) as noUiSlider.Instance;
        const slider = element.noUiSlider ? element.noUiSlider : window.noUiSlider.create(element, {
          step: props.facet.step,
          start: [valueFrom.value, valueTo.value],
          connect: true,
          range: {
            'min': Math.min(valueFrom.value, props.facet.minValue ?? 0),
            'max': Math.max(valueTo.value, props.facet.maxValue ?? Number.MAX_SAFE_INTEGER)
          }
        });

        slider.on('update', function (ui: string[]) {
          valueFrom.value = ui[0];
          valueTo.value = ui[1];
        });
      });
    });

    watch([valueFrom, valueTo], ([nextValueFrom, nextValueTo]) => {
      valueFrom.value = fixDecimalSeparator(nextValueFrom);
      valueTo.value = fixDecimalSeparator(nextValueTo);

      setCustomValidationMessage();
    });

    return {
      valueFrom,
      valueTo,
      sanitizedFacetId,
      isDisabled,
      isLoading,
      triggerFilter,
      TranslationService,
      watch
    };
  }
});
</script>

<style scoped>

</style>
