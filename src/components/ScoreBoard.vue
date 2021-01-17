<template>
	<div class="row col-12">
		<h1>Score board</h1>
		<div class="d-flex flex-column">
			<div v-for="item in getScores" :key="item.nickname">
				{{ item.nickname }} {{ item.score }}
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
	name: "ScoreBoard",
	computed: {
		...mapGetters(["getScores"]),
	},
};
</script>

<style scoped></style>
