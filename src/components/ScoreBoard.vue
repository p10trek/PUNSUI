<template>
  <div class="row justify-content-center">
    <h1>Score board</h1>
    <div v-if="playersAreAlreadyDownloaded" class="col-12">
      <h3 v-for="player in players" :key="player.id">{{player.nick + ": " + player.score}}</h3>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
  name: "ScoreBoard",
  computed: {
    ...mapGetters({
      players: 'getPlayers'
    }),
    playersAreAlreadyDownloaded() {
      return this.players !== null && this.players.length > 0
    }
  }
}
</script>

<style scoped>

</style>