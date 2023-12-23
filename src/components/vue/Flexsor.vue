<template>
  <div class="flex flex-wrap">
    <div
      v-for="(child, index) in children"
      :key="index"
      :class="['flexor-' + columns, { 'flexor-forced-2': forced }]"
      v-html="child"
    ></div>
  </div>
</template>

<script>
export default {
  props: {
    children: {
      type: Array,
      required: true,
    },
    columns: {
      type: Number,
      required: true,
    },
    forced: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
