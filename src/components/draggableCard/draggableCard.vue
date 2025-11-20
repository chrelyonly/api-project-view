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
      <el-input
          v-model="captchaInfo.code"
          placeholder="请输入验证码"
          size="small"
          style="width: 150px;"
      />
      <el-image
          :src="captchaInfo.image"
          @click="getCode"
          style="height: 32px; width: 90px; cursor: pointer; margin: 0 8px;"
      />
      <el-button type="primary" size="small" @click="addBlock">➕ 添加</el-button>
    </div>

    <!-- 弹幕画布 -->
    <div class="canvas" ref="canvasRef">
      <div
          v-for="(item, index) in blocks"
          :key="item.id"
          class="block"
          :style="{ left: item.left + 'px', top: item.top + 'px', backgroundColor: item.color }"
          @mouseenter="item.isHover = true"
          @mouseleave="item.isHover = false"
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

// 随机颜色生成 (Use HSL for more vibrant colors)
const randomColor = () => {
  const h = Math.floor(Math.random() * 360);
  const s = Math.floor(Math.random() * 30 + 70); // 70-100% saturation
  const l = Math.floor(Math.random() * 20 + 50); // 50-70% lightness
  return `hsl(${h}, ${s}%, ${l}%)`;
}
// 验证码信息
const captchaInfo = ref({
  // 标识
  key: "",
  // 图片
  image: "",
  // 值
  code: "",
})
// 获取验证码
const getCode = ()=>{
  let params = {

  }
  $https("/strawberry-user-api/getCode","get",params,1,{}).then(res => {
    captchaInfo.value.image = res.data.data.image
    captchaInfo.value.key = res.data.data.key
  })
}

// 添加块
const addBlock = () => {
  if (!newText.value.trim()) {
    ElNotification.warning("输入评论内容.")
    return;
  }
  if (!captchaInfo.value.code) {
    ElNotification.warning("输入正确的验证码")
    return;
  }
  let params = {
    text: newText.value,
    color: randomColor()
  }
  let headers = {
    "Captcha-Key": captchaInfo.value.key,
    "Captcha-Code": captchaInfo.value.code,
  }
  $https("/backgroundwall-api/addWall","post",params,2,headers).then((res)=>{
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
      isHover: false,
    })
    newText.value = ''
  }).finally(() => {
    // 发送的时候需要刷新验证码
    getCode();
  })


}


// 弹幕动画循环
const animate = () => {
  const canvasWidth = canvasRef.value?.clientWidth || 800
  const canvasHeight = canvasRef.value?.clientHeight || 500
  blocks.value.forEach(item => {
    if (item.isHover) return; // Pause if hovered
    item.left -= item.speed
    if (!item.width) {
      item.width = item.text.length * 15
    }
    if (item.left + item.width <= 0) {
        item.left = canvasWidth
        item.top = Math.random() * canvasHeight
        if (item.top >= canvasHeight) {
          item.top = item.top - 30
        }
        item.color = randomColor()
    }
  })
  requestAnimationFrame(animate)
}

// 载入本地缓存
onMounted(() => {
  nextTick(() => {
    loadData();
    getCode();
  })
})
const commentPage = ref({
  pageSize: 50,
  currentPage: 1,
  total: 0
});
/**
 * 加载数据
 */
const loadData = () => {
  const canvasWidth = canvasRef.value?.clientWidth || 800
  const canvasHeight = canvasRef.value?.clientHeight || 500
  let params = {
    current: commentPage.value.currentPage,
    size: commentPage.value.pageSize,
  }
  $https("/backgroundwall-api/list","get",params,1,{}).then(res => {
    const data = res.data.data;
    blocks.value = data.records.map(item => ({
      ...item,
      speed: item.speed || Math.random() * 2 + 1,
      color: item.color || randomColor(),
      left: item.left > 0 ? item.left : Math.random() * canvasWidth,
      top: item.top > 0 ? item.top : Math.random() * canvasHeight,
      isHover: false,
    }))
    // 开始播放
    animate()
  })
}
</script>


<style scoped>
.wall {
  position: relative;
  width: 100%;
  max-width: 1600px; /* Increased from 1200px */
  height: 85vh; /* Increased from 80vh */
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding: 20px;
  box-sizing: border-box;
}

/* Toolbar Styling */
.toolbar {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  z-index: 100;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 16px;
  padding: 12px 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.toolbar:hover {
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* Canvas Styling */
.canvas {
  position: relative;
  height: 100%;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  /* Removed dashed border for a cleaner look */
  background: rgba(0, 0, 0, 0.02);
  box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
}

/* Block (Card) Styling */
.block {
  position: absolute;
  height: 40px; /* Slightly taller */
  border-radius: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: grab;
  color: #fff;
  font-weight: 600;
  text-align: center;
  padding: 0 20px;
  user-select: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  white-space: nowrap;
  background-image: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(0,0,0,0.1) 100%);
  backdrop-filter: blur(2px);
}

.block:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.block:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  z-index: 10; /* Bring to front on hover */
}

.block-header {
  width: 100%;
  font-size: 15px;
  letter-spacing: 0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Customize Element UI components within toolbar if needed */
:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.6) !important;
  box-shadow: none !important;
  border: 1px solid rgba(255,255,255,0.5);
}
:deep(.el-input__wrapper:hover), :deep(.el-input__wrapper.is-focus) {
  background-color: rgba(255, 255, 255, 0.9) !important;
}
:deep(.el-button--primary) {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  box-shadow: 0 4px 10px rgba(118, 75, 162, 0.4);
}
:deep(.el-button--primary:hover) {
  background: linear-gradient(45deg, #764ba2, #667eea);
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(118, 75, 162, 0.5);
}
</style>
