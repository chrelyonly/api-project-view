<template>
  <el-container class="api-container">
    <!-- API 详情 -->
    <el-card class="api-glass-card">
      <h2 class="title">API 详情</h2>
      <p><strong>接口名称：</strong> {{ apiInfo.name }}</p>
      <p><strong>描述：</strong> {{ apiInfo.content }}</p>
      <p><strong>适用场景：</strong> 煤油</p>
    </el-card>

    <!-- API 信息 -->
    <el-card class="api-section">
      <h2 class="title">接口信息</h2>
      <el-descriptions :column="isMobile ? 1 : 3" border>
        <el-descriptions-item label="接口地址">
          <el-tag type="success">{{ apiInfo.apiUrl }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请求方法">
          <el-tag type="warning">{{ apiInfo.requestType }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="返回格式">
          <el-tag type="info">{{ apiInfo.responseType }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 请求参数说明 -->
    <el-card class="api-section" v-if="apiInfo.requestParams">
      <h2 class="title">请求参数说明</h2>
      <el-table :data="JSON.parse(apiInfo.requestParams)" border stripe style="width: 100%">
        <el-table-column prop="name" label="名称" width="120"></el-table-column>
        <el-table-column prop="required" label="必填" width="80"></el-table-column>
        <el-table-column prop="type" label="类型" width="120"></el-table-column>
        <el-table-column prop="des" label="说明"></el-table-column>
      </el-table>
    </el-card>

    <!-- 调用示例 -->
<!--    <el-card class="api-section">-->
<!--      <h2 class="title">调用示例</h2>-->
<!--      <el-input v-model="exampleUrl" readonly class="copy-input">-->
<!--        <template #append>-->
<!--          <el-button type="primary" @click="copyToClipboard">复制</el-button>-->
<!--        </template>-->
<!--      </el-input>-->
<!--    </el-card>-->

    <!-- 代码示例 -->
<!--    <el-card class="api-section">-->
<!--      <h2 class="title">代码示例</h2>-->
<!--      <pre v-highlight class="code-block">-->
<!--fetch("https://api.lolimi.cn/API/qqfy/api.php?msg=晨常&type=json")-->
<!--  .then(response => response.json())-->
<!--  .then(data => console.log(data));-->
<!--      </pre>-->
<!--    </el-card>-->
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
const router = useRoute();
const id = router.query.id; // 获取传递的 id
// API 信息
const apiInfo = ref({});

// 复制到剪贴板
const copyToClipboard = () => {
  navigator.clipboard.writeText(exampleUrl.value).then(() => {
    ElMessage.success("已复制到剪贴板");
  });
};

// 响应式布局
const isMobile = ref(window.innerWidth < 768);
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

// 监听窗口变化
onMounted(() => {
  window.addEventListener("resize", handleResize);
  let params = {
    id:id
  }
  $https("/emoji-api/api-detail","get",params,1,{}).then( res=> {
    if (res.data.data){
      apiInfo.value = res.data.data
    }else{
      router.push({
        path: "/"
      });
    }
  })
});
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
/* 整体容器 */
.api-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

/* 玻璃风格卡片 */
.api-glass-card {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* API 详情文本 */
.api-glass-card p {
  margin: 5px 0;
  font-size: 14px;
}

/* API 信息块 */
.api-section {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

/* 标题 */
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #409eff;
}

/* 代码块 */
.code-block {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 15px;
  border-radius: 8px;
  font-family: "Courier New", monospace;
  overflow-x: auto;
}

/* 输入框 */
.copy-input {
  max-width: 600px;
}
</style>
