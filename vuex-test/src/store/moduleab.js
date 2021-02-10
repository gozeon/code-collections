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
            state.count += payload
        }
    },
    actions: {
        async incrementAction({ dispatch, commit }, payload) {
            console.log("🚀 ~ file: index.js ~ line 17 ~ incrementAction ~ payload", payload)
            await sleep(2000)
            console.log("🚀 ~ file: index.js ~ line 17 ~ incrementAction ~ payload", payload)
            commit('increment', payload)
        }
    },
    getters: {
        toStringState: state => "" + state.count
    },
    modules: {

    }
}
