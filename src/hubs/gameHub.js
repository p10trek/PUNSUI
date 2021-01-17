// import { signalR } from '@microsoft/signalr'
import JwtService from "@/common/jwt.service";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default {
	install(Vue) {
		const gameHub = new Vue();
		Vue.prototype.$gameHub = gameHub;

		// Provide methods to connect/disconnect from the SignalR hub
		let connection = null;
		let startedPromise = null;
		let manuallyClosed = false;

		const url = process.env.VUE_APP_BASE_URL + "gameHub";

		Vue.prototype.startSignalR = () => {
			connection = new HubConnectionBuilder()
				.configureLogging(LogLevel.Debug)
				.withUrl(url, { accessTokenFactory: JwtService.getAccessToken })
				.build();

			connection.on("PlayerJoined", (playerId) => {
				gameHub.$emit("player-joined", playerId);
			});

			connection.on("Scoreboard", (scores) => {
				gameHub.$emit("scores-received", scores);
			});

			connection.on("GameStarted", () => {
				gameHub.$emit("game-started");
			});

			connection.on("PlayerQuit", (playerId) => {
				gameHub.$emit("player-quit", playerId);
			});

			connection.on("GameEnded", () => {
				gameHub.$emit("game-ended");
			});

			connection.on("PlayerGuessed", (nextPlayerId) => {
				gameHub.$emit("player-guessed", nextPlayerId);
			});

			connection.on("SwitchPlayer", () => {
				gameHub.$emit("switch-player");
			});

			connection.on("NewShowingPlayer", (playerId) => {
				gameHub.$emit("new-showing-player", playerId);
			});

			connection.on("PlayerScored", (nextPlayerId) => {
				gameHub.$emit("player-scored", nextPlayerId);
			});

			connection.on("SendErrorMessage", (message) => {
				gameHub.$emit("error-message", message);
			});

			connection.on("FetchPasswords", (data) => {
				console.log(data);
				gameHub.$emit("fetch-passwords", data);
			});

			// You need to call connection.start() to establish the connection but the client wont handle reconnecting for you!
			// Docs recommend listening onclose and handling it there.
			// This is the simplest of the strategies
			function start() {
				startedPromise = connection.start().catch((err) => {
					console.error("Failed to connect with hub", err);
					return new Promise((resolve, reject) =>
						setTimeout(
							() =>
								start()
									.then(resolve)
									.catch(reject),
							5000,
						),
					);
				});
				return startedPromise;
			}

			connection.onclose(() => {
				if (!manuallyClosed) start();
			});

			// Start everything
			manuallyClosed = false;
			start();
		};
		Vue.prototype.stopSignalR = () => {
			if (!startedPromise) return;

			manuallyClosed = true;
			return startedPromise
				.then(() => connection.stop())
				.then(() => {
					startedPromise = null;
				});
		};

		// Provide methods for components to send messages back to server
		// Make sure no invocation happens until the connection is established
		gameHub.joinGame = (gameId) => {
			if (!startedPromise) return;

			return startedPromise
				.then(() => connection.invoke("JoinGame", gameId))
				.catch(console.error);
		};

		gameHub.quitGame = (gameId) => {
			if (!startedPromise) return;

			return startedPromise
				.then(() => connection.invoke("QuitGame", gameId))
				.catch(console.error);
		};

		gameHub.gameStart = (gameId) => {
			if (!startedPromise) return;

			return startedPromise
				.then(() => connection.invoke("GameStart", gameId))
				.catch(console.error);
		};

		gameHub.gameEnd = (gameId) => {
			if (!startedPromise) return;

			return startedPromise
				.then(() => connection.invoke("GameEnd", gameId))
				.catch(console.error);
		};

		gameHub.playerGuessed = (gameId, nextPlayerId) => {
			if (!startedPromise) return;

			return startedPromise
				.then(() =>
					connection.invoke("PlayerGuessed", gameId, nextPlayerId),
				)
				.catch(console.error);
		};

		gameHub.newShowingPlayer = (gameId, playerId) => {
			if (!startedPromise) return;

			return startedPromise
				.then(() =>
					connection.invoke("NewShowingPlayer", gameId, playerId),
				)
				.catch(console.error);
		};

		gameHub.removeFromGameGroup = (gameId, playerId) => {
			if (!startedPromise) return;
			return startedPromise
				.then(() =>
					connection.invoke("RemoveFromGameGroup", gameId, playerId),
				)
				.catch(console.error);
		};
	},
};
