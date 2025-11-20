<script setup lang="ts">
import DraggableCard from "@/components/draggableCard/draggableCard.vue";
</script>

<template>
  <div class="draggable-card-container">
    <draggableCard></draggableCard>
  </div>
</template>

<style scoped>
.draggable-card-container {
  width: 100%;
  min-height: 100vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); Removed as per user request */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  box-sizing: border-box;
}
</style>