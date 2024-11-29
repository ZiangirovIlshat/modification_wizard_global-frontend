<template>
    <div class="accessories-panel">
        <div class="accessories-panel__table-preloader" v-if="products.loading">
            <p v-for="item in 5" :key="item"></p>
        </div>
        <p v-else-if="products.error">Не удалось получить аксессуары для данной модификации</p>

        <template v-else>
            <div class="accessories-panel__tabs">
                <p
                    :class="{ '_active' : activeTab === key }" 
                    v-for="(item, key) in categoriesData"
                    :key="key"

                    @click="activeTab = key"
                >{{ key }}</p>
            </div>

            <div class="accessories-panel__headings">
                <p>Название</p>
                <p>Описание</p>
                <p>Цена с НДС</p>
                <p>Заказ</p>
            </div>
            <div class="accessories-panel__products" v-for="item in this.categoriesData[activeTab]" :key="item.name">
                <p> {{ item.name }} </p>
                <p> {{ item.descr ?? "—" }} </p>
                <p>
                    {{
                        parseFloat(item.price).toLocaleString(
                            "ru-RU",
                            {
                                style: "currency",
                                currency: "RUB",
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }
                        )
                    }}
                </p>

                <p v-if="item.price && item.code"><button  class="catr-bnt" title="В корзину"></button></p>
            </div>
        </template>
    </div>
</template>

<script>
    export default {
        name: "ModificationWizardAccessories",

        props: {
            data: {
                type: Object,
                required: true,
            }
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
            }
        },

        methods: {
            async getData() {
                if(this.data.length === 0) return;

                let requestUrl = this.url;

                let categoryList = {};

                this.data.forEach(el => {
                    requestUrl += (el.modification + ";");

                    let category = el.category;
                    if(!category) category = "Дополнительно";

                    if(!categoryList[category]) categoryList[category] = [];
                    categoryList[category].push(el.modification);
                });

                categoryList = moveKeyToEnd(categoryList, "Дополнительно");

                await this.requestPrices(requestUrl);

                for(let key in categoryList) {
                    const modifications = categoryList[key];

                    this.products.data.forEach(el => {
                        if(modifications.includes(el.name)) {
                            if(!this.categoriesData[key]) this.categoriesData[key] = [];
                            this.categoriesData[key].push(el);
                        }
                    });
                }


                this.activeTab = Object.keys(this.categoriesData)[0];

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

            getCategoriedData() {
                console.log(this.products.data)
            }
        },

        async created() {
            await this.getData();
        },
    }
</script>

<style lang="scss" scoped>
    .accessories-panel {
        background: #f9f9f9;
        border-radius: 5px;
        padding: 10px 10px 30px 10px;
        margin: 0 0 10px 0;

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

            p {
                padding: 10px 20px;
                background: #ededed;
                cursor: pointer;

                &:hover, &._active  {
                    background: #9b9b9b;
                    color: #fff;
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

            &:hover {
                border-bottom: 1px solid #b8b8b8;
            }

            p {
                font-weight: normal;

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
               width: 250px;
            }
            p:nth-child(2) {
                flex: 1;
            }
            p:nth-child(3) {
                text-align: center;
                width: 85px;
            }
            p:nth-child(4) {
                text-align: center;
                width: 50px;
            }
        }
    }

</style>