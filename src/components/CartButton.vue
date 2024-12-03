<template>
    <div class="cart">
        <p class="cart__preloader" v-if="loading">Загрузка...</p>
        <p class="cart__error" v-else-if="error">{{ cart.error }}</p>
        <div class="cart__row" v-else>
            <div class="cart__price" :class="{'_in-cart' : count > 0}">
                {{
                    parseFloat(count > 0 ? price * count : price).toLocaleString(
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
            <div class="cart__btns">
                <button 
                    class="cart__bue-btn" 
                    @click="count === 0 ? count = 1 : '', addToCart()"
                    v-if="count === 0"
                >В заказ</button>

                <div class="cart__get-count-btns" v-else>
                    <button @click="count !== 0 ? count-- : '',  addToCart()">-</button>
                    {{ count }}
                    <button @click="count++, addToCart()">+</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "CartButton",

    props: {
        code: {
            type: String,
            required: true,
        },

        price: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
            loading: "",
            error: "",

            count: 0,
        }
    },

    computed: {
        ...mapState({
            cart: (state) => state.cart,
        }),
    },

    methods: {
        ...mapActions({
            fetchCartData: "cart/fetchCartData",
        }),

        async addToCart() {
            try {
                this.loading = true;

                await this.fetchCartData({ code: this.code, count: this.count });
            } catch (error) {
                this.error = this.cart.error;
            } finally {
                this.loading = false;
            }
        },
    }
}
</script>

<style lang="scss" scoped>
.cart {
    width: 150px;

    &._in-cart {

    }

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
        align-items: center;
        justify-content: right;
        gap: 5px;
        border-radius: 5px;
        margin-right: 0;
    }

    &__btns {
        display: flex;
    }

    &__bue-btn {
        width: 60px;
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

        &._in-cart {
            font-weight: 600;
        }
    }
}

</style>