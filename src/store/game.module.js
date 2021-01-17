import ApiService from "@/common/api.service";
import {
	CREATE_GAME,
	FETCH_GAME,
	FETCH_PASSWORD_CATEGORIES,
	FETCH_PLAYERS,
} from "@/store/actions.type";
import {
	PURGE_GAME,
	PURGE_PASSWORDS_CATEGORIES,
	PURGE_PLAYERS,
	SET_GAME,
	SET_PASSWORDS_CATEGORIES,
	SET_PLAYERS,
	SET_SCOREBOARD,
} from "@/store/mutations.type";

const state = {
	players: [],
	passwordsCategories: [],
	game: {},
	scores: [],
};

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
		return state.passwordsCategories;
	},
	getGame(state) {
		return state.game;
	},
	getScores: (state) => state.scores,
};

const actions = {
	[CREATE_GAME](context, gameName) {
		return new Promise((resolve) => {
			ApiService.post("Games/Create", { gameName })
				.then(({ data }) => {
					resolve(data);
				})
				.catch(({ data }) => {
					console.log(data);
				});
		});
	},
	[FETCH_PASSWORD_CATEGORIES](context) {
		return new Promise((resolve) => {
			ApiService.get("Games/FetchPasswords")
				.then(({ data }) => {
					context.commit(SET_PASSWORDS_CATEGORIES, data.data);
					resolve(data);
				})
				.catch(() => {
					context.commit(PURGE_PASSWORDS_CATEGORIES);
				});
		});
	},
	[FETCH_PLAYERS](context) {
		return new Promise((resolve) => {
			ApiService.get("Games/FetchPlayers")
				.then(({ data }) => {
					console.log(data);
					context.commit(SET_PLAYERS, data.data.players);
					resolve(data);
				})
				.catch(({ data }) => {
					console.log(data);
					context.commit(PURGE_PLAYERS);
				});
		});
	},
	[FETCH_GAME](context) {
		return new Promise((resolve) => {
			ApiService.get("Games/FetchGame")
				.then(({ data }) => {
					context.commit(SET_GAME, data.data.game);
					resolve(data);
				})
				.catch(({ data }) => {
					console.log(data);
				});
		});
	},
	[SET_SCOREBOARD](context, scores) {
		context.commit(SET_SCOREBOARD, scores);
	},
};

const mutations = {
	[SET_GAME](state, data) {
		state.game = data;
	},
	[PURGE_GAME](state) {
		state.game = null;
	},
	[SET_PASSWORDS_CATEGORIES](state, data) {
		state.passwordsCategories = data.passwordCategories;
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
	[SET_SCOREBOARD](state, scores) {
		state.scores = scores;
	},
};

export default {
	state,
	getters,
	mutations,
	actions,
};
