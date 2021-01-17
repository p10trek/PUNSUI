<template>
	<div class="auth-page vw-100 vh-100">
		<div class="container page ">
			<div class="row">
				<div
					class="col-md-6 offset-md-3 vh-100 d-flex justify-content-center align-items-center"
				>
					<b-card>
						<template #header>
							<h4 class="mb-0">Sign in</h4>
						</template>
						<b-card-body>
							<div v-if="errors" class="error-messages">
								<br />
								{{ errors }}
							</div>
							<form @submit.prevent="onSubmit(email, password)">
								<fieldset class="form-group">
									<input
										class="form-control form-control-lg"
										type="text"
										v-model="email"
										placeholder="Email"
									/>
								</fieldset>
								<fieldset class="form-group">
									<input
										class="form-control form-control-lg"
										type="password"
										v-model="password"
										placeholder="Password"
									/>
								</fieldset>
								<button
									class="btn btn-lg btn-primary pull-xs-right"
								>
									Sign in
								</button>
								<p class="text-xs-center">
									<router-link :to="{ name: 'register' }">
										Need an account?
									</router-link>
								</p>
							</form>
						</b-card-body>
					</b-card>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { LOGIN } from "@/store/actions.type";
import { mapState, mapActions, mapGetters } from "vuex";
import JwtService from "@/common/jwt.service";

export default {
	name: "Login",
	data() {
		return {
			email: null,
			password: null,
		};
	},
	methods: {
		...mapActions([LOGIN]),
		async onSubmit(email, password) {
			await this[LOGIN]({ email, password });
		},
	},
	computed: {
		...mapGetters(["isAuthenticated"]),
		...mapState({
			errors: (state) => state.auth.errors,
		}),
	},
	created() {
		JwtService.destroyAccessToken();
		JwtService.destroyRefreshToken();
	},
	watch: {
		isAuthenticated(newVal) {
			if (newVal) {
				console.log(newVal);
				this.$router.push({ name: "Home" });
			}
		},
	},
};
</script>

<style scoped></style>
