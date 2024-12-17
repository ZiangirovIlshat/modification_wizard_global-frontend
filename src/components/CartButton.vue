<template>
    <div class="cart-btn">
        <p class="cart-btn__preloader" v-if="loading">Загрузка...</p>
        <p class="cart-btn__error" v-else-if="error" v-html="error"></p>
        <div class="cart-btn__row" v-else>
            <div class="cart-btn__price">
                {{
                    parseFloat(price).toLocaleString(
                        "ru-RU",
                        {
                            style: "currency",
                            currency: "RUB",
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }
                    )
                }}
            </div>
            <div class="cart-btn__btns">
                <button
                    class="cart-btn__bue-btn"
                    @click="callAddToCart()"
                    v-if="!cart.data.indexes[code]"
                >В заказ</button>

                <p class="cart-btn__is-in-cart" v-else>
                    <span class="cart-btn__count">{{ cart.data.indexes[code] }}</span>
                    В корзине
                    <a href="https://owen.ru/cart" target="_blank" title="Перейти в корзину"></a>
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "CartButton",

    props: {
        price: {
            type: String,
            required:true,
        },
        code: {
            type: String,
            required:true,
        },
    },

    data() {
        return {
            loading: false,
            error: "",
        }
    },

    computed: {
        ...mapState({
            cart: (state) => state.cart,
        }),
    },

    methods: {
        ...mapActions({
            addToCart: "cart/addToCart",
        }),

        async callAddToCart() {
            this.loading = true;

            await this.addToCart({ code: this.code });

            this.loading = false;

            if(this.cart.error) this.error = this.cart.error;
        },
    },
}
</script>

<style lang="scss" scoped>
.cart-btn {

    &__preloader {
        text-align: center;
        color: #636363;
        height: 17px;
        border: none;
    }

    &__error {
        text-align: center;
    }

    &__row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: right;
        gap: 5px;
        border-radius: 5px;
        margin-right: 0;
    }

    &__btns {
        display: flex;
        align-items: center;
    }

    &__bue-btn {
        width: 70px;
        padding: 2px 0;
        background-color: #4c4c4c;
        border: none;
        color: #fff;
        cursor: pointer;

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                background: #fff;
                outline: 1px solid #4c4c4c;
                color: #4c4c4c;
            }
        }
    }

    &__is-in-cart {
        width: 70px;
        text-align: center;
        font-weight: normal;
        padding: 2px;
        border: 1px solid #4c4c4c;
        position: relative;

        a {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        @media (hover: hover) and (pointer: fine) {
            &:hover {
                border: 1px solid #008f86;
                color: #008f86;

                .cart-btn__count {
                    background: #008f86;
                }
            }
        }
    }

    &__count {
        position: absolute;
        top: -6px;
        right: -6px;
        background: #4c4c4c;
        color: #fff;
        font-size: 10px;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &__get-count-btns {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 60px;
        font-weight: 600;

        button {
            background-color: #4c4c4c;
            color: #fff;
            border: none;
            padding: 3px 7px;

            cursor: pointer;

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background: #fff;
                    outline: 1px solid #4c4c4c;
                    color: #4c4c4c;
                }
            }
        }
    }

    &__price {
        line-height: 1;
        padding: 0 3px;
        font-weight: 600;
    }
}

</style>