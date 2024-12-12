// корзина

const cart = {
    namespaced: true,
    state: {
        data: {
            indexes: {},
            products: {},
        },
        loading: false,
        error: "",
    },

    mutations: {
        SET_CART_PRODUCTS_DATA(state, payload) {
            state.data.products = payload
        },
        SET_CART_INDEXES_DATA(state, payload) {
            state.data.indexes = payload
        },
        SET_CART_LOADING(state, payload) {
            state.loading = payload
        },
        SET_CART_ERROR(state, payload) {
            state.error = payload
        },
    },

    actions: {
        addIndexes({ commit }, products) {
            const indexes = {};

            products.forEach(product => {
                indexes[product.id] = product.count;
            });

            commit("SET_CART_INDEXES_DATA", indexes);
        },

        async getCart({ commit, dispatch }) {
            try {
                const response = await fetch("https://owen.ru/ajax/basket?q=getcart", {
                    headers: {
                        credentials: "include"
                    }
                });

                if(!response.ok) {
                    throw new Error("response error");
                }

                const data = await response.json();

                if (data.items) {
                    await dispatch("addIndexes", data.items);
                }

                commit("SET_CART_PRODUCTS_DATA", data);
            } catch (error) {
                commit("SET_CART_ERROR", "<b>Ошибка!</b> <br> Не удалось добавить товар в корзину");
            }
        },

        async addToCart({ commit, dispatch }, { code, count }) {
            commit("SET_CART_LOADING", true);

            try {
                const response = await fetch(`https://owen.ru/ajax/basket?id=${code}&count=${count || 1}`, {
                    headers: {
                        credentials: "include"
                    }
                });

                if(!response.ok) {
                    commit("SET_CART_ERROR", "<b>Ошибка!</b> <br> Не удалось добавить товар в корзину");
                    throw new Error("response error");
                }

                const data = await response.json();

                if (data.items) {
                    await dispatch("addIndexes", data.items);
                }

                commit("SET_CART_PRODUCTS_DATA", data);
            } catch (error) {
                commit("SET_CART_ERROR", "<b>Ошибка!</b> <br> Не удалось добавить товар в корзину");
            } finally {
                commit("SET_CART_LOADING", false);
            }
        },

        // async setCount({ commit }, { code, count }) {
        //     commit("SET_CART_LOADING", true);

        //     const formData = new FormData();
        //     formData.append("id", code);
        //     formData.append("count", count);

        //     try {
        //         const response = await fetch("https://owen.ru/ajax/set-count-price", {
        //             method: "POST",
        //             body: formData,
        //         });

        //         if(!response.ok) {
        //             commit("SET_CART_ERROR", "<b>Ошибка!</b> <br> Не удалось добавить товар в корзину");
        //             throw new Error("response error");
        //         }

        //         getCart();
        //     } catch (error) {
        //         commit("SET_CART_ERROR", "<b>Ошибка!</b> <br> Не удалось добавить товар в корзину");
        //     } finally {
        //         commit("SET_CART_LOADING", false);
        //     }
        // },
    }
}

export default cart;