<template>
  <!--        顶部预留空间 -->
  <div style="height: 20vh"></div>
  <el-container class="api-container" v-loading="loading">
    <!-- API 详情 -->
    <el-card class="api-glass-card">
      <h2 class="title">API 详情</h2>
      <p><strong>接口名称：</strong> {{ apiInfo.name }}</p>
      <p><strong>描述：</strong> {{ apiInfo.content }}</p>
      <p><strong>适用场景：</strong> 煤油</p>
    </el-card>

    <!-- API 信息 -->
    <el-card class="api-section">
      <h2 class="title">接口信息(点击复制)</h2>
      <el-descriptions :column="isMobile ? 1 : 1" border>
        <el-descriptions-item label="接口地址">
          <el-tag type="success" @click="copyText(apiInfo.apiUrl)">{{ apiInfo.apiUrl }}</el-tag>
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
        <el-table-column prop="required" label="必填" width="80">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.required === 1">是</el-tag>
            <el-tag type="danger" v-else>否</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="120"></el-table-column>
        <el-table-column prop="des" label="说明"></el-table-column>
      </el-table>
    </el-card>


    <!-- 新增的：在线调试请求窗口 -->
    <el-card class="api-section" style="max-width: 1000px;" v-loading="debugLoading">
      <h2 class="title">在线调试请求</h2>
      <el-form :model="requestData" label-width="80px" :inline="isMobile">
        <el-form-item label="接口地址">
          <el-input v-model="requestData.url" placeholder="请输入接口地址" style="min-width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="请求方法">
          <el-select v-model="requestData.method" placeholder="选择请求方法" style="width: 120px;">
            <el-option label="GET" value="get" />
            <el-option label="POST" value="post" />
            <el-option label="PUT" value="put" />
            <el-option label="DELETE" value="delete" />
          </el-select>
        </el-form-item>

        <el-form-item label="请求参数"  v-if="requestData.params.length > 0">

            <el-table :data="requestData.params" border stripe style="width: 100%">
              <el-table-column prop="name" label="名称"   align="center"></el-table-column>
              <el-table-column prop="required" label="必填"   align="center">
                <template #default="scope">
                  <el-tag type="success" v-if="scope.row.required === 1">是</el-tag>
                  <el-tag type="danger" v-else>否</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="type" label="类型"  align="center"></el-table-column>
              <el-table-column prop="dataLength" label="需要数据长度"  align="center"></el-table-column>
              <el-table-column prop="value" label="值" align="center" width="300">
                <template #default="scope">
                  <!-- 如果是字符串数组 -->
                  <template v-if="scope.row.type.includes('string[]')">
                      <el-input
                          v-model="scope.row.value"
                      />
                  </template>
                  <!-- 如果是 base64 图片 -->
                  <template v-else-if="scope.row.type.includes('base64')">
                    <el-input
                        :value="Array.isArray(scope.row.value) ? `当前有[${scope.row.value.length}]组数据` : scope.row.value"
                        readonly
                    >
                      <template #append>
                        <el-upload
                            :show-file-list="false"
                            :before-upload="file => handleImageToBase64(file, scope.row)"
                        >
                          <el-button type="primary" icon="Upload">上传图片</el-button>
                        </el-upload>
                      </template>
                    </el-input>
                  </template>

                  <!-- 其他类型：默认输入框 -->
                  <template v-else>
                    <el-input
                        v-model="scope.row.value"
                    />
                  </template>
                </template>
              </el-table-column>


              <el-table-column prop="des" label="说明"  align="center"></el-table-column>
            </el-table>

        </el-form-item>
        <el-form-item>
          <el-button type="primary"  @click="sendRequest">发送请求</el-button>
        </el-form-item>
      </el-form>

      <el-divider></el-divider>
      <el-card style="padding: 20px">
        <h3>返回结果:
          <el-button type="success" @click="copyImage">复制内容(复制gif)</el-button>
        </h3>
        <div v-if="responseResult.code === 200" style="width: 120px;height: 120px;border: #2dff12 1px solid;padding: 2px">
          <el-image :src="responseResult.data" :preview-src-list="[responseResult.data]"  preview-teleported style="width: 100%;height: 100%"></el-image>
        </div>
        <div v-else>
          {{responseResult.msg}}
        </div>
      </el-card>


    </el-card>

    <!-- 最近历史调用 -->
    <el-card class="api-section" style="margin-bottom: 200px;max-width: 1000px;"  v-loading="historyLoading">
      <h2 class="title" >最近历史调用</h2>
      <el-table :data="historyList" border stripe style="width: 100%" align="center">
        <el-table-column show-overflow-tooltip prop="id" label="id" align="center"></el-table-column>
<!--        <el-table-column show-overflow-tooltip prop="requestUrl" label="请求地址" align="center"></el-table-column>-->
<!--        <el-table-column show-overflow-tooltip prop="requestParams" label="请求参数" align="center"></el-table-column>-->
<!--        <el-table-column show-overflow-tooltip prop="requestMethod" label="请求方法" align="center"></el-table-column>-->
<!--        <el-table-column show-overflow-tooltip prop="requestStatus" label="状态码" align="center"></el-table-column>-->
        <el-table-column show-overflow-tooltip prop="createTime" label="调用时间" align="center"></el-table-column>
        <el-table-column show-overflow-tooltip prop="responseBody" label="响应结果" align="center">
          <template #default="{row}">
            <div v-if="row && row.responseBody.code === 200">
              <el-image style="width: 50px;height: 50px" :src="row.responseBody.data" :preview-src-list="[row.responseBody.data]" preview-teleported></el-image>
            </div>
            <div v-else>
              {{row.responseBody}}
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="操作" align="center">
          <template #default="{row}">
            <el-button type="text" @click="copyImage(row.responseBody.data)">复制内容</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 👇 隐藏区域用于复制 DOM -->
    <div id="gifWrapper" contenteditable style="position: fixed; left: -9999px; top: -9999px;"></div>
  </el-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const route = useRoute();  // 获取路由信息（只能读取，不支持 push）
const router = useRouter(); // 获取路由实例（可以使用 push、replace）
const id = route.query.id; // 获取传递的 id
// API 信息
const apiInfo = ref({});
const loading = ref(true);
const historyLoading = ref(false);
const debugLoading = ref(false);


// 响应式布局
const isMobile = ref(window.innerWidth < 768);
const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

// 监听窗口变化
onMounted(() => {
  window.addEventListener("resize", handleResize);
  init();
});
// 默认方法
const init = () => {
  loadData()
}

// 历史调用数据
const historyList = ref([]);
// 获取接口调用历史
const loadHistory = () => {
  historyLoading.value = true
  let params = {
    type: requestData.value?.params?.[0]?.value,
    url: requestData.value?.url,
  }
  $https("/view-api/api-history","post",params,2,{}).then( res => {
    let data = res.data.data.records;
    data.forEach( item => {
      item.responseBody = JSON.parse(item.responseBody)
    })
    historyList.value = data
  }).finally( ()=> {
    historyLoading.value = false
  })
};
// 再加接口信息
const loadData = () => {
  let params = {
    id: id,
  };
  $https("/view-api/api-detail", "get", params, 1, {}).then((res) => {
    if (res.data.data && res.data.data.id) {
      apiInfo.value = res.data.data;
      requestData.value.url = apiInfo?.value?.apiUrl?.replace(/^\/api(\/|$)/, '/');
      requestData.value.method = apiInfo?.value?.requestType
      if (apiInfo.value?.requestParams) {
        try {
          requestData.value.params = JSON.parse(apiInfo.value.requestParams);
        } catch (e) {
          console.error("requestParams 不是合法的 JSON 字符串");
          requestData.value.params = null; // 或者 {}
        }
        loadHistory()
      } else {
        requestData.value.params = null; // 或 {}
      }
    } else {
      router.push({
        path: "/",
      });
    }
  }).finally(() => {
    loading.value = false;
  });
}
onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
// 在线调试请求窗口的状态和方法
const requestData = ref({
  url: "",
  method: "",
  params: [],
});
const responseResult = ref({});


/**
 * 复制文本
 * @param text
 */
function copyText(text) {
  if (!text) return;

  // 现代浏览器 Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      ElMessage.success('复制成功');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }

  // 兼容老浏览器的复制方法
  function fallbackCopy(str) {
    const textarea = document.createElement('textarea');
    textarea.value = str;
    // 避免影响页面布局
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        ElMessage.success('复制成功');
      }else{
        ElMessage.error('复制失败');
      }
    } catch (err) {
      ElMessage.error('复制失败，浏览器不支持');
    }
    document.body.removeChild(textarea);
  }
}

/**
 * 复制图片（包括 GIF、PNG、JPG、WebP 等）到剪贴板
 * 自动兼容旧浏览器（execCommand）
 */
const copyImage = async (data = "") => {
  let base64Data;
  if (data === ""){
    base64Data = responseResult.value?.data;
  }else{
    base64Data = data;
  }
  if (!base64Data) {
    ElMessage.warning("图片数据为空");
    return;
  }

  // 如果不是图片类型（例如纯文本），则直接调用文本复制
  if (!base64Data.startsWith("data:image/")) {
    copyText(base64Data);
    return;
  }

  try {
    // 优先使用 Clipboard API（现代浏览器）
    if (navigator.clipboard && window.ClipboardItem) {
      const mimeType = base64Data.match(/^data:(.*?);base64,/)[1];
      const byteString = atob(base64Data.split(",")[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([uint8Array], { type: mimeType });

      await navigator.clipboard.write([
        new ClipboardItem({ [mimeType]: blob })
      ]);

      ElMessage.success("图片已复制 ✅（可直接粘贴到微信或聊天框）");
      return;
    }
  } catch (err) {
    console.warn("Clipboard API 复制失败，回退到 execCommand 模式:", err);
  }

  // ------------------------
  // 兼容旧浏览器：使用 execCommand(copy)
  // ------------------------
  let wrapper = document.getElementById("copyWrapper");
  if (!wrapper) {
    wrapper = document.createElement("div");
    wrapper.id = "copyWrapper";
    wrapper.contentEditable = true;
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "-9999px";
    document.body.appendChild(wrapper);
  }

  wrapper.innerHTML = "";
  const img = document.createElement("img");
  img.src = base64Data;
  wrapper.appendChild(img);

  const range = document.createRange();
  range.selectNode(img);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);

  try {
    const success = document.execCommand("copy");
    if (success) {
      ElMessage.success("图片已复制 ✅（请尝试粘贴到微信）");
    } else {
      ElMessage.error("复制失败 ❌");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("浏览器不支持复制图片 ❌");
  }

  sel.removeAllRanges();
};







// 调试上传文件获取base64
function handleImageToBase64(file, row) {
  if (!file.type.startsWith("image/")) {
    ElMessage.warning("请上传图片文件");
    return false;
  }
  if (file.size > 5 * 1024 * 1024) { // 2MB 限制
    ElMessage.warning("图片大小不能超过5MB");
    return false;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    // 将 base64 填入表格行数据中,根据类型判断值
    if (row.type.includes('[]')){
      if (row.value === "[]"){
        row.value = [];
      }
      row.value.push(reader.result);
    }else{
      row.value = reader.result;
    }
  };
  reader.onerror = () => {
    ElMessage.error("图片读取失败");
  };
  return false; // 阻止 el-upload 默认上传行为
}

// 调试发送请求
function sendRequest() {
  if (!requestData.value.url) {
    ElMessage.error("请填写接口地址");
    return;
  }
  let requestDataTemp = {}
  requestData.value.params.forEach(item => {
    if (item.required && !item.value) {
      ElMessage.error("必须填写必要参数" + item.name)
      return;
    }
    requestDataTemp[item.name] = item.value
    // 转换一下类型,如果数据类型是数组 值不是数组那么转换一下
    if (item.type.includes('[]') && !Array.isArray(item.value)) {
      requestDataTemp[item.name] = JSON.parse(item.value);
    }
  })
  // 测试的时候处理下
  let url = requestData.value.url;
  // let url = requestData.value.url.toString().split("https://nginx-3.frp.chrelyonly.cn/api/")[1];
  debugLoading.value = true;
  // debugger
  $https(url,requestData.value.method,requestDataTemp,requestData.value.method === "GET"?1:2,{}).then((res) => {
    responseResult.value = res.data;
  }).catch((res) => {
    responseResult.value = res.data;
  }).finally(() => {
    debugLoading.value = false;
  })
}

</script>

<style scoped>
/* 整体容器 */
.api-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  opacity: 0.9;
}

/* 玻璃风格卡片 */
.api-glass-card {
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 1);
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
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* 悬浮时放大 + 增强光影 */
.api-section:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
