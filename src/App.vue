<script setup>
import { RouterView } from 'vue-router'
import {nextTick} from "vue";
// 在 Vue 实例挂载后隐藏 loading
nextTick (() => {
  const loadingElement = document.getElementById('loading')
  if (loadingElement) {
    loadingElement.style.opacity = '0'
    loadingElement.style.visibility = 'hidden'
  }
})



const borderImage = ref('')

const setBorderImage = () => {
  const isMobile = window.innerWidth <= 768
  borderImage.value = new URL(
      isMobile
          ? '/src/static/img/border/phone1.png'
          : '/src/static/img/border/pc1.png',
      import.meta.url
  ).href
}

onMounted(() => {
  setBorderImage()
  window.addEventListener('resize', setBorderImage)
})
</script>

<template>
  <div class="background-main">

    <div class="page-frame animate-frame">
      <el-image class="frame-overlay" :src="borderImage" />
    </div>
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
@keyframes frameIn {
  0% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.page-frame {
  position: fixed;
  pointer-events: none; /* 避免遮挡点击 */
  z-index: 100;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.frame-overlay {
  width: 100%;
  height: 100%;
}

.animate-frame {
  animation: frameIn 0.5s ease-out forwards;
}
</style>
