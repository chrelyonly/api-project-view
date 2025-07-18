<template>
  <div class="not-found-page">
    <div class="floating-stars">
      <span class="star">🌟</span>
      <span class="star">🎈</span>
      <span class="star">🍭</span>
    </div>

    <el-card class="not-found-card" shadow="hover">
      <div class="not-found-content">
        <div class="big-404">
          4 <span class="emoji">🐾</span> 4
        </div>
        <h1 class="oops">哎呀～你迷路啦！</h1>
        <p class="hint">你访问的页面不存在或已经飞走啦 🛸</p>
        <router-link to="/" class="home-btn">🏠 回到首页</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: linear-gradient(to bottom right, #fff0f5, #ffe4e1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'ZCOOL KuaiLe', 'PingFang SC', sans-serif;
  position: relative;
  padding: 2rem;
  overflow: hidden;
}

.not-found-card {
  width: 360px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px dashed #ff9aa2;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(255, 192, 203, 0.35);
  backdrop-filter: blur(12px);
  text-align: center;
  padding: 2rem 1rem;
}

.not-found-content {
  color: #7a4c74;
}

.big-404 {
  font-size: 4.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #ff9a9e, #fad0c4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
}
.big-404 .emoji {
  font-size: 3rem;
}

.oops {
  font-size: 1.6rem;
  margin: 0.5rem 0;
  color: #d96c91;
}

.hint {
  font-size: 0.95rem;
  color: #935e9a;
  margin-bottom: 1.6rem;
}

.home-btn {
  display: inline-block;
  background-color: #ff90b3;
  color: white;
  padding: 0.6rem 1.4rem;
  border-radius: 20px;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s ease;
}
.home-btn:hover {
  background-color: #ff6fa1;
}

/* 星星动画 */
.floating-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 0;
}
.floating-stars .star {
  position: absolute;
  animation: floatStar 14s linear infinite;
  font-size: 1.5rem;
  opacity: 0.4;
}
.floating-stars .star:nth-child(1) { top: 10%; left: 20%; animation-delay: 0s; }
.floating-stars .star:nth-child(2) { top: 50%; left: 70%; animation-delay: 4s; }
.floating-stars .star:nth-child(3) { top: 80%; left: 30%; animation-delay: 7s; }

@keyframes floatStar {
  0% { transform: translateY(0); opacity: 0.4; }
  50% { opacity: 1; }
  100% { transform: translateY(-240px); opacity: 0; }
}
</style>
