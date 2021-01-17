<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-12 text-right">
				<button @click="logout" class="btn-dark">Log out</button>
			</div>
		</div>
		<div class="row">
			<div class="col-12 col-md-6">
				<GameBoard></GameBoard>
			</div>
			<div class="col-6 col-md-3">
				<ScoreBoard></ScoreBoard>
			</div>
			<div class="col-6 col-md-3" v-if="user !== null">
				<Room></Room>
			</div>
		</div>
	</div>
</template>

<script>
// @ is an alias to /src
import GameBoard from "@/components/GameBoard";
import Room from "@/components/Room";
import ScoreBoard from "@/components/ScoreBoard";
import {
	LOGOUT,
	FETCH_USER,
	FETCH_ROOMS,
	FETCH_GAMES,
} from "@/store/actions.type";
import { mapGetters } from "vuex";

export default {
	name: "Home",
	components: {
		GameBoard,
		Room,
		ScoreBoard,
	},
	methods: {
		logout() {
			this.$store
				.dispatch(LOGOUT)
				.then(() => this.$router.push({ name: "login" }));
		},
	},
	computed: {
		...mapGetters({
			isAuthenticated: "isAuthenticated",
			user: "getUser",
		}),
	},
	created() {
		if (!this.isAuthenticated) {
			this.$router.push({ name: "login" });
		}
		this.$gameHub.stopSignalR();
		this.$store.dispatch(FETCH_USER);
		this.$store.dispatch(FETCH_ROOMS);
		this.$store.dispatch(FETCH_GAMES);
		this.$gameHub.startSignalR();
	},
	beforeDestroy() {
		this.$gameHub.stopSignalR();
	},
};
</script>
