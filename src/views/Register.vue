<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Sign up</h1>
          <p class="text-xs-center">
            <router-link :to="{ name: 'login' }">
              Have an account?
            </router-link>
          </p>
          <div v-if="errors" class="error-messages">
            <br>
            {{ errors }}
          </div>
          <form @submit.prevent="onSubmit(nick, email, password)">
            <fieldset class="form-group">
              <input
                  class="form-control form-control-lg"
                  type="text"
                  v-model="nick"
                  placeholder="Username"
              />
            </fieldset>
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
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { REGISTER } from "@/store/actions.type";
import { mapState } from "vuex";


export default {
  name: "Register",
  data() {
    return {
      nick: "",
      email: "",
      password: "",
    };
  },
  methods: {
    onSubmit(nick, email, password) {
      this.$store
          .dispatch(REGISTER, { nick, email, password })
          .then(() => this.$router.push({ name: "Home" }))
    }
  },
  computed: {
    ...mapState({
      errors: state => state.auth.errors
    })
  },
}
</script>

<style scoped>

</style>