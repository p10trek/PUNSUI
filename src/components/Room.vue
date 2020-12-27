<template>
  <div class="container">
    <div class="row">
      <h3>Rooms:</h3>
      <div class="col-12" v-if="rooms === null">
        <h1>No room found</h1>
        <br/>
      </div>
      <div v-else class="col-12">
        <div class="room" v-for="room in rooms" :key="room.id">
          {{ room.roomName }}
          <span v-if="room.id === user.roomId">
            <BIconCheck></BIconCheck>
          </span>
          <span v-else>
            <button @click="joinRoom(room.id)">Join Room</button>
          </span>
        </div>
      </div>

      <div class="row mt-3">
      <div class="col-12">
        <label>
          <input placeholder="Room name" type="text" v-model="roomName">
          <button @click="createRoom">Create Room</button>
        </label>
      </div>
      </div>

    </div>

    <br>

    <div class="row" v-if="games !== null && games.length !== 0">
      <h3>Games:</h3>
      <div v-for="game in games" :key="game.id" class="col-12 game">
        <div class="col-12">
          {{ game.name }}
          <span v-if="game.id === user.gameId">
            <BIconCheck></BIconCheck>
          </span>
          <span v-if="game.id !== user.gameId">
            <button @click="joinGame(game.id)">Join Game</button>
          </span>
        </div>
      </div>
    </div>
    <div v-else class="row">
      <h1>No games found</h1>
    </div>

    <div class="row mt-3">
      <div class="col-12">
      <label>
        <input placeholder="Game name" type="text" v-model="gameName">
        <button @click="createGame">Create game</button>
      </label>
    </div>
    </div>

  </div>


</template>

<script>
import {mapGetters} from "vuex";
import {
  CREATE_ROOM, FETCH_GAMES, FETCH_USER, CREATE_GAME, FETCH_ROOMS, JOIN_ROOM, FETCH_GAME
} from "@/store/actions.type";
import {BIconCheck} from 'bootstrap-vue'

export default {
  name: "Room",
  data() {
    return {
      roomName: '',
      gameName: ''
    }
  },
  components: {
    BIconCheck
  },
  computed: {
    ...mapGetters({
      games: "getGames",
      user: "getUser",
      rooms: "getRooms"
    })
  },
  created() {
    this.$store.dispatch(FETCH_GAMES)
  },
  methods: {
    joinRoom(roomId) {
      this.$store.dispatch(JOIN_ROOM, roomId)
          .then(() => this.fetchData());
    },
    joinGame(gameId) {
      this.$gameHub.joinGame(gameId)
          .then(() => this.playerJoinedToGame(gameId))
          .then(() => this.fetchData());
    },
    createGame() {
      this.$store.dispatch(CREATE_GAME, this.gameName)
          .then(() => this.fetchUser())
          .then(() => this.fetchGames())
          .then(this.$gameHub.joinGame(this.user.gameId))
          .then(() => this.playerJoinedToGame(this.user.gameId));
    },
    createRoom() {
      this.$store.dispatch(CREATE_ROOM, this.roomName)
          .then(() => this.fetchData());
    },
    fetchUser() {
      this.$store.dispatch(FETCH_USER);
    },
    fetchRooms() {
      this.$store.dispatch(FETCH_ROOMS)
    },
    fetchGames() {
      this.$store.dispatch(FETCH_GAMES)
    },
    playerJoinedToGame(gameId) {
      this.$gameHub.joinGame(gameId)
          .then(() => this.$store.dispatch(FETCH_GAME))

      this.$parent.$emit("user-joined-to-game", gameId)
    },
    fetchData() {
      this.fetchUser()
      this.fetchRooms()
      this.fetchGames()
    }
  }
}
</script>

<style scoped>

.game {
  margin-bottom: 5px;
  margin-top: 5px;
}

.room {
  margin-bottom: 5px;
  margin-top: 5px;
}

</style>