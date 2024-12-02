const cart = {
    namespaced: true,
    state: {
        data: [],
        loading: false,
        error: "",
    },
  
    mutations: {
        SET_CART_DATA(state, payload) {
            state.data = payload
        },
        SET_CART_LOADING(state, payload) {
            state.loading = payload
        },
        SET_CART_ERROR(state, payload) {
            state.error = payload
        }
    },

    actions: {
        async fetchCartData({ commit }, code, count) {
            commit("SET_CART_LOADING", true);
            try {
                const response = await fetch(`https://owen.ru/ajax/basket?id=${code}&count=${count || 1}`, {
                    headers: {
                        credentials: "include"
                    }
                });
                const data = await response.json();
                commit("SET_CART_DATA", data);
            } catch (error) {
                commit("SET_CART_ERROR", "<b>Ошибка<b> \n Не удалось добавить товар в корзину");
            } finally {
                commit("SET_CART_LOADING", false);
            }
        },
    }
}

export default cart;