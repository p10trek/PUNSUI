<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
}

#nav {
	padding: 30px;
}

#nav a {
	font-weight: bold;
	color: #2c3e50;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>

<script>
import { mapGetters } from "vuex";

export default {
	computed: {
		...mapGetters(["getUser"])
	},
	watch: {
		getUser(newVal) {
			if (Object.entries(newVal).length === 0) {
				this.$router.push({ name: "login" });
			} else {
				this.connect();
			}
		}
	}
};
</script>
