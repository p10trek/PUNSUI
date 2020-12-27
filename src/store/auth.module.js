import ApiService from "@/common/api.service";
import {LOGIN, REGISTER, LOGOUT, FETCH_USER} from "./actions.type";
import {SET_USER, SET_ERROR, PURGE_AUTH} from "@/store/mutations.type";
import JwtService from "@/common/jwt.service";

const state = {
    user: {},
    errors: null,
    isAuthenticated: !!JwtService.getRefreshToken()
};

const getters = {
    getUser(state) {
        return state.user;
    },
    isAuthenticated(state) {
        return state.isAuthenticated;
    },
    getUserId(state) {
        return state.user.id;
    }
};

const actions = {

    [REGISTER](context, credentials) {
        return new Promise(resolve => {
            ApiService.post("Authentication/Register", credentials)
                .then(({data}) => {
                    JwtService.saveAccessToken(data.data.accessToken)
                    JwtService.saveRefreshToken(data.data.refreshToken)
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
                    JwtService.saveAccessToken(data.data.accessToken)
                    JwtService.saveRefreshToken(data.data.refreshToken)
                    resolve(data)
                }).catch(({data}) => {
                JwtService.destroyAccessToken()
                JwtService.destroyRefreshToken()
                console.log(data)
                context.commit(SET_ERROR, data.message)
            })
        })
    },

    [LOGOUT](context) {
        return new Promise(resolve => {
            const refreshToken = JwtService.getRefreshToken();
            ApiService.post("Authentication/RevokeToken", {refreshToken})
                .catch(({data}) =>{
                    console.log(data);
                })
                .then(() => {
                    JwtService.destroyAccessToken()
                    JwtService.destroyRefreshToken()
                    context.commit(PURGE_AUTH)
                    resolve()
                })
            })
    },

    [FETCH_USER](context) {
        return new Promise(resolve => {
            ApiService.post("Authentication/FetchUser")
                .then(({data}) => {
                    context.commit(SET_USER, data.data.user);
                    resolve(data)
                }).catch(({data}) => {
                console.log(data)
            })
        })
    },
}

const mutations = {
    [SET_ERROR](state, error) {
        state.errors = error
    },
    [SET_USER](state, user) {
        state.user = user
    },
    [PURGE_AUTH](state) {
        state.user = null;
        state.errors = null;
    }
}

export default {
    state,
    actions,
    getters,
    mutations
};
