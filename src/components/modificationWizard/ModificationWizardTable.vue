<template>
    <div class="table">
        <div class="modification-wizard__table-preloader" v-if="loading">
            <p v-for="item in 5" :key="item"></p>
        </div>

        <table v-else>
            <thead>
                <th v-for="(heading, key) in preparedKeys" :key="key" :class="{'_sorted' : sortingData['keyName'] === key}">
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
                <template v-for="(product, index) in data.products">
                    <tr :class="{'_opened' : accessoriesListOpened === product.key0}" v-if="product && index < limit" :key="product.key0">
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

        <div class="modification-wizard__btns" v-if="data.products && !loading">
            <div class="modification-wizard__btns-row">
                <button 
                    class="modification-wizard__show-btn"
                    @click="limit +=20"
                    v-if="data.products.length > 20 && data.products.length > limit"
                >Показать еще 20</button>
                <button 
                    class="modification-wizard__show-btn" 
                    @click="limit = data.products.length"
                    v-if="limit < data.products.length"
                >Показать все ({{ data.products.length - limit }})</button>
            </div>


            <button 
                class="modification-wizard__close-btn"
                @click="limit=10"
                v-if="limit > 10 && data.products.length !== 10"
            >Свернуть</button>
        </div>
    </div>
</template>

<script>
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
            vpiType: {
                type: String,
            },
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
                limit: 10,
            }
        },

        methods: {
            getPreparedData() {
                this.preparedKeys = {};

                for (let i = 0; i < this.data.keys.length; i++) {
                    const el = this.data.keys[i];

                    if(i === 1) this.preparedKeys["accessories"] = "Аксессуары";

                    if(i === this.data.keys.length - 1) {
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

        &__btns-row {
            margin: 30px 0 10px 0;
            display: flex;
            gap: 10px;
        }
        &__show-btn, &__close-btn {
            color: #fff;
            border: none;
            padding: 5px 15px;
            cursor: pointer;
            font-weight: 600;
        }

        &__show-btn {
            background-color: #008f86;

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background: #fff;
                    outline: 1px solid #008f86;
                    color: #008f86;
                }
            }
        }

        &__close-btn {
            background: #4c4c4c;
            padding-right: 30px;
            position: relative;
            
            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background: #fff;
                    outline: 1px solid #4c4c4c;
                    color: #4c4c4c;

                    &::after {
                        border-bottom: 8px solid #4c4c4c;
                    }
                }
            }

            &::after {
                content: "";
                position: absolute;
                top: 4px;
                right: 10px;
                border: 5px solid transparent;
                border-bottom: 8px solid #fff;
            }
        }
    }

    table {
        font-size: 12px;
        color: #4c4c4c;
        width: 100%;
        border: 1px solid #ddd;
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