<script setup>
import { ElMessage } from 'element-plus'

const mysqlList = [
  {
    name: 'mysql(9.5) 公益节点 1',
    host: 'api.chrelyonly.cn',
    port: '53306',
    user: 'root',
    password: 'mysql-public1-9.5',
  },
  {
    name: 'mysql(9.5)  公益节点 2',
    host: 'api.chrelyonly.cn',
    port: '53307',
    user: 'root',
    password: 'mysql-public2-9.5',
  },
]

const copyToClipboard = (item) => {
  const conn = `mysql://${item.user}:${item.password}@${item.host}:${item.port}`
  navigator.clipboard.writeText(conn).then(() => {
    ElMessage.success('🎉 连接信息已复制到剪贴板！')
  })
}
</script>

<template>
  <div class="page-container">
    <div class="floating-stars">
      <span class="star">🍭</span>
      <span class="star">✨</span>
      <span class="star">🌸</span>
    </div>

    <h1 class="title">🌟 mysql 公益连接导航页 🌟</h1>
    <p class="subtitle">
      提供可公开访问的 mysql（MySQL 兼容）服务，适合开发、教学与测试场景 🌱
    </p>

    <div class="card-container">
      <el-card
          v-for="(item, index) in mysqlList"
          :key="index"
          class="glass-card"
          shadow="hover"
          @click="copyToClipboard(item)"
      >
        <div class="ribbon">免费</div>
        <div class="card-content">
          <div class="icon">🐬</div>
          <h2>{{ item.name }}</h2>
          <p><strong>地址：</strong>{{ item.host }}</p>
          <p><strong>端口：</strong>{{ item.port }}</p>
          <p><strong>用户名：</strong>{{ item.user }}</p>
          <p><strong>密码：</strong>{{ item.password }}</p>
        </div>
      </el-card>
    </div>

    <p class="footer-tip">💡 点击任意卡片即可复制 mysql 连接字符串！</p>
  </div>
</template>


<style scoped>
.page-container {
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'ZCOOL KuaiLe', 'PingFang SC', sans-serif;
  overflow-x: hidden;
}

.title {
  font-size: 2.6rem;
  background: linear-gradient(90deg, #ff9a9e, #fad0c4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.8rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #935e9a;
  margin-bottom: 2rem;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}

.glass-card {
  width: 280px;
  position: relative;
  background: rgba(255, 255, 255, 0.45);
  border: 1px dashed rgba(255, 182, 193, 0.5);
  backdrop-filter: blur(14px);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(255, 192, 203, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}
.glass-card:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(255, 105, 180, 0.4);
}
.card-content {
  padding: 1.4rem;
  text-align: center;
  color: #663c65;
}
.card-content .icon {
  font-size: 2.2rem;
  transition: transform 0.4s ease;
}
.glass-card:hover .icon {
  transform: rotate(12deg) scale(1.1);
}
.card-content h2 {
  font-size: 1.3rem;
  margin: 0.5rem 0;
}
.card-content p {
  font-size: 0.95rem;
  margin: 0.25rem 0;
}

/* 丝带角标 */
.ribbon {
  position: absolute;
  top: -10px;
  left: -10px;
  background-color: #ff7eb9;
  color: white;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 0 10px 10px 0;
  font-weight: bold;
  box-shadow: 0 2px 6px rgba(255, 105, 180, 0.3);
}

/* 星星动画 */
.floating-stars {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
  z-index: 0;
}
.floating-stars .star {
  position: absolute;
  animation: floatStar 12s linear infinite;
  font-size: 1.5rem;
  opacity: 0.5;
}
.floating-stars .star:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; }
.floating-stars .star:nth-child(2) { top: 40%; left: 65%; animation-delay: 3s; }
.floating-stars .star:nth-child(3) { top: 75%; left: 30%; animation-delay: 5s; }

@keyframes floatStar {
  0% { transform: translateY(0); opacity: 0.4; }
  50% { opacity: 1; }
  100% { transform: translateY(-240px); opacity: 0; }
}

.footer-tip {
  margin-top: 3rem;
  font-size: 0.95rem;
  color: #7a4c74;
}

@media (max-width: 768px) {
  .card-container {
    flex-direction: column;
    align-items: center;
  }

  .glass-card {
    width: 90%;
  }

  .title {
    font-size: 8vw;
    text-align: center;
  }
}

</style>
