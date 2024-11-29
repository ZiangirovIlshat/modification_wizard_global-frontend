<template>
    <div class="table">
        <div class="modification-wizard__table-preloader" v-if="loading">
            <p v-for="item in 5" :key="item"></p>
        </div>

        <table v-else>
            <thead>
                <th v-for="(heading, key) in preparedKeys" :key="key">
                    <template 
                        v-if="
                            heading !== 'Модификация' &&
                            heading !== 'Аксессуары' &&
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
                <template v-for="product in data.products">
                    <tr :class="{'_opened' : accessoriesListOpened === product.key0}" v-if="product" :key="product.key0">
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
                                <template v-if="product['product_info'].length !== 0">
                                    <button class="catr-bnt" v-if="product['product_info'].length !== 0" title="В корзину" @click="addToCart()"></button>
                                </template>
                                <template v-else>
                                    —
                                </template>                      
                            </template>

                            <template v-else-if="key === 'price'">
                                <span class="modification-wizard__price" v-if="product[key]">
                                    {{
                                        parseFloat(product[key]).toLocaleString(
                                            "ru-RU",
                                            {
                                                style: "currency",
                                                currency: "RUB",
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            }
                                        )
                                    }}
                                </span>

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
    </div>
</template>

<script>
    import ModificationWizardAccessories from "./ModificationWizardAccessories.vue";

    export default {
        name : "ModificationWizardTable",

        components: {
            ModificationWizardAccessories
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

            vpiType: {
                type: String,
            }
        },

        data() {
            return {
                unnecessaryData: [ "Статус товара", "Особенности серии", "price", "code" ],

                preparedKeys: {},
                sortingData: {
                    "keyName" : "",
                    "orderBy" : "ASC",
                },

                accessoriesListOpened: "",
            }
        },

        methods: {
            getPreparedData() {
                this.preparedKeys = {};

                for (let i = 0; i < this.data.keys.length; i++) {
                    const el = this.data.keys[i];

                    if(i === 1) this.preparedKeys["accessories"] = "Аксессуары";

                    if(i === this.data.keys.length - 1) {
                        this.preparedKeys["price"] = "Цена с НДС";
                        this.preparedKeys["buyButton"] = "Заказ";
                    }

                    if(this.unnecessaryData.includes(el)) continue;

                    if(el.indexOf("ВПИ, ") !== -1 && el !== this.vpiType) continue;

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
                    if(Object.keys(newData).length !== 0) this.getPreparedData();
                },

                deep: true,
            },

            vpiType: {
                handler() {
                    this.getPreparedData();
                }
            }
        }
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
        border-bottom: 1px solid #ddd;
    }

    thead {
        width: 100%;
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

    th{
        vertical-align: middle;
        padding: 8px 8px 10px 8px;
        background-color: #ededed;
        font-weight: 600;

        position: sticky;
        top: 0;
        z-index: 1;

        position: relative;

        &:first-child {
            text-align: left;
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
                bottom: -1px;
                position: absolute;
                border: 4px solid transparent; 
                border-top: 6px solid #4c4c4c;
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

    td {
        padding: 8px;

        &:first-child {
            font-weight: 600;
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
</style>