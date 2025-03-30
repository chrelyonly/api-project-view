<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="background-main">
    <RouterView />
  </div>
</template>

<style scoped>
.background-main{
  width: 100%;
  min-height: 100vh;
  background-image:linear-gradient(-225deg,#E3FDF5 ,#FFE6FA 100%)
}
</style>
