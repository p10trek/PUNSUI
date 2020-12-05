import ApiService from "@/common/api.service";
import {LOGIN, SET_USER, SET_ERROR, REGISTER} from "./actions.type";
import JwtService from "@/common/jwt.service";

const state = {
    user: {},
    errors: null
};

const getters = {
    getUser(state) {
        return state.user;
    }
};

const actions = {

    [REGISTER](context, credentials) {
        return new Promise(resolve => {
            ApiService.post("Authentication/Register", credentials)
                .then(({data}) => {
                    resolve(data)
                }).catch(({data}) => {
                JwtService.destroyAccessToken()
                JwtService.destroyRefreshToken()
                context.commit(SET_ERROR, data.message)
            })
        })
    },

    [LOGIN](context, credentials) {
        return new Promise(resolve => {
            ApiService.post("Authentication/Login", credentials)
                .then(({data}) => {
                    console.log(data)
                    JwtService.saveAccessToken(data.data.accessToken)
                    JwtService.saveRefreshToken(data.data.refreshToken)
                    context.commit(SET_USER, data.data)
                    resolve(data)
                }).catch(({data}) => {
                JwtService.destroyAccessToken()
                JwtService.destroyRefreshToken()
                console.log(data)
                context.commit(SET_ERROR, data.message)
            })
        })
    }
}

const mutations = {
    [SET_ERROR](state, error) {
        state.errors = error
    },
    [SET_USER](state, user) {
        state.user = user
    }
}

export default {
    state,
    actions,
    getters,
    mutations
};
