import ApiService from "@/common/api.service";
import {CREATE_GAME, FETCH_GAME, FETCH_PASSWORD_CATEGORIES, FETCH_PLAYERS} from "@/store/actions.type";
import {
    SET_GAME,
    PURGE_GAME,
    SET_PASSWORDS_CATEGORIES,
    PURGE_PASSWORDS_CATEGORIES, SET_PLAYERS, PURGE_PLAYERS
} from "@/store/mutations.type";


const state = {
    players: [],
    passwordsCategories: [],
    game: {}
}

const getters = {
    getPlayers(state) {
        return state.players;
    },
    getGameMasterId(state) {
        return state.game.gameMasterId;
    },
    getGameId(state) {
        return state.game.id;
    },
    getPasswordCategories(state) {
        return state.passwordsCategories
    },
    getGame(state) {
        return state.game;
    }
}

const actions = {
    [CREATE_GAME](context, gameName) {
        return new Promise(resolve => {
            ApiService.post("Games/Create", {gameName})
                .then(({data}) => {
                    resolve(data)
                }).catch(({data}) => {
                console.log(data)
            })
        })
    },
    [FETCH_PASSWORD_CATEGORIES](context) {
        return new Promise(resolve => {
            ApiService.get("Games/FetchPasswords")
                .then(({data}) => {
                    context.commit(SET_PASSWORDS_CATEGORIES, data.data)
                    resolve(data)
                }).catch(() => {
                context.commit(PURGE_PASSWORDS_CATEGORIES)
            })
        })
    },
    [FETCH_PLAYERS](context) {
        return new Promise(resolve => {
            ApiService.get("Games/FetchPlayers")
                .then(({data}) => {
                    context.commit(SET_PLAYERS, data.data.players)
                    resolve(data)
                }).catch(({data}) => {
                console.log(data)
                context.commit(PURGE_PLAYERS)
            })
        })
    },
    [FETCH_GAME](context) {
        return new Promise(resolve => {
            ApiService.get("Games/FetchGame")
                .then(({data}) => {
                    context.commit(SET_GAME, data.data.game)
                    resolve(data)
                }).catch(({data}) => {
                console.log(data)
            })
        })
    },
}

const mutations = {
    [SET_GAME](state, data) {
        state.game = data;
    },
    [PURGE_GAME](state) {
        state.game = null;
    },
    [SET_PASSWORDS_CATEGORIES](state, data) {
        state.passwordsCategories = data.passwordsCategories;
    },
    [PURGE_PASSWORDS_CATEGORIES](state) {
        state.passwordsCategories = null;
    },
    [SET_PLAYERS](state, data) {
        state.players = data;
    },
    [PURGE_PLAYERS](state) {
        state.players = null;
    },
}

export default {
    state,
    getters,
    mutations,
    actions
};