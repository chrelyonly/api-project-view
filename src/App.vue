<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="background-main">
    <RouterView />
  </div>
</template>
<!--//background-image:linear-gradient(-225deg,#E3FDF5 ,#FFE6FA 100%)-->
<style scoped>
.background-main {
  width: 100%;
  min-height: 150vh;
  background-image: url(@/static/img/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

</style>
