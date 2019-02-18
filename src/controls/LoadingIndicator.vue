<template>
  <v-progress-circular
    v-if="value"
    indeterminate
    color="primary"
  ></v-progress-circular>
</template>

<script>
  export default {
    name: 'loading-indicator',
    props: ['value']
  }
</script>
