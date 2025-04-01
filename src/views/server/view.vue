<template>
  <div class="background-main">
    <div class="server-container">
      <el-row :gutter="20" justify="center">
        <el-col :span="20">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(server, index) in servers" :key="server.id">
              <transition-group name="fade" tag="div">
                <el-card :body-style="{ padding: '20px', borderRadius: '12px'}" class="server-card animate__animated animate__fadeInUp" :style="{ 'animation-delay': `${index * 0.05}s` }">
                  <div class="server-header">
                    <div>{{ server.name }}</div>
                  </div>
                  <div class="server-info">
                    <div :class="getClassForValue(server.state?.cpu)">CPU：{{ server.state?.cpu.toFixed(2) }}%</div>
                    <div :class="getClassForValue(server.state?.mem_used / server.host?.mem_total * 100)">内存：{{ formatMemory(server.state?.mem_used) }} / {{ formatMemory(server.host?.mem_total) }}</div>
                    <div :class="getClassForValue(server.state?.disk_used / server.host?.disk_total * 100)">磁盘：{{ formatMemory(server.state?.disk_used) }} / {{ formatMemory(server.host?.disk_total) }}</div>
                  </div>
                  <div class="server-info">
                    <div>网络入：{{ formatBytes(server.state?.net_in_transfer) }}</div>
                    <div>网络出：{{ formatBytes(server.state?.net_out_transfer) }}</div>
                  </div>
                  <div class="server-info">
                    <div>CPU负载：{{ server.state?.load_1?.toFixed(2) }} / {{ server.state?.load_5?.toFixed(2) }} / {{ server.state?.load_15?.toFixed(2) }}</div>
                    <div>在线时长：{{ formatUptime(server.state?.uptime) }}</div>
                  </div>
                  <div class="server-info">
                    <div>系统信息：{{ server.host?.platform }} {{ server.host?.platform_version }} / {{ server.host?.arch }}</div>
                    <div>上报时间：{{ formatTimestamp(server.last_active) }}</div>
                  </div>
                  <div class="server-info">
                    <div>TCP连接数：{{ server.state?.tcp_conn_count }}</div>
                    <div>UDP连接数：{{ server.state?.udp_conn_count }}</div>
                    <div>进程数：{{ server.state?.process_count }}</div>
                  </div>
                  <el-progress :percentage="server.state?.cpu" status="active" />
                </el-card>
              </transition-group>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElCard, ElRow, ElCol, ElProgress } from 'element-plus';

export default {
  name: 'ServerMonitoring',
  components: {
    ElCard,
    ElRow,
    ElCol,
    ElProgress,
  },
  setup() {
    const servers = ref([]);
    let ws = null;

    // 格式化内存为MB/GB
    const formatMemory = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      const kb = bytes / 1024;
      if (kb < 1024) return `${kb.toFixed(2)} KB`;
      const mb = kb / 1024;
      if (mb < 1024) return `${mb.toFixed(2)} MB`;
      const gb = mb / 1024;
      return `${gb.toFixed(2)} GB`;
    };

    // 格式化流量为KB/MB/GB
    const formatBytes = (bytes) => {
      if (bytes < 1024) return `${bytes} B`;
      const kb = bytes / 1024;
      if (kb < 1024) return `${kb.toFixed(2)} KB`;
      const mb = kb / 1024;
      if (mb < 1024) return `${mb.toFixed(2)} MB`;
      const gb = mb / 1024;
      return `${gb.toFixed(2)} GB`;
    };

    // 格式化在线时长为天/小时/分钟
    const formatUptime = (uptime) => {
      const days = Math.floor(uptime / 86400);
      const hours = Math.floor((uptime % 86400) / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      return `${days}天 ${hours}小时 ${minutes}分钟`;
    };

    // 格式化时间戳
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      return date.toISOString().replace('T', ' ').substring(0, 19);
    };

    // 获取对应值的类名
    const getClassForValue = (value) => {
      if (value < 50) {
        return 'low-value';
      } else if (value < 75) {
        return 'medium-value';
      } else {
        return 'high-value';
      }
    };

    // 初始化 WebSocket 连接
    const initWebSocket = () => {
      ws = new WebSocket('wss://nezha-dashboard.frp.chrelyonly.cn/api/v1/ws/server');

      ws.onopen = () => {
        console.log('WebSocket 连接已打开');
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        // 假设返回的数据是一个数组，直接更新 servers
        servers.value = data.servers;
      };

      ws.onclose = () => {
        console.log('WebSocket 连接已关闭');
        // 可以在这里尝试重新连接
        setTimeout(initWebSocket, 5000); // 5秒后重连
      };

      ws.onerror = (error) => {
        console.error('WebSocket 错误:', error);
        ws.close();
      };
    };

    // 组件挂载时初始化 WebSocket
    onMounted(() => {
      initWebSocket();
    });

    // 组件卸载时关闭 WebSocket
    onUnmounted(() => {
      if (ws) {
        ws.close();
      }
    });

    return {
      servers,
      formatMemory,
      formatBytes,
      formatUptime,
      formatTimestamp,
      getClassForValue,
    };
  },
};
</script>

<style scoped>
.server-container {
  text-align: center;
  padding: 30px 5% 400px;
}

.server-card {
  background: rgba(255, 255, 255, 0.2); /* 玻璃风背景 */
  backdrop-filter: blur(10px); /* 模糊效果 */
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3); /* 边框色 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 更强的阴影效果 */
  color: #000; /* 黑色文字 */
  transition: all 0.3s ease;
  margin-bottom: 20px;
  min-height: 320px;
  text-align: left;
}

.server-card:hover {
  background: rgba(255, 255, 255, 0.3); /* 悬停时加深背景 */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2); /* 悬停时增加阴影 */
}

.server-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #007bff; /* 蓝色标题 */
}

.server-info {
  margin: 10px 0; /* 增加间隔 */
  font-size: 14px;
  color: #333; /* 深色文字 */
}

.low-value {
  color: #28a745; /* 绿色 */
  font-weight: bold;
  background-color: rgba(40, 167, 69, 0.1); /* 绿色背景 */
  padding: 2px 4px;
  border-radius: 4px;
}

.medium-value {
  color: #ffc107; /* 黄色 */
  font-weight: bold;
  background-color: rgba(255, 193, 7, 0.1); /* 黄色背景 */
  padding: 2px 4px;
  border-radius: 4px;
}

.high-value {
  color: #dc3545; /* 红色 */
  font-weight: bold;
  background-color: rgba(220, 53, 69, 0.1); /* 红色背景 */
  padding: 2px 4px;
  border-radius: 4px;
}

.el-progress {
  margin-top: 15px;
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s;
}
.list-enter, .list-leave-to /* .list-leave-active in <2.1.8 */ {
  opacity: 0;
  transform: translateY(30px);
}
</style>
