import {FETCH_GAMES, CREATE_ROOM, FETCH_ROOMS, JOIN_ROOM} from "@/store/actions.type";
import ApiService from "@/common/api.service";
import {PURGE_GAMES, PURGE_ROOMS, SET_GAMES, SET_ROOMS} from "@/store/mutations.type";

const state = {
    games: [],
    rooms: []
}

const getters = {
    getGames(state) {
        return state.games;
    },
    getRooms(state) {
        return state.rooms;
    }
}

const actions = {
    [FETCH_GAMES](context) {
        return new Promise(resolve => {
            ApiService.get("Rooms/FetchGames")
                .then(({data}) => {
                    context.commit(SET_GAMES, data.data)
                    resolve(data)
                }).catch(() => {
                context.commit(PURGE_GAMES)
            })
        })
    },
    [CREATE_ROOM](context, roomName) {
        return new Promise(resolve => {
            ApiService.post("Rooms/Create", {
                roomName, playerMinCount: 2,
                playerMaxCount: 10
            })
                .then(({data}) => {
                    console.log(data);
                    //context.commit(SET_GAMES, data.data)
                    resolve(data)
                }).catch(() => {
                //context.commit(PURGE_GAMES)
            })
        })
    },
    [FETCH_ROOMS](context) {
        return new Promise(resolve => {
            ApiService.get("Rooms/FetchRooms")
                .then(({data}) => {
                    context.commit(SET_ROOMS, data.data.rooms)
                    resolve(data)
                }).catch(() => {
                context.commit(PURGE_ROOMS)
            })
        })
    },
    [JOIN_ROOM](context, roomId) {
        return new Promise(resolve => {
            ApiService.get('Rooms/Join', roomId)
                .then(({data}) => {
                    resolve(data)
                }).catch(({data}) => {
                console.log(data)
            })
        })
    },
}

const mutations = {

    [SET_GAMES](state, data) {
        state.games = data.games;
    },

    [PURGE_GAMES](state) {
        state.games = null;
    },
    [SET_ROOMS](state, data) {
        state.rooms = data;
    },
    [PURGE_ROOMS](state) {
        state.rooms = null;
    },
}

export default {
    state,
    getters,
    mutations,
    actions
};