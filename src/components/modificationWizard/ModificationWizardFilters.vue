<template>
    <div class="filters">
        <div class="filters__tabs" v-if="Object.keys(selectedValues).length !== 0">
            <p class="filter-tab" v-for="(item, key) in selectedValues" :key="key">
                <span>{{item }}</span>
                <span @click="optionsValues[key] = null"> ✖</span>
            </p>
        </div>

        <div class="filters__head-row">
            <div class="filter-item vpi-type">
                <label for="vpiTypeSelector">Единицы давления</label>
                <div class="filter-item__select-container vpi-selector">
                    <select v-model="vpiType" id="vpiTypeSelector">
                        <option
                            :value="item"
                            :key="item"
                            v-for="item in vpiOptions">{{ item }}</option>
                    </select>
                </div>
            </div>
            <button @click="clearFilters()">Сброс фильтров</button>
        </div>

        <div class="filters__selectors">
            <div
                class="filter-item"
                v-show="isValidVpiSelector(item.heading)"
                :key="item.key"
                v-for="(item, index) in filtersOptions"
            >
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
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: "ModificationWizardFilters",

    props: {
        data: {
            type: Object,
            required: true,
        },

        loading: {
            type: Boolean,
            default: true,
        }
    },

    data() {
        return {
            vpiType: "МПа",
            vpiOptions: ["МПа", "кПа", "Па", "бар", "атм"],

            unnecessaryData: [ "Модификация", "Статус товара", "Особенности серии" ],

            focusedItem: null,

            filtersOptions: [], // данные для отрисвки фильтров

            optionsValues: {}, // значения фильтров
            selectedValues: {}, // значения фильтров не равные null
        }
    },

    methods: {
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

            for(let header in keys) {
                const el = keys[header];

                if(el.values.length === 0 || !el.values[0] || this.unnecessaryData.includes(header)) continue;

                this.filtersOptions.push({
                    "key" : el.key,
                    "heading" : header,
                    "values" : el.values.sort(),
                })
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
        },

        isValidVpiSelector(heading) {
            if(heading.indexOf("ВПИ, ") === -1) return true;

            return heading === "ВПИ, " + this.vpiType;
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
        }
    },  
}
</script>

<style scoped lang="scss">
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

                @media (hover: hover) and (pointer: fine) {
                    &:hover {
                        box-shadow: 5px 5px 15px 0px rgba(0, 0, 0, 0.11);
                    }
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


        select {
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
    }

</style>  
