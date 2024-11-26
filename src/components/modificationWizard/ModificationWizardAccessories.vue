<template>
    <div class="accessories-panel">
        <!-- v-if="products.loading"
        v-else -->
        <div class="accessories-panel__table-preloader" v-if="products.loading">
            <p v-for="item in 5" :key="item"></p>
        </div>

        <template v-else>
            <div class="accessories-panel__headings">
                <p>Название</p>
                <p>Описание</p>
                <p>Цена с НДС</p>
                <p>Заказ</p>
            </div>
            <div class="accessories-panel__products" v-for="item in this.products.data" :key="item.name">
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

                url: "https://owen.ru/upl_files/modules/price_getter/get.php?articles=",
            }
        },

        methods: {
            getRequestUrl() {
                let requestUrl = this.url;

                for (let key in this.data) {
                    const el = this.data[key];
                    if(el !== '-') requestUrl += (el + ';')
                }

                return requestUrl;
            },

            async getData() {
                this.products.loading = true;

                let requestUrl = this.getRequestUrl();

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
            }
        },

        created() {
            this.getData()
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

        &__headings {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;

            p {
                font-weight: 600;
            }
        }

        &__products {
            display: flex;
            justify-content: space-between;
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