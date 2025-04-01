<template>
  <div class="container">
    <!-- API 列表 -->
    <el-card class="wrapper animate__animated animate__fadeInUp">
      <h2 class="title">🚀 API 接口</h2>
      <el-row :gutter="20">
        <el-col
            v-for="(item, index) in option.apiData"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
        >
          <div class="card animate__animated animate__fadeIn" @click="goDetail(item)">
            <div class="card-header">
              <h3>{{ item.name }}</h3>
            </div>
            <div class="card-body">
              <p>{{ item.content }}</p>
            </div>
            <div class="card-footer">
              <span class="status">{{ item.status === 1 ? '🟢 正常' : '🔴 异常' }}</span>
              <span class="date">⏳ {{ item.updateTime }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 赞助者列表 -->
    <el-card class="wrapper animate__animated animate__fadeInUp">
      <h2 class="title">💖 特别赞助</h2>
      <el-row :gutter="20">
        <el-col
            v-for="(item, index) in option.sponsorData"
            :key="index"
            :xs="12"
            :sm="8"
            :md="6"
            :lg="4"
        >
          <div class="sponsor-card animate__animated animate__zoomIn">
            <h3 class="sponsor-name">{{ item.name }}</h3>
            <el-image
                :src="item.avatar"
                class="sponsor-avatar animate__animated animate__pulse"
            ></el-image>
            <h3 class="sponsor-money">💰 {{ item.money }}</h3>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 服务监控 -->
    <el-card class="wrapper animate__animated animate__fadeInUp">
      <h2 class="title">🌟 服务监控</h2>
      <el-row justify="center">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <div class="monitor-card animate__animated animate__zoomIn" @click="goMonitor">
            <div class="monitor-header">
              <h3>🔍 服务器状态</h3>
            </div>
            <div class="monitor-body">
              <p>查看实时服务状态，保障系统稳定运行</p>
            </div>
            <div class="monitor-footer">
              <el-button type="primary" round>📊 进入监控中心</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const option = ref({ apiData: [], sponsorData: [] });

onMounted(() => {
  getApiList();
  getSponsorList();
});

const getApiList = () => {
  $https("/view-api/api-list", "get", {}, 1, {}).then(res => {
    option.value.apiData = res.data.data.records;
  });
};

const getSponsorList = () => {
  $https("/view-api/sponsor-list", "get", {}, 1, {}).then(res => {
    option.value.sponsorData = res.data.data.records;
  });
};

const goDetail = (item) => {
  router.push({ path: "/doc/api-detail", query: { id: item.id } });
};

const goMonitor = () => {
  router.push({ path: "/server/view" });
};
</script>

<style scoped>
.container {
  width: 90%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  opacity: 0.9;
}

.wrapper {
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  padding: 20px;
  backdrop-filter: blur(10px);
}

.title {
  text-align: center;
  margin: 30px auto;
  color: #ff6b6b;
  font-size: 26px;
  font-weight: bold;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(135deg, #ffffff, #f9f9f9);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e0e0e0;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: #ff6b6b;
}

.card-header h3 {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10px;
  color: #ff6b6b;
}

.card-body {
  flex-grow: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  text-align: left;
  padding: 10px;
  margin-bottom: 10px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.sponsor-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 15px;
  border-radius: 15px;
  background: linear-gradient(135deg, #ffffff, #f9f9f9);
  transition: all 0.3s ease-in-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.sponsor-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #ff6b6b;
  transition: transform 0.3s ease-in-out;
}

.sponsor-avatar:hover {
  transform: scale(1.1) rotate(5deg);
}

/* 服务监控卡片 */
.monitor-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #f9f9f9, #ffffff);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  text-align: center;
}

.monitor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.monitor-header h3 {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.monitor-body p {
  font-size: 14px;
  color: #666;
  margin: 10px 0;
}

.monitor-footer .el-button {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .title {
    font-size: 22px;
  }
  .card-header h3 {
    font-size: 16px;
  }
  .sponsor-avatar {
    width: 80px;
    height: 80px;
  }
}
</style>
