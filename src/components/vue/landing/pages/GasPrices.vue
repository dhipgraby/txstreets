<template>
    <div class="container">

        <div class="ta-c">
            <img v-bind:src="stationImg" alt="gasStation" />
        </div>
        <GasPrices />

        <!-- <div class="vue-grid-item base-fee-chart">
            <StatChart  v-bind="{ statConfig: [{ticker: 'ETH', key: 'baseFee', duration: '2d', interval: '5m' }], options: {title: 'Base Fee'} }"/>
        </div> -->

        <div style="font-size: 1rem;margin-top: 30px;">TxStreet simulates the next 3 blocks in real time, using

            pending transactions. These simulations allow for the most accurate gas price predictions. Depending on the
            fluctuating base fee, the second and third block may have higher fees than the first. It's recommended to use
            the large green values, however if there is a gas war and you need an instant confirmation, you might consider
            overpaying.</div>
    </div>
</template>

<script>
import GasPrices from "../templates/GasPrices.vue"
import stationImg from "../../../../../public/static/img/icons/gasStation.webp"
// import StatChart from  "../templates/StatChart.vue"

export default {
    components: {
        GasPrices,
        // StatChart,
    },
    data() {
        return {
            stationImg: stationImg
        };
    }
}
</script>

<style lang="scss" scoped>
img {
    max-width: 350px;
    animation: neon 1.5s infinite; /* removed "duration" */
    transition: 0.5s;
}

@keyframes neon {
    0% {
        filter: hue-rotate(0deg);
    }

    50% {
        filter: hue-rotate(45deg);
    }

    100% {
        filter: hue-rotate(0deg);
    }
}

.base-fee-chart {
    height: 300px;
}
</style>
