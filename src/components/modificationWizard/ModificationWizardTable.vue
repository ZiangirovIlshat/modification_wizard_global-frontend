<template>
    <div class="table">
        <div class="modification-wizard__table-preloader" v-if="loading">
            <p v-for="item in 5" :key="item"></p>
        </div>

        <template v-else>
            <table v-if="width > 1140">
                <thead>
                    <th v-for="(heading, key) in preparedKeys" :key="key" :class="{'_sorted' : sortingData['keyName'] === key}">
                        <template
                            v-if="
                                heading !== 'Модификация' &&
                                heading !== 'Аксессуары' &&
                                heading !== 'Особенности серии' &&
                                heading !== 'Цена с НДС' &&
                                heading !== 'Заказ'"
                        >
                            <button
                                :class="{
                                    '_desc' : sortingData['keyName'] === key && sortingData['orderBy'] === 'DESC', 
                                    '_sorted' : sortingData['keyName'] === key
                                }"
                                @click="updateSortingValues(key)"
                            ></button>
                        </template>
                        {{ heading }}
                    </th>
                </thead>

                <tbody>
                    <template v-for="(product, index) in data.products">
                        <tr :class="{'_opened' : accessoriesListOpened === product.key0}" v-if="product && index < limit.value" :key="product.key0">
                            <td
                                :class="{'text-center' : key !== 'key0' }"
                                v-for="(heading, key) in preparedKeys"
                                :key="key" 
                            >
                                <template v-if="key === 'key0'">
                                    <a
                                        class="modification-wizard__modification-link" 
                                        :href="product['link']" 
                                        target="_blank"
                                        title="На страницу товара"
                                    >{{ product[key] }}</a>
                                </template>

                                <template v-else-if="key === 'accessories'">
                                    <button
                                        class="accessories-btn"
                                        :class="{'_opened' : accessoriesListOpened === product.key0}"
                                        @click="openAccessoriesPanel(product.key0)"
                                    ></button>
                                </template>

                                <template v-else-if="key === 'buyButton'">
                                    <CartButton
                                        v-if="product['product_info'].length !== 0"

                                        :price="product['product_info'][0]['price']"
                                        :code="product['product_info'][0]['code']"
                                    />

                                    <span v-else>по запросу</span>                  
                                </template>

                                <template v-else>
                                    {{
                                        isNaN(product[key])
                                        ? product[key]
                                        : new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 10 }).format(product[key])
                                    }}
                                </template>
                            </td>
                        </tr>
                        <tr class="accessories-tr" v-if="accessoriesListOpened === product.key0" :key="product.key0">
                            <td :colspan="Object.keys(preparedKeys).length">
                                <div class="accessories-panel-container">
                                    <ModificationWizardAccessories 
                                        :data="product['accessories']"
                                    ></ModificationWizardAccessories>
                                </div>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>

            <div class="mobile-cards" v-else>
                <template v-for="(product, index) in data.products">
                    <div class="mobile-cards__item" v-if="product && index < limit.value" :key="product.key0">
                        
                        <div v-for="(heading, key) in preparedKeys" :key="key" >
                            <p class="mobile-cards__heading" v-if="key === 'key0'">
                                {{ product[key] }}
                                <br>
                                <a 
                                    :href="product['link']"
                                    target="_blank"
                                    title="На страницу товара"
                                >Подробнее</a>
                            </p>
                            <div 
                                class="mobile-cards__accessories-btn"
                                :class="{'_opened' : accessoriesListOpened === product.key0}"
                                v-else-if="key === 'accessories'"
                            ><p @click="openAccessoriesPanel(product.key0)">Аксессуары</p>
                                <ModificationWizardAccessories 
                                    v-if="accessoriesListOpened === product.key0"
                                    :data="product['accessories']"
                                ></ModificationWizardAccessories>
                            </div>

                            <template v-else-if="key === 'buyButton'">
                                <p class="mobile-cards__buy-btn">
                                    <CartButton
                                        v-if="product['product_info'].length !== 0"

                                        :price="product['product_info'][0]['price']"
                                        :code="product['product_info'][0]['code']"
                                    />

                                    <span v-else>по запросу</span> 
                                </p>                 
                            </template>
                            <p class="mobile-cards__property-row" v-else>
                                <span class="property">{{ heading }}</span>
                                <span class="nodes"></span>
                                <span class="value">
                                    {{
                                        isNaN(product[key])
                                        ? product[key]
                                        : new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 10 }).format(product[key])
                                    }}
                                </span>
                            </p>
                        </div>
                    </div>
                </template>
            </div>
        </template>

        
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import ModificationWizardAccessories from "./ModificationWizardAccessories.vue";
import CartButton from "../CartButton.vue";

export default {
    name : "ModificationWizardTable",

    components: {
        ModificationWizardAccessories,
        CartButton,
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
            unnecessaryData: [ "Статус товара", "price", "code" ],

            preparedKeys: {},
            sortingData: {
                "keyName" : "",
                "orderBy" : "ASC",
            },

            accessoriesListOpened: "",

            width: window.innerWidth,
        }
    },

    computed: {
        ...mapState({
            limit: (state) => state.limit,
            vpiType: (state) => state.vpiType,
        }),
    },

    methods: {
        updateWidth() {
          this.width = window.innerWidth;
        },

        ...mapActions({
            updateLimit: "updateLimit",
        }),

        getPreparedData() {
            this.preparedKeys = {};

            for (let i = 0; i < this.data.keys.length; i++) {
                const el = this.data.keys[i];

                if(i === 1) this.preparedKeys["accessories"] = "Аксессуары";

                if(i === this.data.keys.length - 1) {
                    this.preparedKeys["buyButton"] = "Заказ";
                }

                if(this.unnecessaryData.includes(el)) continue;

                if(el.indexOf("ВПИ, ") !== -1 && el !== this.vpiType.value) continue;

                this.preparedKeys["key" + i] = el;
            }
        },

        updateSortingValues(key) {
            let keyName = this.sortingData["keyName"];
            let orderBy = this.sortingData["orderBy"];

            if(!keyName || keyName !== key) {
                keyName = key;
                orderBy = "ASC";
 
            } else {
                if(orderBy === "ASC") {
                    orderBy = "DESC";
                } else {
                    keyName = "";
                    orderBy = "";
                }
            }

            this.sortingData["keyName"] = keyName;
            this.sortingData["orderBy"] = orderBy;

            this.$emit("update:sortedValues", this.sortingData);
        },

        openAccessoriesPanel(productKey) {
            if(this.accessoriesListOpened === productKey) {
                this.accessoriesListOpened = null;
                return;
            }

            this.accessoriesListOpened = productKey;
        },
    },

    watch: {
        data: {
            handler(newData) {
                if(Object.keys(newData).length !== 0) {
                    this.getPreparedData();
                    this.accessoriesListOpened = "";
                }
            },

            deep: true,
        },

        vpiType: {
            handler() {
                this.getPreparedData();
            },

            deep: true,
        },
    },

    created() {
        window.addEventListener("resize", this.updateWidth);
    },
}
</script>

<style lang="scss" scoped>
    .modification-wizard {

        &__table-preloader {
            p {
                margin: 0 0 5px 0;
                display: flex;
                justify-content: space-between;
                height: 40px;
                width: 100%;
                background: #ededed;
            }

            @for $i from 1 through 5 {
                p:nth-child(#{$i}) {
                    opacity: calc(1 - #{$i * 0.13});
                }
            }
        }

        &__modification-link {
            color: inherit;
            text-decoration: none;

            &:hover {
                color: #008f86;
            }
        }

        &__price {
            font-weight: 600;
        }
    }

    table {
        font-size: 12px;
        color: #4c4c4c;
        width: 100%;
        border: 1px solid #ededed;
        table-layout: auto;
    }

    thead {
        width: 100%;
        position: sticky;
        top: -1px;
        z-index: 5;
        background: #fff;
    }

    th{
        vertical-align: middle;
        padding: 8px 8px 14px 8px;
        background-color: #ededed;
        font-weight: 600;

        position: relative;

        &::after {
            content: "";
            position: absolute;
            left: 0;
            bottom: -3px;
            height: 3px;
            width: 100%;
            background-color: #ddd;
        }

        &:first-child {
            text-align: left;
        }

        &._sorted {
            color: #008f86;
        }

        button {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0);
            border: none;
            cursor: pointer;

            &::after {
                content: "";
                bottom: 0px;
                left: calc(50% - 2px);
                position: absolute;
                border: 4px solid transparent; 
                border-top: 5px solid #4c4c4c;
            }

            &._desc {
                &::after {
                    bottom: 2px;
                    transform: rotate(180deg);
                }
            }

            &._sorted {
                &::after {
                    border-top: 6px solid #008f86;
                }
            }
        }
    }

    tr {
        color: #4c4c4c;
        border-collapse: collapse;
        text-align: left;
        width: 100%;
        font-size: 12px;
        border-top: 1px solid #ddd;

        &.accessories-tr {
            border-top: none;
        }

        &._opened {
            &:hover {
                border-bottom: none;
            }
        }

        &:hover {
            border-bottom: 1px solid #b8b8b8;
        }
    }

    td {
        padding: 8px;
        align-content: center;

        &:first-child {
            width: 200px;
        }
        &:nth-child(3), &:nth-child(8) {
            width: 200px;
        }
        &:last-child {
            width: 180px;
        }
 
        &.text-center {
            text-align: center;
        }
    }

    .accessories-btn {
        background: inherit;
        border: none;
        height: 20px;
        width: 15px;
        padding: 0 5px;
        font-weight: 600;
        transition: .2s;
        position: relative;

        cursor: pointer;

        &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            border: 8px solid transparent; 
            border-top: 10px solid #008f86;
            transition: left .2s;
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                &::after {
                    top: 60%;
                    border-top: 10px solid #9f0412;
                }
            }
        }

        &._opened {
            &::after {
                rotate: 180deg;
                top: 30%;
                border-top: 10px solid #9f0412;
            }

            &:hover {
                top: 10%;

                &::after {
                    top: 20%;
                }
            }
        }
    }


    .mobile-cards {
        margin: 0 0 20px 0;
        font-size: 12px;

        &__item {
            margin: 0 0 20px 0;
            padding: 0 0 3px 0;
            border-bottom: 1px solid #b8b8b8;
        }

        &__heading {
            font-weight: 600;
            font-size: 14px;
            margin: 0 0 10px 0;

            a {
                font-size: 12px;
                color: #008f86;
            }
        }

        &__accessories-btn {
            margin: 0 0 10px 0;
            font-weight: 600;
            position: relative;

            &::after {
                content: "";
                position: absolute;
                pointer-events: none;
                left: 75px;
                top: 3px;
                border: 6px solid transparent;
                border-top: 8px solid #4c4c4c;
                transition: left 0.2s;
            }

            &._opened {
                p {
                    margin: 0 0 10px 0;
                }
                &::after {
                    transform: rotate(180deg);
                    top: -3px;
                }
            }
        }

        &__buy-btn {
            margin: 10px 0 10px 0;
        }

        &__property-row {
            display: flex;
            justify-content: space-between;
            margin: 0 0 3px 0;
        }
    }
    .property {
        color: #646464;
    }
    .nodes {
        flex: 1;
        margin: 0 5px;
        border-bottom: 1px dashed #b8b8b8;
    }
    .value {
        font-weight: 600;
        text-align: right;
    }

</style>