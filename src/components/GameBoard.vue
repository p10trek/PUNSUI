<template>
  <div class="container mb-5">

    <h1>Game Board</h1>

    <div class="row">
      <div class="col-12">
        <h2>{{ message }}</h2>
      </div>
    </div>

    <div v-if="!isMinimumTwoPlayers && isUserInGame" class="row">
      <div class="col-12">
        <h2>Waiting for other player</h2>
      </div>
    </div>

    <div v-if="showingPlayer !== ''" class="row">
      <div class="col-12">
        <h3>Showing: {{ showingPlayer }}</h3>
      </div>
    </div>

    <div v-if="gameMasterCanStartGame" class="row">
      <div class="col-12">
        <button @click="this.startGame">Start Game</button>
      </div>
    </div>

    <br><br>

<!--    <div v-if="isGameStarted && !isGameEnded && isUserShowingPlayer" class="row justify-content-center">-->
    <div v-if="isSelectCategoryStage" class="row justify-content-center">
      <h4>Choose category:</h4>
      <br><br>
      <div v-for="passwordCategory in passwordsCategories" :key="passwordCategory.id" class="col-12">
        <button @click="selectPasswordCategory(passwordCategory.id)">{{ passwordCategory.name }}</button>
        <br><br>
      </div>
    </div>


    <div v-if="isShowingStage" class="row">
      <div class="col-12">
        <h2>Show password: {{password}}</h2>
        <h2> Select the player who guessed</h2>
      </div>
      <div v-for="player in playersWithoutUser" :key="player.id" class="col-12 my-2">
        <button @click="this.selectNextPlayer(player.id)">{{ player.nick }}</button>
      </div>
    </div>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {FETCH_GAME, FETCH_PASSWORD_CATEGORIES, FETCH_PLAYERS, FETCH_USER} from "@/store/actions.type";

export default {
  name: "GameBoard",
  data() {
    return {
      message: '',
      userInGame: false,
      isSelectCategoryStage: false,
      isShowingStage: false,
      password: ''
    }
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      gameId: "getGameId",
      passwordsCategories: "getPasswordCategories",
      game: "getGame",
      players: "getPlayers",
      gameMasterId: "getGameMasterId",
      userId: "getUserId"
    }),
    playersWithoutUser() {
      return this.players.filter(x => x.id !== this.user.id)
    },
    playersAreAlreadyDownloaded() {
      return this.players !== undefined;
    },
    isUserMaster() {
      if (this.user !== null && this.game !== null) {
        return this.userId === this.gameMasterId;
      }
      return false;
    },
    isGameStarted() {
      if (this.game !== null) {
        return this.game.gameStarted && !this.game.gameEnded;
      }
      return false;
    },
    isGameEnded() {
      if (this.game !== null) {
        return !this.game.gameStarted && this.game.gameEnded;
      }
      return false;
    },
    isMinimumTwoPlayers() {
      return this.players !== undefined && this.players !== null && this.players.length >= 2
    },
    isUserInGame() {
      if (this.user !== null) {
        return this.user.gameId !== null;
      }
      return false;
    },
    showingPlayer() {
      if (this.players !== undefined && this.players !== null && this.players >= 2 && this.game !== null) {
        const player = this.players.find(x => x.id === this.game.showingPlayerId);
        console.log("player: " + player);
        if (player !== null) {
          return player.nick;
        }
      }
      return '';
    },
    isUserShowingPlayer() {
      if (this.user !== null && this.game !== null) {
        return this.user.id === this.game.showingPlayerId;
      }
      return false;
    },
    gameMasterCanStartGame() {
      return !this.isGameStarted && !this.isGameEnded && this.isUserMaster && this.isMinimumTwoPlayers;
    }
  },
  methods: {
    userJoinedToGame() {
      this.fetchPlayers()
      this.playerJoined(this.user.id)
      this.userInGame = true;
    },
    playerJoined(playerId) {
      this.$store.dispatch(FETCH_PLAYERS)
          .then(() => {
            const player = this.players.find(x => x.id === playerId);
            this.message = player.nick + " joined the game";
          })
    },
    playerQuit(playerId) {
      const player = this.players.find(x => x.id === playerId);
      this.message = player.nick + " left the game";
    },
    gameStarted() {
      this.message = "The game has started";
    },
    gameEnded() {
      this.message = "The game is over";
    },
    // switchPlayer() {
    //   //tutaj chyba musi ogarnąć, że ty odpowiadasz
    // },
    quitGame() {
      this.$gameHub.quitGame(this.user.gameId)
          .then(() => {
            this.message = ''
            this.userInGame = false;
          })
    },
    startGame() {
      this.$gameHub.gameStart(this.game.id)
          .then(() => {
                this.$store.dispatch(FETCH_GAME);
                const nextShowingPlayer = this.players[Math.floor(Math.random() * this.players.length)];
                this.selectNextPlayer(nextShowingPlayer.id);
              }
          )
    },
    selectNextPlayer(nextPlayerId) {
      this.$gameHub.playerGuessed(this.gameId, nextPlayerId);
      //this.userIsShowingPlayer = false;
    },
    playerGuessed(nextPlayerId) {
      if (nextPlayerId === this.user.id) {
        this.$gameHub.newShowingPlayer(this.user.gameId, nextPlayerId)
            .then(() => this.message = "Teraz Ty pokazujesz")
        //this.$gameHub.switchPlayer(this.gameId)
        //this.userIsShowingPlayer = true;
      }
    },
    newShowingPlayer(playerId) {
      this.$store.dispatch(FETCH_GAME)
          .then(() => {
            console.log("next player ID " + playerId)
            const player = this.players.find(x => x.id === playerId);
            this.message = player.nick + " now showing";
          })
    },
    fetchPlayers() {
      this.$store.dispatch(FETCH_PLAYERS, this.gameId);
    },
    selectPasswordCategory(id) {
      const passwords = this.passwordsCategories.find(x => x.id === id).passwords;
      this.password = passwords[Math.floor(Math.random() * passwords.length)].name;
      this.isSelectCategoryStage = false;
      this.isShowingStage = true;
    }
  },
  created() {
    this.$parent.$on("user-joined-to-game", this.userJoinedToGame)
    this.$gameHub.$on("player-joined", this.playerJoined)
    this.$gameHub.$on("game-started", this.gameStarted)
    this.$gameHub.$on("player-quit", this.playerQuit)
    this.$gameHub.$on("game-ended", this.gameEnded)
    this.$gameHub.$on("player-guessed", this.playerGuessed)
    //this.$gameHub.$on("switch-player", this.switchPlayer)
    this.$gameHub.$on("new-showing-player", this.newShowingPlayer)
    this.$gameHub.$on("fetch-passwords", this.fetchPasswords)
    this.$store.dispatch(FETCH_PASSWORD_CATEGORIES);
    this.$store.dispatch(FETCH_PLAYERS);
    this.$store.dispatch(FETCH_USER)
        .then(() => {
          if (this.user.gameId !== null) {
            this.$store.dispatch(FETCH_GAME)
            this.$gameHub.joinGame(this.user.gameId);
          }
        })
  },
  beforeDestroy() {
    this.$gameHub.removeFromGameGroup(this.gameId, this.user.id);
    this.$parent.$off("user-joined-to-game")
    this.$gameHub.$off("player-joined")
    this.$gameHub.$off("game-started")
    this.$gameHub.$off("player-quit")
    this.$gameHub.$off("game-ended")
    this.$gameHub.$off("player-guessed")
    //this.$gameHub.$off("switch-player")
    this.$gameHub.$off("new-showing-player")
  }
}
</script>

<style scoped>

</style>