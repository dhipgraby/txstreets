<template>
	<div class="html-container">
		<div v-if="!$root.loadError" :class="{ 'grow-trans': $root.loading, splash: splash }" class="box launch-visualizer">
			<div class="launch-bg-overlay"></div>
			<div class="launch-bg-container">
				<div class="launch-bg launch-bg-left">
					<div class="launch-bg-inner" :style="bgInnerStyle(0)"></div>
				</div>
				<div class="launch-bg launch-bg-right">
					<div class="launch-bg-inner" :style="bgInnerStyle(1)"></div>
				</div>
			</div>
			<div class="launch-container">
				<div class="launcher-logo-container">
					<img v-if="splash" class="launcher-logo tag" :src="'/static/img/icons/logo' +
						($root.darkMode ? '_darkmode' : '') +
						'.svg?v=' +
						$root.appVersion
						" />
				</div>
				<div v-if="!$root.loading">
					<div class="launcher-container">

						<!-- LAUNCHER -->
						<div class="launcher-box">
							<button @click="launch()" class="launchBtn bluegradientBtn"><span>LAUNCH STREETS</span></button>
							<div class="glow"></div>
							<div class="particles" id="particleContainer"></div>
						</div>

						<!-- DROPDOWN COIN BOXES -->
						<div>
							<div v-for="(coin, i) in selectedCoins" :key="'dropdown-' + coin"
								class="dropdown is-hoverable is-up" :class="{
									'is-right': i === 1,
								}">
								<div class="dropdown-trigger">
									<button class="button theme-button is-large mr-1 z-2"
										style="line-height: 28px; border-radius: 50px;border: solid 2px #000000;">
										<span v-if="coin" class="coin-logo"
											:style="'background-color: #' + $root.bgColor(coin) + ';'">
											<img :src="config.baseUrl +
												'static/img/singles/coin_logos/' +
												coin.toLowerCase() +
												'.png?v=' +
												$root.appVersion
												" width="28" height="28" />
										</span>
										<span
											v-if="$root.$refs.landing && $root.$refs.landing.enabledConfig[coin] && $root.$refs.landing.enabledConfig[coin].coinName">{{
												$root.$refs.landing.enabledConfig[coin].coinName }}</span>
										<span v-else>?</span>
										<span class="icon is-normal"><span class="fas fa-chevron-up"></span></span>
									</button>
								</div>
								<div v-if="$root.$refs.landing" class="dropdown-menu">
									<div class="dropdown-content">
										<template v-for="dropCoin in $root.$refs.landing.enabledConfig">
											<a :key="'dropdownopt-' + dropCoin.ticker"
												@click="changeVisDropdown(i, dropCoin.ticker)"
												class="dropdown-item navbar-item">
												<span class="coin-logo"
													:style="'background-color: #' + $root.bgColor(dropCoin.ticker) + ';'">
													<img :src="config.baseUrl +
														'static/img/singles/coin_logos/' +
														dropCoin.ticker.toLowerCase() +
														'.png?v=' +
														$root.appVersion
														" width="28" height="28" />
												</span>
												<span>
													{{ $root.$refs.landing.enabledConfig[dropCoin.ticker].coinName
													}}</span></a>
										</template>
										<hr class="dropdown-divider" />
										<a @click="changeVisDropdown(i, null)" class="dropdown-item navbar-item"><span
												class="fas fa-times-circle"></span>&nbsp;NONE</a>
									</div>
								</div>
							</div>
						</div>

						<div class="field dual-view unselectable mt-2">
							<div>
								<input v-model="autoLoad" class="switch" id="auto-load" type="checkbox" name="auto-load" />
								<label for="auto-load">Auto Launch</label>
							</div>
							<div v-if="$root.$refs.landing &&
								$root.$refs.landing.isMobile &&
								$root.selectedCoins[1] !== null
								">
								<input v-model="dualView" class="switch" id="dual-view" type="checkbox" name="dual-view" />
								<label for="dual-view">Load Two (Desktop)</label>
							</div>
						</div>

					</div>
				</div>
				<div v-else class="lds-ellipsis">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
		</div>
		<div class="box has-text-centered has-text-danger" v-else>
			<span class="fas fa-exclamation-circle"></span> Error loading. Please refresh the page.
		</div>
	</div>
</template>
<script>
import { config, enabledConfig } from "../../../config";
import { newStat } from "../controllers/statistic";
export default {
	data: function () {
		return {
			dualView: false,
			autoLoad: this.$root.autoLoad,
			statistics: {},
			// neededRooms: [],
		};
	},
	methods: {
		launch() {
			this.$root.selectedCoins = this.selectedCoins;
			this.$root.openVisualizer();
		},
		changeVisDropdown(i, ticker) {
			this.$root.changeVisDropdown(i, ticker, this.$root.$refs.landing.activeKey === "home");
			if (i === 1) this.dualView = true;
			this.$root.$refs.landing.refresh();
			this.$forceUpdate();
		},
		bgInnerStyle(i) {
			let otherIndex = !i ? 2 : 0;
			let ticker = null;
			if (this.selectedCoins[i]) {
				ticker = this.selectedCoins[i];
			} else if (this.selectedCoins[otherIndex]) {
				ticker = this.selectedCoins[otherIndex];
			}

			let bannerTicker = ticker;
			if (bannerTicker === "ARBI") bannerTicker = "ETH";
			let style = bannerTicker
				? "background-image: url(/static/img/banners/" +
				bannerTicker.toLowerCase() +
				".jpg?v=" +
				process.env.VUE_APP_VERSION +
				");"
				: "";
			return style;
		},
		getNeededStats(tickers) {
			for (let i = 0; i < tickers.length; i++) {
				const ticker = tickers[i];
				if (!ticker) continue;
				if (!this.statistics[ticker]) this.statistics[ticker] = [];
				const coinConfig = enabledConfig[ticker];
				for (const key in coinConfig.stats) {
					const stat = coinConfig.stats[key];
					if (!stat.socket) continue;
					const statInstance = newStat(ticker, key);
					this.statistics[ticker].push(statInstance);
				}
			}
			for (const ticker in this.statistics) {
				if (tickers.includes(ticker)) continue;
				const existingStatTicker = this.statistics[ticker];
				for (let i = existingStatTicker.length - 1; i >= 0; i--) {
					const stat = existingStatTicker[i];
					stat.stop();
					existingStatTicker.splice(i, 1);
				}
				delete this.statistics[ticker];
			}
		},
		createParticles(particles) {
			const particleContainer = document.getElementById('particleContainer');
			let particleCount = 0;

			function addParticle() {
				const particle = document.createElement('div');
				particle.className = 'rotate';
				particle.style = `left:${(particleCount * 3)}% !important;`;

				const angle = document.createElement('div');
				angle.className = 'angle';

				const size = document.createElement('div');
				size.className = 'size';

				const position = document.createElement('div');
				position.className = 'position';

				const pulse = document.createElement('div');
				pulse.className = 'pulse';

				const particleElement = document.createElement('div');
				particleElement.className = 'particle';

				pulse.appendChild(particleElement);
				position.appendChild(pulse);
				size.appendChild(position);
				angle.appendChild(size);
				particle.appendChild(angle);
				particleContainer.appendChild(particle);

				// Increment the particle count
				particleCount++;

				// Check if all particles are created, clear interval if true
				if (particleCount === particles) {
					clearInterval(intervalId);
				}
			}

			function randomIntFromInterval(min, max) {
				return Math.floor(Math.random() * (max - min + 1) + min);
			}

			// Use setInterval to add a new particle at a fixed interval with random delay
			const intervalId = setInterval(() => {
				const randomDelay = randomIntFromInterval(500, 1000);

				setTimeout(() => {
					console.log("creating particle");
					addParticle();
				}, randomDelay)

			}, 500); // Adjust the interval (in milliseconds) as needed
		}

	},
	beforeDestroy() {
		this.getNeededStats([]);
	},
	mounted() {
		const tickers = this.selectedCoins;
		console.log('ticker:', tickers);
		this.getNeededStats(tickers);
		this.createParticles(30)
	},
	computed: {
		selectedCoins: {
			get() {
				if (this.$root.$refs.landing && this.$root.$refs.landing.isMobile && !this.dualView) {
					return [this.$root.selectedCoins[0], null];
				}
				return this.$root.selectedCoins;
			},
			set(val) {
				this.$root.selectedCoins = val.toUpperCase();
				return val;
			},
		},
		config() {
			return config;
		},
		splash() {
			return (this.$root.loading && this.$root.loaded) || (this.$root.autoLoading && this.$root.loading);
		},
	},
	watch: {
		autoLoad(val) {
			this.$root.autoLoad = val;
		},
		selectedCoins(newVal) {
			this.getNeededStats(newVal);
		},
	},
};
</script>
<style lang="scss" scoped>
#zoomer_video {

	.title,
	.subtitle {
		color: black !important;
	}

	.zoomer-info {
		padding-left: 2rem;
		padding-right: 2rem;
	}

	margin-top: 2rem;
	padding: 0.5rem !important;

	video {
		height: 180px;
		width: 180px;
		border-radius: 10px;
		display: inline-block;
	}

	.button {
		font-size: 1.4rem !important;
	}
}

.launch-visualizer {
	border-radius: 0 !important;

	.launch-bg-overlay {
		position: absolute;
		height: 100%;
		width: 100%;
		top: 0;
		left: 0;
		background: rgba($color: #1f1f1f, $alpha: 0.8);
		z-index: 0;
	}

	.launch-bg {
		border-radius: 0 !important;
	}

	.launcher-box {
		display: inline-block;
		position: relative;
		background: rgba(0, 0, 0, 0.3);
		padding: 20px;
		border-radius: 20px;
		box-shadow: 0px 0px 100px 100px rgba(0, 0, 0, 0.3);
	}
}

.launch-visualizer.splash {
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	pointer-events: initial !important;
	z-index: 501 !important;

	.launch-bg-overlay {
		display: none;
	}

	.launch-bg {
		filter: brightness(1) !important;
	}

	.launch-container {
		bottom: 60%;
	}

	.launcher-container {
		max-width: 700px;
	}

	.launcher-logo-container {
		display: block;
		width: 100%;
		text-align: center;

		img {
			width: 500px;
			max-width: 60%;
			min-height: 100px;
			padding: 20px;
			display: inline-block;
		}
	}
}

.dual-view {
	white-space: nowrap;
}

label {
	color: white;
	border-radius: 50px !important;
	text-shadow: 2px 5px 2px #000;
}

label::before {
	background: #a0a0a0 !important;
	border-radius: 50px !important;
	box-shadow: 0px 2px 10px 2px black;
}

label::after {
	background: #0675a1 !important;
	box-shadow: 0px 0px 0px 0px black;
	border-radius: 50px !important;
}

#auto-load:checked+label::after {
	background: rgb(25, 255, 197) !important;
	box-shadow: 0px 2px 10px 3px black;
}

#auto-load:checked+label::before {
	background: #ffffff !important;
}


.lds-ellipsis {
	display: inline-block;
	position: relative;
	width: 80px;
	height: 80px;
}

.lds-ellipsis div {
	position: absolute;
	top: 33px;
	width: 13px;
	height: 13px;
	border-radius: 50%;
	background: #fff;
	animation-timing-function: cubic-bezier(0, 1, 1, 0);
}

.lds-ellipsis div:nth-child(1) {
	left: 8px;
	animation: lds-ellipsis1 0.6s infinite;
}

.lds-ellipsis div:nth-child(2) {
	left: 8px;
	animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(3) {
	left: 32px;
	animation: lds-ellipsis2 0.6s infinite;
}

.lds-ellipsis div:nth-child(4) {
	left: 56px;
	animation: lds-ellipsis3 0.6s infinite;
}

@keyframes lds-ellipsis1 {
	0% {
		transform: scale(0);
	}

	100% {
		transform: scale(1);
	}
}

@keyframes lds-ellipsis3 {
	0% {
		transform: scale(1);
	}

	100% {
		transform: scale(0);
	}
}

@keyframes lds-ellipsis2 {
	0% {
		transform: translate(0, 0);
	}

	100% {
		transform: translate(24px, 0);
	}
}
</style>