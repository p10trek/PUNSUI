<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign in</h1>
          <p class="text-xs-center">
            <router-link :to="{ name: 'register' }">
              Need an account?
            </router-link>
          </p>
          <div v-if="errors" class="error-messages">
            <br>
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
            <button class="btn btn-lg btn-primary pull-xs-right">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {LOGIN} from "@/store/actions.type";
import {mapState} from "vuex";
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
    onSubmit(email, password) {
      this.$store
          .dispatch(LOGIN, { email, password })
          .then(() => this.$router.push({ name: "Home" }))
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  },
  created() {
    JwtService.destroyAccessToken();
    JwtService.destroyRefreshToken();
  }
}
</script>

<style scoped>

</style>