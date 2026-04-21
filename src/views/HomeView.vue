<template>
  <!--        顶部预留空间 -->
  <div style="height: 20vh"></div>
      <div class="container">
            <!-- API 列表 -->
            <el-card class="wrapper animate__animated animate__fadeInUp" >
              <h2 class="title">🚀 API 接口</h2>


              <p align="center">
                <a href="https://api.chrelyonly.cn" target="_blank">
                  <img alt="chrelyonly!" src="https://api.chrelyonly.cn/moe-counter-api/@api.chrelyonly.cn?name=api.chrelyonly.cn&theme=rule34">
                </a>
              </p>


              <div style="width: 50%;text-align: center;margin: 20px auto 0">
                <el-input style="text-align: center" placeholder="输入搜索关键词" show-word-limit v-model="option.searchKey" @keyup.enter.native="handleEnter"></el-input>
              </div>

              <el-row :gutter="20" v-loading="option.tableLoading">
                <el-col
                    v-for="(item, index) in option.apiData"
                    :key="index"
                    :xs="24"
                    :sm="12"
                    :md="8"
                    :lg="6"
                    style="margin-top: 10px"
                >
                  <div class="card animate__animated animate__fadeIn" @click="goDetail(item)">
                    <div class="card-header">
                      <h3>{{ item.name }}</h3>
                    </div>
                    <div class="card-body">
                      <p>{{ item.content }}</p>
                    </div>
                    <div class="card-footer">
<!--                      <span class="status">{{ item.status === 1 ? '🟢 正常' : '🔴 异常' }}</span>-->
                      <span v-if="item?.apiConfig?.countNumber">调用次数: {{ item?.apiConfig?.countNumber }}</span>
                      <span v-else>调用次数: 0</span>
                      <span class="date">⏳ {{ item?.apiConfig?.updateTime ?? item.updateTime }}</span>
                    </div>
                  </div>
                </el-col>
                <!-- 🔽 没有数据时显示 -->
                <el-col v-if="!option.tableLoading && option.apiData.length === 0" :span="24">
                  <div style="text-align: center; padding: 40px; color: #999;">
                    <el-empty description="暂无数据"></el-empty>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col
                    style="margin-top: 10px"
                >
                  <el-col>
                    <!-- 分页控件 -->
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        :total="option.pages.total"
                        :page-size="option.pages.pageSize"
                        v-model:current-page="option.pages.currentPage"
                        style="margin-bottom: 15px;"
                        @change="pagesChange"
                    />
                  </el-col>
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
                    span=""
                    style="margin-top: 10px"
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
        <!-- 功能导航 -->
        <el-card class="wrapper animate__animated animate__fadeInUp">
          <h2 class="title">🔧 功能导航</h2>
          <el-row :gutter="20">
            <el-col
                v-for="(item, index) in option.featureList"
                :key="index"
                :xs="24"
                :sm="12"
                :md="8"
                :lg="6"
                style="margin-top: 10px"
            >
              <div class="card animate__animated animate__fadeIn" @click="goPath(item)">
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

            <!-- 服务监控 -->
<!--            <el-card class="wrapper animate__animated animate__fadeInUp">-->
<!--              <h2 class="title">🌟 服务监控</h2>-->
<!--              <el-row justify="center">-->
<!--                <el-col :xs="24" :sm="12" :md="8" :lg="6">-->
<!--                  <div class="monitor-card animate__animated animate__zoomIn" @click="goMonitor">-->
<!--                    <div class="monitor-header">-->
<!--                      <h3>🔍 服务器状态</h3>-->
<!--                    </div>-->
<!--                    <div class="monitor-body">-->
<!--                      <p>查看实时服务状态，保障系统稳定运行</p>-->
<!--                    </div>-->
<!--                    <div class="monitor-footer">-->
<!--                      <el-button type="primary" round>📊 进入监控中心</el-button>-->
<!--                    </div>-->
<!--                  </div>-->
<!--                </el-col>-->
<!--              </el-row>-->
<!--            </el-card>-->
        <el-card class="wrapper animate__animated animate__fadeInUp">
          <h2 class="title">🌟 底部导航</h2>
          <el-row justify="center">
            <!--                <el-col :xs="24" :sm="12" :md="8" :lg="6">-->
            <!--                  <div class="monitor-card animate__animated animate__zoomIn" @click="goMonitor">-->
            <!--                    <div class="monitor-header">-->
            <!--                      <h3>🔍 服务器状态</h3>-->
            <!--                    </div>-->
            <!--                    <div class="monitor-body">-->
            <!--                      <p>查看实时服务状态，保障系统稳定运行</p>-->
            <!--                    </div>-->
            <!--                    <div class="monitor-footer">-->
            <!--                      <el-button type="primary" round>📊 进入监控中心</el-button>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                </el-col>-->
          </el-row>
        </el-card>
        <!--  侧边栏 -->
        <homeSidebar></homeSidebar>
      </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {ElNotification} from "element-plus";
import {usePageStore} from "@/stores/counter.js";
import HomeSidebar from "@/components/sidebar/homeSidebar.vue";
const router = useRouter();
const option = ref({
  searchKey: undefined,
  tableLoading: false,
  apiData: [],
  pages:{
    pageSize:20,
    currentPage: usePageStore().currentPage,
    total:0,
  },
  sponsorData: [],
  featureList: [
    {
      name: '头像表情包制作',
      content: '头像表情包制作',
      path: '/emoji-app',
      // 1vue路由跳转,  2路径跳转
      jumpType:2,
      status: 1,
    },

  ]
});
const goPath = (item) => {
  // 1vue路由跳转,  2路径跳转
  if (item.jumpType === 1) {
    router.push({ path: item.path });
  }else if (item.jumpType === 2) {
    window.location.href = item.path;
  }
};

onMounted(() => {
  getApiList();
  getSponsorList();


// // 弹出公告
//   ElNotification({
//     title: '⚡ API 重生计划启动！',
//     message: `
//     <div>
//       <hr style="margin: 8px 0;" />
//       <p><strong>😼 本次复仇计划更新：</strong></p>
//       <ul style="margin: 6px 0; padding-left: 18px;">
//         <li>🔥 上一世任人调戏的接口，这一世加上了更严格的校验！</li>
//         <li>⚔️ 限流器已出鞘：想狂刷？除非你能打赢 429！</li>
//         <li>🛡️ JSON 强制规范：格式乱给？这一世我不会再原谅你！</li>
//       </ul>
//       <hr style="margin: 8px 0;" />
//       <p><strong>📜 API 复仇宣言：</strong></p>
//       <p style="line-height: 1.6;">
//         上一世我默默无闻，如 404 寒风中瑟瑟发抖；<br />
//         这一世我重启人生，誓做全网最稳定的 200！<br />
//         凡调用我者，皆需尊重；凡冒犯我者，日志永久留档！🔥
//       </p>
//       <hr style="margin: 8px 0;" />
//       <p><strong>📬 联系我们：</strong></p>
//       <p>如遇问题，加我进群 <el-tag>wx: whoAmI1172576293</el-tag> 聆听我的复仇计划。我们会温柔处理，不会 429 你 🙂</p>
//       <p style="margin-top: 8px;">感谢你的使用与陪伴，复仇之路因你更精彩！🎉</p>
//     </div>
//   `,
//     dangerouslyUseHTMLString: true,
//     type: 'success',
//     duration: 9000,
//     position: 'top-right',
//     offset: 80,
//     showClose: true,
//     customClass: 'custom-notify-box'
//   })

});
// 输入框回车事件
const handleEnter = ()=>{
  getApiList();
}
// 分页改变
const pagesChange = () => {
  getApiList();
  usePageStore().setCurrentPage(option.value.pages.currentPage)
}
// 加载数据方法
const getApiList = () => {
  option.value.tableLoading = true;
  let params = {
    current: option.value.pages.currentPage,
    size: option.value.pages.pageSize,
    name: option.value.searchKey === ""?undefined:option.value.searchKey,
  }
  $https("/view-api/api-list", "get", params, 1, {}).then(res => {
    option.value.pages.total = res.data.data.total;
    option.value.pages.currentPage = res.data.data.current;
    option.value.apiData = res.data.data.records;

  }).finally(() => {
    option.value.tableLoading = false;
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
  width: 100%;
  margin: 0 auto;
  max-width: 80%;
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
