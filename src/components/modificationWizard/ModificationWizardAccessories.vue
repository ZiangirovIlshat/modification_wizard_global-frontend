<template>
    <div class="accessories-panel">
        <div class="accessories-panel__table-preloader" v-if="products.loading">
            <p v-for="item in 5" :key="item"></p>
        </div>

        <p v-else-if="products.error">Не удалось получить аксессуары для данной модификации</p>

        <template v-else-if="width > 1140">
            <div class="accessories-panel__tabs">
                <p
                    class="accessories-panel__tab-item"
                    :class="{ '_active' : activeTab === key }" 
                    v-for="(item, key) in categoriesData"
                    :key="key"

                    @click="activeTab = key"
                >{{ key }}</p>
            </div>

            <div class="accessories-panel__headings">
                <p>Название</p>
                <p>Описание</p>
                <p>Заказ</p>
            </div>
            <div class="accessories-panel__products" v-for="item in this.categoriesData[activeTab]" :key="item.name">
                <p> {{ item.name }} </p>
                <p> {{ item.descr ?? "—" }} </p>
                <CartButton
                    v-if="item.code"
                    :price="item.price"
                    :code="item.code"
                />
            </div>
        </template>

        <template v-else>
            <div class="accessories-panel__tabs">
                <div 
                    v-for="(item, key) in categoriesData"
                    :key="key"
                >
                    <p 
                        class="accessories-panel__tab-item"
                        :class="{ '_active' : activeTab === key }"
                        @click="activeTab === key ? activeTab = '' : activeTab = key"
                    >{{ key }}</p>
                    <div v-if="activeTab === key">
                        <div 
                            class="mobile-card"
                            v-for="item in this.categoriesData[activeTab]"
                            :key="item.name"
                        >
                            <p>{{ item.name }}</p>
                            <p>{{ item.descr ?? "—" }}</p>
                            <p>
                                <CartButton
                                    v-if="item.code"
                                    :price="item.price"
                                    :code="item.code"
                                />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import CartButton from "../CartButton.vue";

    export default {
        name: "ModificationWizardAccessories",

        props: {
            data: {
                type: Object,
                required: true,
            }
        },

        components: {
            CartButton 
        },

        data() {
            return {
                products: {
                    loading: false,
                    error: "",
                    data: [],
                },

                categoriesData: {},
                activeTab: "",

                url: "https://owen.ru/upl_files/modules/price_getter/get.php?articles=",

                width: window.innerWidth,
            }
        },

        methods: {
            updateWidth() {
                this.width = window.innerWidth;
            },

            async getData() {
                if (this.data.length === 0) return;

                let requestUrl = this.url;

                let categoryList = {};

                this.data.forEach(el => {
                    requestUrl += (el.modification + ";");

                    let category = el.category;
                    if (!category) category = "Дополнительно";

                    if (!categoryList[category]) categoryList[category] = [];
                    categoryList[category].push(el.modification);
                });

                let sortedCategoryList = Object.entries(categoryList)
                    .sort(([, a], [, b]) => b.length - a.length)
                    .reduce((acc, [key, value]) => {
                        acc[key] = value;
                        return acc;
                    }, {});

                sortedCategoryList = moveKeyToEnd(sortedCategoryList, "Дополнительно");

                await this.requestPrices(requestUrl);

                for (let key in sortedCategoryList) {
                    const modifications = sortedCategoryList[key];

                    this.products.data.forEach(el => {
                        if (modifications.includes(el.name)) {
                            if (!this.categoriesData[key]) this.categoriesData[key] = [];
                            this.categoriesData[key].push(el);
                        }
                    });
                }

                if (this.width > 1140) {
                    this.activeTab = Object.keys(this.categoriesData)[0];
                }

                function moveKeyToEnd(obj, key) {
                    if (!(key in obj)) return obj;

                    const { [key]: value, ...rest } = obj;
                    return { ...rest, [key]: value };
                }
            },

            async requestPrices(requestUrl) {
                this.products.loading = true;

                let errText = "Что пошло не так, ошибка при запросе";

                try {
                    const response = await fetch(requestUrl);

                    if(!response.ok) {
                        this.products.error = errText;
                        return;
                    }

                    this.products.data = await response.json();
                    
                    this.products.loading = false;
                } catch (error) {
                    this.products.error = errText;
                } finally {
                    this.products.loading = false;
                }
            },
        },

        async created() {
            window.addEventListener("resize", this.updateWidth);
            await this.getData();
        },
    }
</script>

<style lang="scss" scoped>
    .accessories-panel {
        background: #f5f4f4;
        border-radius: 15px;
        padding: 20px 20px 30px 20px;
        margin: 0 0 10px 0;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);

        @media (max-width: 1140px) {
            font-size: 12px;
        }

        @media (max-width: 1140px) {
            padding: 10px 10px 20px 10px;
        }

        &__table-preloader {
            p {
                background: #fff;
                height: 25px;
                margin: 0 0 5px 0;
                border-radius: 5px;
            }

            @for $i from 1 through 5 {
                p:nth-child(#{$i}) {
                    opacity: calc(1 - #{$i * 0.13});
                }
            }
        }

        &__tabs {
            display: flex;
            gap: 10px;
            margin: 20px 0 10px 0;

            @media (max-width: 1140px) {
                flex-direction: column;
                margin: 10px 0;
            }
        }

        &__tab-item {
            padding: 10px 20px;
            background: #ffffff;
            color: #707070;
            cursor: pointer;

            &:hover, &._active  {
                background: #7e7e7e;
                color: #fff;
            }

            @media (max-width: 1140px) {
                padding: 5px 20px 5px 5px;
                position: relative;

                &:hover {
                    background: #ffffff;
                    color: #707070;
                }

                &::after {
                    content: "";
                    position: absolute;
                    pointer-events: none;
                    right: 5px;
                    top: 10px;
                    border: 5px solid transparent;
                    border-top: 6px solid #4c4c4c;
                    transition: left 0.2s;
                }

                &._active {
                    background: #7e7e7e;
                    color: #fff;
                    &::after {
                        border-top: 6px solid #fff;
                    }
                }
            }
        }

        &__headings {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            border-bottom: 1px solid;

            p {
                font-weight: 600;
            }
        }

        &__products {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #dfdfdf;
            margin: 5px 0 10px 0;

            &:hover {
                border-bottom: 1px solid #b8b8b8;
            }

            p {
                font-weight: 400;

                &:first-child, &:nth-child(3) {
                    font-weight: 600;
                }
            }
        }

        &__headings, &__products {
            p {
                padding: 5px;
            }

            p:first-child {
               width: 200px;
            }
            p:nth-child(2) {
                flex: 1;
            }
            p:nth-child(3) {
                text-align: center;
                width: 150px;
            }
        }
    }

    .mobile-card {
        margin: 5px 0 5px 0;
        border-bottom: 1px solid #b8b8b8;
        padding: 0 10px 5px 10px;

        p:nth-child(1) {
            font-size: 14px;
            margin: 0 0 5px 0;
        }

        p:nth-child(2) {
            font-weight: normal;
            margin: 0 0 10px 0;
        }

        p:nth-child(3) {
            width: 150px;
            margin: 10px 0 0 0;
            margin-left: auto;
        }
    }
</style>