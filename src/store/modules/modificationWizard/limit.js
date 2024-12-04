// кол-во строк отображаемых в таблице

const limit = {
    state: {
        value: 10,
    },

    mutations: {
        SET_LIMIT_DATA(state, payload) {
            state.value = payload
        },
    },

    actions: {
        updateLimit({ commit }, val=10) {
            commit("SET_LIMIT_DATA", val);
        }
    },
}

export default limit;