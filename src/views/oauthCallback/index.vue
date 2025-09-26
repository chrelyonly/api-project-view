<template>
  <div class="oauth-callback">
    <el-card class="callback-card">
      <div v-if="loading" class="loading">
        <el-progress :percentage="50" type="circle" status="active" />
        正在处理授权...
      </div>
      <div v-else>
        <el-alert
            v-if="error"
            title="授权失败"
            type="error"
            :description="error"
            show-icon
        />
        <el-alert
            v-else
            title="授权成功"
            type="success"
            :description="message"
            show-icon
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref('');
const message = ref('');

// 如果后端通过 GET 参数或 POST 返回临时 key，可以在这里判断
onMounted(async () => {
  try {
    // 示例：后端回调把 tempKey 放在 query 参数里
    const tempKey = route.query.tempKey;
    if (!tempKey) {
      error.value = '未获取到授权信息';
      loading.value = false;
      return;
    }

    // 调后端接口获取授权信息
    const res = await axios.post('/oauth2-api/temp-data', { key: tempKey });
    if (res.data.code !== 0) {
      error.value = res.data.msg || '授权失败';
    } else {
      message.value = '欢迎 ' + res.data.data.userName || '用户';
      // TODO: 可以存 token / 跳转到首页
      ElMessage.success('授权成功，正在跳转...');
      setTimeout(() => {
        router.replace('/'); // 跳转首页
      }, 1500);
    }
  } catch (err) {
    error.value = err.message || '授权异常';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.oauth-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.callback-card {
  width: 400px;
  text-align: center;
  padding: 40px;
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
