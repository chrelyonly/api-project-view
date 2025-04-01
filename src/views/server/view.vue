<template>
  <div class="server-container">
    <el-row :gutter="20">
      <el-col :span="8" v-for="(server, index) in servers" :key="server.id">
        <el-card :body-style="{ padding: '20px', borderRadius: '12px' }" class="server-card">
          <div class="server-header">
            <span>{{ server.name }}</span>
          </div>
          <div class="server-info">
            <span>CPU：{{ server.state.cpu | percent }}</span>
            <span>内存：{{ formatMemory(server.state.mem_used) }} / {{ formatMemory(server.host.mem_total) }}</span>
            <span>磁盘：{{ formatMemory(server.state.disk_used) }} / {{ formatMemory(server.host.disk_total) }}</span>
          </div>
          <div class="server-info">
            <span>网络入：{{ formatBytes(server.state.net_in_transfer) }}</span>
            <span>网络出：{{ formatBytes(server.state.net_out_transfer) }}</span>
          </div>
          <div class="server-info">
            <span>CPU负载 (1min/5min/15min)：{{ server.state.load_1 }} / {{ server.state.load_5 }} / {{ server.state.load_15 }}</span>
            <span>在线时长：{{ formatUptime(server.state.uptime) }}</span>
          </div>
          <el-progress :percentage="(server.state.cpu * 100).toFixed(0)" status="active" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ref } from 'vue';
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
    // 服务器数据
    const servers = ref([
      {
        id: 1,
        name: '面板本身docker',
        host: {
          cpu: ['Intel(R) Core(TM) i5-8500 CPU @ 3.00GHz 4 Virtual Core'],
          mem_total: 8290709504,
          disk_total: 62079733760,
          swap_total: 1022357504,
          arch: 'x86_64',
          virtualization: 'docker',
          boot_time: 1737598967,
        },
        state: {
          cpu: 0.33416874778541295,
          mem_used: 5572427776,
          swap_used: 1022357504,
          disk_used: 18437554176,
          net_in_transfer: 8984715,
          net_out_transfer: 146852891,
          net_in_speed: 250,
          net_out_speed: 706,
          uptime: 5883009,
          load_1: 0.03,
          load_5: 0.14,
          load_15: 0.16,
          tcp_conn_count: 12,
          udp_conn_count: 1,
          process_count: 3,
        },
        country_code: 'cn',
        last_active: '2025-04-01T12:32:56.733137561+08:00',
      },
    ]);

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

    // 自定义百分比格式化
    const percent = (value) => {
      return `${(value * 100).toFixed(0)}%`;
    };

    return {
      servers,
      formatMemory,
      formatBytes,
      formatUptime,
      percent,
    };
  },
};
</script>

<style scoped>
.server-container {
  padding: 30px;
}

.server-card {
  background: rgba(0, 0, 0, 0.6); /* 深色背景 */
  backdrop-filter: blur(10px); /* 模糊效果 */
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2); /* 边框色 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); /* 更强的阴影效果 */
  color: #fff; /* 白色文字 */
  transition: all 0.3s ease;
}

.server-card:hover {
  background: rgba(0, 0, 0, 0.7); /* 悬停时加深背景 */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.4); /* 悬停时增加阴影 */
}

.server-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.server-info {
  margin: 5px 0;
}

.el-progress {
  margin-top: 15px;
}
</style>
