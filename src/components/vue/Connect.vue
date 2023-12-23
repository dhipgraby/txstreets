<template>
	<div @click="connect()" v-if="!state.connected || !state.address" class="connectBtn bluegradientBtn"><span><span class="fas fa-wallet mr-1"></span
		>Connect Wallet</span></div>
	<div @click="disconnect" class="button is-danger" v-else>
		{{ shortHash(state.address) }}
	</div>
</template>

<script>
// @ts-nocheck
import { init, disconnect, default as state } from "../../wallet";
import { shortHash } from "../utils";
export default {
	methods: {
		async connect() {
			init();
		},
        shortHash(address){
            return shortHash(address, 5, true);
        },
        disconnect(){
            disconnect();
        }
	},
	computed: {
		state() {
			return state;
		},
	},
};
</script>
<style lang="scss" scoped>
</style>