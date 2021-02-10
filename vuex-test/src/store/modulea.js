function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
    namespaced: true,
    state: {
        count: 0
    },
    mutations: {
        increment(state, payload) {
            console.log("🚀 ~ file: modulea.js ~ line 12 ~ increment ~ payload", payload)
            state.count += payload
        }
    },
    actions: {
        async incrementAction({ dispatch, commit, getters, rootGetters }, payload) {
            console.log("🚀 ~ file: index.js ~ line 17 ~ incrementAction ~ payload", payload)
            await sleep(2000)
            console.log("🚀 ~ file: index.js ~ line 17 ~ incrementAction ~ payload", payload)
            commit('increment', payload)
        }
    },
    getters: {
        toStringState: (state, getters, rootState, rootGetters) => "" + state.count
    },
    modules: {

    }
}
