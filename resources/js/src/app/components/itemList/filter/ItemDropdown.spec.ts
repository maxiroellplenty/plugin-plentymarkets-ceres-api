import Vuex from 'vuex';
import { shallowMount, createLocalVue } from '@vue/test-utils';
import { Facet, State } from '../../../shared/interfaces';
import { Store } from 'vuex';
import ItemDropdown from './ItemDropdown.vue';
import VueCompositionAPI from '@vue/composition-api';

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueCompositionAPI);

window.ceresTranslate = key => key;

describe('ItemDropdown', () => {

    let store: Store<State>;

    beforeEach(() => {
        store = new Vuex.Store({});
    });

    it('does not show a dropdown if the fixed value count is greater than the available filter values', () => {
        const facet: Facet = {
            cssClass: '',
            findologicFilterType: 'select',
            id: 'test',
            isMain: false,
            itemCount: 3,
            name: 'Test',
            noAvailableFiltersText: '',
            select: 'multiple',
            type: '',
            values: [
                {
                    count: 9,
                    id: '20',
                    name: '22220',
                    selected: false,
                    items: []
                },
                {
                    count: 1,
                    id: '21',
                    name: '22221',
                    selected: false,
                    items: []
                }
            ]
        };

        store.state.itemList = {
            isLoading: false,
            selectedFacets: [],
            facets: [facet]
        };

        const wrapper = shallowMount(ItemDropdown, { propsData: { facet }, store, localVue });

        expect(wrapper.find('.fl-dropdown-container').exists()).toBeFalsy();
    });

    it('shows one filter value inside a dropdown if there are two options and the fixed item count is set to 1', () => {
        const facet: Facet = {
            cssClass: '',
            findologicFilterType: 'select',
            id: 'test',
            isMain: false,
            itemCount: 1,
            name: 'Test',
            noAvailableFiltersText: '',
            select: 'multiple',
            type: '',
            values: [
                {
                    count: 9,
                    id: '20',
                    name: '22220',
                    selected: false,
                    items: []
                },
                {
                    count: 1,
                    id: '21',
                    name: '22221',
                    selected: false,
                    items: []
                }
            ]
        };

        store.state.itemList = {
            isLoading: false,
            selectedFacets: [],
            facets: [facet]
        };

        const wrapper = shallowMount(ItemDropdown, { propsData: { facet }, store, localVue });

        expect(wrapper.findAll(':scope > *').length).toBe(2);
        expect(wrapper.findAll(':scope > div.form-check').length).toBe(1);
        expect(wrapper.findAll(':scope > div.fl-dropdown-container.custom-select ul li').length).toBe(1);
    });

    it('shows one filter value inside a dropdown if there are two options and the fixed item count is set to 1', () => {
        const facet: Facet = {
            cssClass: '',
            findologicFilterType: 'select',
            id: 'test',
            isMain: false,
            itemCount: 0,
            name: 'Test',
            noAvailableFiltersText: '',
            select: 'multiple',
            type: '',
            values: [
                {
                    count: 9,
                    id: '20',
                    name: '22220',
                    selected: false,
                    items: []
                },
                {
                    count: 1,
                    id: '21',
                    name: '22221',
                    selected: false,
                    items: []
                }
            ]
        };

        store.state.itemList = {
            isLoading: false,
            selectedFacets: [],
            facets: [facet]
        };

        const wrapper = shallowMount(ItemDropdown, { propsData: { facet }, store, localVue });

        expect(wrapper.findAll(':scope > *').length).toBe(1);
        const options = wrapper.findAll(':scope > div.fl-dropdown-container.custom-select ul li');
        expect(options.length).toBe(2);
        expect(options.at(0).find('label').text()).toBe('22220');
        expect(options.at(1).find('label').text()).toBe('22221');
        expect(wrapper.find('.fl-dropdown-label').text()).toBe('Findologic::Template.pleaseSelect');
    });
});
