import { Store } from 'vuex';

export interface TemplateOverridable {
    template?: string;
}

export interface FacetAware {
    facet: Facet;
}

export interface State {
    itemList: ItemListData;
}

export interface Facet {
    id: string;
    name?: string;
    type?: string;
    isMain?: boolean;
    itemCount?: number;
    select?: string;
    values?: FacetValue[];
    findologicFilterType?: string;
    minValue?: number;
    min?: string;
    maxValue?: number;
    max?: string;
    step?: number;
    unit?: string;
    noAvailableFiltersText?: string;
    cssClass?: string;
}

export interface FacetValue {
    count?: number;
    id?: string;
    name: string;
    imageUrl?: string;
    selected: boolean;
    items: FacetValue[];
}

export interface ColorFacet extends Facet {
    values: ColorFacetValue[];
}

export interface ColorFacetValue extends FacetValue {
    hexValue: string|null;
    colorImageUrl?: string|null;
}

export interface CategoryFacet extends Facet {
    values: CategoryFacetValue[];
}

export interface CategoryFacetValue extends FacetValue {
    items: CategoryFacetValue[];
}

export interface ItemListData {
    isLoading?: boolean;
    selectedFacets: Facet[];
    facets: Facet[];
}

export interface StoreState {
    itemList: ItemListData;
}

export interface PlentyVuexStore extends Store<StoreState> {
    itemList: ItemListData;
}

export interface JQuery {
    collapse: () => void;
}
