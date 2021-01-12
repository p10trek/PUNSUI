/* eslint-disable */
import Login from "@/views/Login";
import Register from "@/views/Register";
import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
		meta: {
			requiresAuth: true
		}
	},
	{
		path: "/login",
		name: "login",
		component: Login
	},
	{
		path: "/register",
		name: "register",
		component: Register
	}
];

const router = new VueRouter({
	routes,
	mode: "history"
});
router.beforeEach((to, from, next) => {
	const { isAuthenticated } = store.getters;
	console.log(isAuthenticated);
	if (to.matched.some((route) => route.meta.requiresAuth)) {
		!isAuthenticated ? next({ name: "login" }) : next();
	}
	if (to.matched.some((route) => !route.meta.requiresAuth)) {
		isAuthenticated ? next({ name: "Home" }) : next();
	}
});
export default router;
