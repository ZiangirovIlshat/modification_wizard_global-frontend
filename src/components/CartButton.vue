<template>
    <div>
        <p v-if="cart.loading">Загрузка...</p>
        <p v-else-if="cart.error">{{ cart.error }}</p>
        <div v-else>
            <span>{{ price * count }}</span>
            <br>
            <button @click="addToCart()" v-if="count === 1">В заказ</button>
            <template v-else>
                <button @click="count++">+</button>
                {{ count }}
                <button @click="count !== 1 ?  count-- : ''">-</button>
            </template>
            <br>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name: "CartButton",

    props: {
        code: {
            type: Number,
            required: true,
        },

        price: {
            type: String,
            required: true,
        },
    },

    data() {
        return {
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
            fetchCartData: "cart/fetchCartData",
        }),

        async addToCart() {
            await this.fetchCartData(this.code, this.count);
        }
    }
}
</script>

<style lang="scss" scoped>

</style>