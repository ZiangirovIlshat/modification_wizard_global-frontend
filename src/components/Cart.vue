<template>
    <div class="cart">
        <a href="https://owen.ru/cart" target="_blank" title="в корзину"></a>
        <div class="cart__icon">
        </div>
        <span class="cart__count" v-if="cart.data.items && cart.data.items.length > 0">{{ cart.data.items.length }}</span>
    </div>
</template>

<script>

import { mapState, mapActions } from "vuex";

export default {
    name: "Cart",

    data() {
        return {

        }
    },

    computed: {
        ...mapState({
            cart: (state) => state.cart,
        }),

        getCount() {
            this.cart
        },
    },
}

</script>

<style lang="scss" scoped>
    .cart {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        position: relative;

        a {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        &__icon {
            background: url(https://owen.ru/upl_files/modules/modification_wizard_global/frontend/sprite.css-fa95ae05.svg) no-repeat;
            background-position: 42.74193548387097% 78.75%;
            border: none;
            width: 30px;
            height: 30px;
        }

        &__count {
            position: absolute;
            top: 10px;
            right: 10px;
            background-color: #9f0412;
            width: 20px;
            height: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            color: #fff;
        }
    }
</style>