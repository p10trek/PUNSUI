import ApiService from "@/common/api.service";
import JwtService from "@/common/jwt.service";
import { PURGE_AUTH, SET_ERROR, SET_USER } from "@/store/mutations.type";
import { FETCH_USER, LOGIN, LOGOUT, REGISTER } from "./actions.type";
import { SET_AUTH } from "./mutations.type";

const state = {
	user: {},
	errors: null,
	isAuthenticated: !!JwtService.getRefreshToken(),
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
	},
};

const actions = {
	[REGISTER](context, credentials) {
		return new Promise((resolve) => {
			ApiService.post("Authentication/Register", credentials)
				.then(({ data }) => {
					JwtService.saveAccessToken(data.data.accessToken);
					JwtService.saveRefreshToken(data.data.refreshToken);
					resolve(data);
				})
				.catch(({ data }) => {
					JwtService.destroyAccessToken();
					JwtService.destroyRefreshToken();
					context.commit(SET_ERROR, data.message);
				});
		});
	},

	[LOGIN](context, credentials) {
		return new Promise((resolve) => {
			ApiService.post("Authentication/Login", credentials)
				.then(({ data }) => {
					JwtService.saveAccessToken(data.data.accessToken);
					JwtService.saveRefreshToken(data.data.refreshToken);
					context.commit(SET_AUTH, true);
					resolve(data);
				})
				.catch(({ data }) => {
					JwtService.destroyAccessToken();
					JwtService.destroyRefreshToken();
					context.commit(SET_ERROR, data.message);
				});
		});
	},

	[LOGOUT](context) {
		return new Promise((resolve) => {
			const refreshToken = JwtService.getRefreshToken();
			ApiService.post("Authentication/RevokeToken", { refreshToken })
				.catch(({ data }) => {
					console.log(data);
				})
				.then(() => {
					JwtService.destroyAccessToken();
					JwtService.destroyRefreshToken();
					context.commit(SET_AUTH, false);
					context.commit(PURGE_AUTH);
					resolve();
				});
		});
	},

	[FETCH_USER](context) {
		return new Promise((resolve) => {
			ApiService.post("Authentication/FetchUser")
				.then(({ data }) => {
					context.commit(SET_USER, data.data.user);
					resolve(data);
				})
				.catch(({ data }) => {
					console.log(data);
				});
		});
	},
};

const mutations = {
	[SET_ERROR](state, error) {
		state.errors = error;
	},
	[SET_USER](state, user) {
		state.user = user;
	},
	[PURGE_AUTH](state) {
		state.user = null;
		state.errors = null;
	},
	[SET_AUTH](state, value) {
		state.isAuthenticated = value;
	},
};

export default {
	state,
	actions,
	getters,
	mutations,
};
