<template>
    <div class="cart-btn">
        <p class="cart-btn__preloader" v-if="loading">Загрузка...</p>
        <p class="cart-btn__error" v-else-if="error">{{ cart.error }}</p>
        <div class="cart-btn__row" v-else>
            <div class="cart-btn__price" :class="{'_in-cart' : count > 0}">
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
                    v-if="!isInCart"
                >В заказ</button>

                <p class="cart-btn__is-in-cart" v-else>В корзине</p>
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

            isInCart: false,

            count: 1,
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
            setCount: "cart/setCount",
        }),

        async callAddToCart() {
            try {
                this.loading = true;

                await this.addToCart({ code: this.code, count: this.count });
                this.checkInCart();
            } catch (error) {
                this.error = this.cart.error;
            } finally {
                this.loading = false;
            }
        },

        async callSetCount() {
            try {
                this.loading = true;

                await this.setCount({ code: this.code, count: this.count });
            } catch (error) {
                this.error = this.cart.error;
            } finally {
                this.loading = false;
            }
        },

        checkInCart() {
            const data = this.cart.data;

            if(data.total === 0) {
                this.isInCart = false;
                return;
            }

            for (let i = 0; i < data.items.length; i++) {
                const el = data.items[i];
                
                if(el.id == this.code) {
                    this.isInCart = true;
                    return;
                }
            }

            this.isInCart = false;
        }
    },
}
</script>

<style lang="scss" scoped>
.cart-btn {
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
        width: 65px;
        text-align: center;
        font-weight: normal;
        padding: 2px;
        border: 1px solid #4c4c4c;
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