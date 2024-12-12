// единица давления

const vpiType = {
    state: {
        value: "ВПИ, МПа",
        options: [
            "ВПИ, МПа",
            "ВПИ, кПа",
            "ВПИ, Па",
            "ВПИ, бар",
            "ВПИ, атм"
        ],
    },

    mutations: {
        SET_VPITYPE_DATA(state, payload) {
            state.value = payload;
        },
    },

    actions: {
        updateVpiType({ commit }, val="МПа") {
            commit("SET_VPITYPE_DATA", val);
        }
    },
}

export default vpiType;