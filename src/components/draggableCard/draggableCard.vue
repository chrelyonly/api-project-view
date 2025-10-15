<template>
  <div class="wall">
    <!-- 工具栏 -->
    <div class="toolbar">
      <el-input
          v-model="newText"
          placeholder="输入内容后按回车添加"
          @keyup.enter.native="addBlock"
          size="small"
          clearable
          style="width: 240px;"
      />
      <el-button type="primary" size="small" @click="addBlock">➕ 添加</el-button>
      <el-button type="danger" size="small" @click="clearAll">🗑 清空</el-button>
    </div>

    <!-- 弹幕画布 -->
    <div class="canvas" ref="canvasRef">
      <div
          v-for="(item, index) in blocks"
          :key="item.id"
          class="block"
          :style="{ left: item.left + 'px', top: item.top + 'px', background: item.color }"
      >
        <div class="block-header">
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const blocks = ref([])
const newText = ref('')
const canvasRef = ref(null)

// 随机颜色生成
const randomColor = () => {
  const r = Math.floor(Math.random() * 200 + 30)
  const g = Math.floor(Math.random() * 200 + 30)
  const b = Math.floor(Math.random() * 200 + 30)
  return `rgb(${r},${g},${b})`
}

// 添加块
const addBlock = () => {
  if (!newText.value.trim()) return
  const id = Date.now()
  const canvasWidth = canvasRef.value?.clientWidth || 800
  blocks.value.push({
    id,
    text: newText.value,
    left: canvasWidth,
    top: Math.random() * (canvasRef.value?.clientHeight || 500),
    speed: Math.random() * 2 + 1,
    width: 120,
    color: randomColor(),
  })
  newText.value = ''
  saveLayout()
}

const saveLayout = () => {
  localStorage.setItem('user-blocks', JSON.stringify(blocks.value))
}

// 清空
const clearAll = () => {
  blocks.value = []
  localStorage.removeItem('user-blocks')
}

// 弹幕动画循环
const animate = () => {
  const canvasWidth = canvasRef.value?.clientWidth || 800
  const canvasHeight = canvasRef.value?.clientHeight || 500
  blocks.value.forEach(item => {
    item.left -= item.speed
    if (item.left + item.width < 0) {
      item.left = canvasWidth
      item.top = Math.random() * canvasHeight
      item.color = randomColor()
    }
  })
  requestAnimationFrame(animate)
}

// 载入本地缓存
onMounted(() => {
  nextTick(() => {
    const canvasWidth = canvasRef.value?.clientWidth || 800
    const canvasHeight = canvasRef.value?.clientHeight || 500
    const saved = localStorage.getItem('user-blocks')
    if (saved) {
      blocks.value = JSON.parse(saved).map(item => ({
        ...item,
        speed: item.speed || Math.random() * 2 + 1,
        color: item.color || randomColor(),
        left: item.left > 0 ? item.left : Math.random() * canvasWidth,
        top: item.top > 0 ? item.top : Math.random() * canvasHeight,
      }))
    }
    animate()
  })
})
</script>


<style scoped>
.wall {
  position: relative;
  height: calc(90vh - 80px);
  overflow: hidden;
  background-color: #f6f7fb;
  border-radius: 10px;
  padding: 10px;
}

/* 工具栏保持你的花边样式 */
.toolbar {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  z-index: 10;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* 画布保持原来样式 */
.canvas {
  position: relative;
  height: calc(100% - 40px);
  border: 2px dashed #ccc;
  border-radius: 10px;
  overflow: hidden;
}

/* 内容块保持原来的花边样式 */
.block {
  position: absolute;
  min-width: 150px;
  height: 30px;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: move;
  color: #fff; /* 白色字体更明显 */
  font-weight: bold;
  text-align: center;
}

.block-header {
  width: 100%;
  font-size: 14px;
}
</style>
