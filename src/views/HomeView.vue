<script setup>
import { ref,onMounted} from 'vue';
import { useRouter } from 'vue-router';
// 获取路由实例
const router = useRouter();
const option = ref({
  data: []
});
// 加载完成初始化
onMounted(()=>{
  let params = {

  }
  $https("/emoji-api/api-list","get",params,1,{}).then( res => {
    option.value.data = res.data.data.records
  })
})
// 前往详情页面
const goDetail = () => {
  router.push("/doc/api-detail");
}
</script>

<template>
  <div class="container">
    <el-card class="wrapper">
      <el-row :gutter="20">
        <el-col
            v-for="(item, index) in option.data"
            :key="index"
            :xs="24"
            :sm="12"
            :md="8"
            :lg="6"
        >
          <div class="card" @click="goDetail">
            <div class="card-header">
              <h3 >{{ item.name }}</h3>
            </div>
            <div class="card-body">
              <p>{{ item.content }}</p>
            </div>
            <div class="card-footer">
              <span class="status">{{ item.status===1?'正常':'异常' }}</span>
              <span class="date">上次更新: {{ item.updateTime }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<style scoped>
/* 主容器 */
.container {
  width: 90%;
  max-width: 1700px;
  margin: 0 auto;
  padding: 20px 0;
}

/* 卡片整体样式 */
.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  height: 240px;
  transition: all 0.3s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

/* 悬浮时放大 + 增强光影 */
.card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

/* 头部标题 */
.card-header h3 {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(45deg, #ff7e5f, #feb47b);
  -webkit-background-clip: text;
  color: transparent;
  text-align: center;
  margin-bottom: 10px;
}

/* 主要内容 */
.card-body {
  flex-grow: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  text-align: left;
  padding: 10px;
}

/* 底部信息 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #888;
}

/* 状态样式 */
.status {
  font-weight: bold;
  color: #42b983;
}

/* 日期样式 */
.date {
  font-style: italic;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .card {
    height: auto;
    padding: 15px;
  }
  .card-header h3 {
    font-size: 16px;
  }
  .card-body {
    font-size: 13px;
  }
}
</style>
