<template>
    <div class="filters">
        <div class="filters__tabs" v-if="Object.keys(selectedValues).length !== 0">
            <p class="filter-tab" v-for="(item, key) in selectedValues" :key="key">
                <span>{{item }}</span>
                <span @click="optionsValues[key] = null"> ✖</span>
            </p>
        </div>

        <div class="filters__head-row">
            <vpiTypeSelector/>

            <button @click="clearFilters()">Сброс фильтров</button>
        </div>

        <div class="filters__selectors">
            <div
                class="filter-item"
                v-show="isValidVpiSelector(item.heading)"
                :key="item.key"
                v-for="(item, index) in filtersOptions"
            >

                <template v-if="item.values.length < 10">
                    <label :for="item.key">
                        {{ item.heading  }}
                    </label>

                    <div
                        class="filter-item__select-container"
                        :class="{'_focused' : focusedItem === index}"
                        v-if="!optionsValues[item.key]"
                    >
                        <select
                            :class="{'_loading' : loading}"
                            :id="item.key"

                            :disabled="loading"

                            @focus="focusedItem = index"
                            @blur="focusedItem = null"

                            v-model="optionsValues[item.key]"
                        >
                            <option :value="null">Выберите</option>
                            <option 
                                :value="option"
                                :key="option"
                                v-for="option in item.values"
                            >
                                {{
                                    isNaN(option)
                                    ? option
                                    : new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 10 }).format(option)
                                }}
                            </option>
                        </select>
                    </div>
                    <div class="filter-item__selected-value" v-else>{{ optionsValues[item.key] }}</div>
                </template>

                <template v-else>
                    <label :for="item.key">
                        {{ item.heading  }}
                    </label>

                    <div
                        class="filter-item__select-container"
                        :class="{'_focused' : focusedItem === index}"
                        v-if="!optionsValues[item.key]"
                    >
                        <input
                            class="filter-item__search-input"
                            :class="{'_loading' : loading}"
                            type="text"
                            placeholder="Выберите"

                            :disabled="loading"

                            @focus="openedInput = item.key"
                            @blur="handleBlur"

                            v-model="searchSubstrs[item.key]"
                        >
                        <div class="filter-item__options" v-if="openedInput === item.key">
                            <p 
                                v-for="(option, index) in getFilteredOptionsInInput(searchSubstrs[item.key], item.values)"
                                v-show="index < oprionsLimit"
                                :key="option"
                                @click="optionsValues[item.key] = option"
                            >
                                {{
                                    isNaN(option)
                                    ? option
                                    : new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 10 }).format(option)
                                }}
                            </p>
                            <p
                                class="filter-item__show-more-btn"
                                @mousedown.prevent="showMoreHints(getFilteredOptionsInInput(searchSubstrs[item.key], item.values).length)"
                                v-if="oprionsLimit < getFilteredOptionsInInput(searchSubstrs[item.key], item.values).length &&
                                getFilteredOptionsInInput(searchSubstrs[item.key], item.values).length > 7"
                            >Показать все</p>
                        </div>
                    </div>

                    <div class="filter-item__selected-value" v-else>{{ optionsValues[item.key] }}</div>
                </template>

            </div>
        </div>
    </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

import vpiTypeSelector  from "./VpiTypeSelector.vue";

export default {
    name: "ModificationWizardFilters",
    
    components: {
        vpiTypeSelector,
    },

    props: {
        data: {
            type: Object,
            required: true,
        },
        loading: {
            type: Boolean,
            default: true,
        },
    },

    data() {
        return {
            unnecessaryData: [ "Модификация", "Статус товара", "Особенности серии" ],

            focusedItem: null,

            filtersOptions: [], // данные для отрисвки фильтров

            optionsValues: {}, // значения фильтров
            selectedValues: {}, // значения фильтров не равные null

            searchSubstrs: {}, // поиск для input-ов
            oprionsLimit: 5,
            openedInput: null,
        }
    },

    computed: {
        ...mapState({
            limit: (state) => state.limit,
            vpiType: (state) => state.vpiType,
        }),
    },

    methods: {
        ...mapActions({
            updateLimit: "updateLimit",
        }),

        getFiltersOptions() {
            let keys = {};

            this.data.products.forEach((product) => {
                this.data.keys.forEach((key, index) => {
                    let property = "key" + index;

                    !keys[key] ? keys[key] = { "key" : property, "values" : [] } : "";

                    !keys[key].values.includes(product[property]) ? keys[key].values.push(product[property]) : "";
                });
            });

            this.filtersOptions = [];

            for (let header in keys) {
                const el = keys[header];

                if (el.values.length === 0  || !el.values[0]  || this.unnecessaryData.includes(header)) continue;

                let arrToSort = [];
                let hasNumbers = false;
                let hasStrings = false;

                el.values.forEach(value => {
                    const isNumberString = /^[+-]?\d+(\.\d+)?$/.test(value.replace(",", "."));

                    console.log(isNumberString)
                    if (isNumberString) {
                        const numValue = parseFloat(value);
                        arrToSort.push(numValue);
                        hasNumbers = true;
                    } else {
                        arrToSort.push(value);
                        hasStrings = true;
                    }
                });

                arrToSort.sort((a, b) => {
                    if (typeof a === "number" && typeof b === "number") {
                        return a - b;
                    }

                    return String(a).localeCompare(String(b));
                });

                const sortedValues = arrToSort.map(value => value.toString());

                this.filtersOptions.push({
                    "key": el.key,
                    "heading": header,
                    "values": sortedValues,
                });
            }

            if(Object.keys(this.optionsValues).length === 0) {
                this.filtersOptions.forEach(el => {
                    this.optionsValues[el.key] = null;
                });
            }
        },

        getSelectedValues() {
            for (const key in this.optionsValues) {
                if(this.optionsValues[key] !== null) {
                    this.selectedValues[key] = this.optionsValues[key];
                } else {
                    delete this.selectedValues[key];
                }
            }
        },

        clearFilters() {
            for (const key in this.optionsValues) {
                this.optionsValues[key] = null;
            }

            this.selectedValues = {};
            // сбросить кол-во отображаемых столбцов
            this.updateLimit();
        },

        isValidVpiSelector(heading) {
            // отображение нужной единицы давления
            if(heading.indexOf("ВПИ, ") === -1) return true;

            return heading === this.vpiType.value;
        },

        // когда значений больше 10
        getFilteredOptionsInInput(subStr, values) {
            let options = [];

            if(!subStr) {
                options = values;
                return options;
            }

            values.forEach(el => {
                if(el.indexOf(subStr) !== -1) {
                    options.push(el)
                }
            });

            return options;
        },

        handleBlur() {
            setTimeout(() => {
                this.searchSubstrs = {};
                this.openedInput = null;
                this.oprionsLimit = 5;
            }, 200);
        },

        showMoreHints(length) {
            this.oprionsLimit = length;
        },
    },

    watch: {
        data: {
            handler(newData) {
                if(Object.keys(newData).length !== 0) this.getFiltersOptions();
            },

            deep: true,
        },

        vpiType: {
            handler() {
                if(Object.keys(this.data).length === 0) return;

                this.filtersOptions.forEach(el => {
                    if(el.heading.indexOf("ВПИ, ") !== -1) el.selectedValue = null;
                });

                this.$emit("update:vpiType", this.vpiType);
            }
        },

        optionsValues: {
            handler(newData) {
                this.getSelectedValues();

                this.$emit("update:selectedValues", this.selectedValues);
            },

            deep: true,
        },
    },  
}
</script>

<style lang="scss">
    .filters {
        &__tabs {
            background: #e0e5e8;
            border-radius: 3px;
            display: flex;
            align-items: center;
            gap: 5px;
            flex-wrap: wrap;
            margin: 0 0 20px 0;
            padding: 10px;

            @media (max-width: 768px) {
                padding: 5px;
                margin: 0 0 10px 0;
            }
        }

        &__head-row {
            margin: 0 0 30px 0;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            align-items: start;

            button {
                cursor: pointer;
                width: 250px;
                height: 40px;
                background-color: #fff;
                border: none;
                box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);

                @media (max-width: 768px) {
                    order: 0;
                    margin: 0 0 20px 0;
                    width: 100%;
                    height: 30px;
                }
            }
        }

        &__selectors {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 25px;

            @media (max-width: 768px) {
                gap: 10px;
            }
        }
    }

    .filter-tab {
        padding: 5px;
        background: #fff;
        border-radius: 5px;

        span:nth-child(2) {
            cursor: pointer;
            font-weight: 600;
            margin: 0 0 0 5px;
        }

        @media (max-width: 768px) {
            padding: 3px;
            font-size: 12px;
            background: #fff;
            border-radius: 3px;
        }
    }

    .filter-item {
        display: flex;
        flex: 0 0 30%;
        min-width: 330px;
        justify-content: space-between;
        align-items: start;
        gap: 20px;
        margin: 0 0 30px 0;

        cursor: pointer;

        @media (max-width: 1110px) {
            flex: 0 0 48%;
        }

        @media (max-width: 768px) {
            flex: 0 0 100%;
            flex-wrap: wrap;
            gap: 0;
            margin: 0 0 10px 0;
            min-width: auto;
        }

        label {
            line-height: 25px;
        }


        select, &__search-input {
            width: 250px;
            height: 25px;
            background: #008f86;
            color: #fff;
            border: none;
            box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.11);
            padding: 3px 25px 3px 5px;
            appearance: none;
            position: relative;

            cursor: pointer;

            &:focus-visible {
                outline: 1px solid;
                border: 0;
                background-color: #fff;
                color: #333;
            }

            &._loading {
                transition: .2s;
                background: #00a398;
                cursor: default;
            }

            @media (max-width: 1330px) {
                width: 200px;
            }

            @media (max-width: 768px) {
                width: 100%;
            }
        }

        &__select-container {
            position: relative;

            &.vpi-selector {
                &::after {
                    border-color: #333 transparent transparent transparent;
                }
            }

            &::after {
                content: "";

                position: absolute;
                top: 10px;
                right: 8px;
                pointer-events: none;
                border-style: solid;
                border-radius: 2px;
                border-width: 8px 6px 0px 6px;
                border-color: #fff transparent transparent transparent;
            }

            &._focused::after {
                border-color: #333 transparent transparent transparent;
            }

            @media (max-width: 768px) {
                flex: 0 0 100%;
            }
        }

        &.vpi-type {
            width: 30%;
            @media (max-width: 768px) {
                order: 1;
            }

            &__select-container {
                border-color: #333 transparent transparent transparent;
            }

            select {
                background: #fff;
                color: inherit;
            }
        }

        &__selected-value {
            max-width: 250px;
            min-width: 250px;
            min-height: 25px;
            padding: 3px 5px;
            background: #ebebeb;

            @media (max-width: 1330px) {
                max-width: 200px;
                min-width: 200px;
            }

            @media (max-width: 768px) {
                max-width: 100%;
                min-width: 100%;
            }
        }

        &__search-input {
            &::placeholder {color: #fff;}
            &::-webkit-input-placeholder {color: #fff;}
            &::-moz-placeholder {color: #fff;}
            &::-ms-input-placeholder {color: #fff;}
            &:-ms-input-placeholder {color: #fff;}
        }

        &__options {
            position: absolute;
            width: 100%;
            z-index: 10;
            background: #fff;
            border: 1px solid;
            max-height: 300px;
            overflow-y: scroll;

            scrollbar-width: thin;

            &::-webkit-scrollbar {
                width: 5px;
            }
            &::-webkit-scrollbar-track {
                background: #fff;
            }
            &::-webkit-scrollbar-thumb {
                background-color: #343536;
            }

            p {
                padding: 3px 5px;

                &:hover {
                    background: #e0e5e8;
                }
            }
        }

        &__show-more-btn {
            color: #008f86;
            font-weight: 600;
        }
    }

</style>  
