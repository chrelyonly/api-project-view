<template>
  <div style="height: 20vh"></div>
  <div class="container">
    <el-card class="wrapper animate__animated animate__fadeInUp">
      <h2 class="title">💗 友情链接</h2>
      <p class="subtitle">以下是一些友站推荐，按类别分组展示 💖</p>

      <div v-for="(group, groupName) in groupedLinks" :key="groupName" class="group">
        <h3 class="group-title">{{ groupName }}</h3>
        <el-row :gutter="20">
          <el-col
              v-for="(item, index) in group"
              :key="index"
              :xs="24"
              :sm="12"
              :md="8"
              :lg="6"
              style="margin-top: 15px"
          >
            <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="friend-link"
            >
              <div class="card animate__animated animate__fadeIn">
                <div class="card-header">
                  <h3>{{ item.name }} <span class="emoji">{{ item.emoji }}</span></h3>
                </div>
                <div class="card-body">
                  <p>{{ item.desc }}</p>
                </div>
                <div class="card-footer">
                  <span class="status">🌐 {{ item.url }}</span>
                  <span v-if="item.tag" class="tag">{{ item.tag }}</span>
                </div>
              </div>
            </a>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <FriendLinkComment linkId="10000"></FriendLinkComment>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import FriendLinkComment from "@/components/FriendLinkComment.vue";

const links = ref([
  { name: "chrelyonly的小屋", url: "https://chrelyonly.cn", desc: "个人工具箱 & API 集合", emoji: "🏠", tag: "推荐", group: "推荐" },
  { name: "Vue.js", url: "https://vuejs.org", desc: "渐进式 JavaScript 框架", emoji: "🖖", tag: "前端", group: "前端" },
  { name: "React", url: "https://react.dev", desc: "用于构建用户界面的 JavaScript 库", emoji: "⚛️", tag: "前端", group: "前端" },
  { name: "Element Plus", url: "https://element-plus.org", desc: "基于 Vue3 的 UI 组件库", emoji: "🎨", tag: "UI", group: "前端" },
  { name: "Ant Design Vue", url: "https://www.antdv.com", desc: "企业级 Vue UI 组件库", emoji: "🖌️", tag: "UI", group: "前端" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org", desc: "Web 开发者必备文档", emoji: "📚", tag: "文档", group: "文档" },
  { name: "Stack Overflow", url: "https://stackoverflow.com", desc: "程序员问答社区", emoji: "💡", tag: "社区", group: "社区" },
  { name: "GitHub", url: "https://github.com", desc: "全球最大的代码托管平台", emoji: "🐙", tag: "工具", group: "工具" },
  { name: "CodePen", url: "https://codepen.io", desc: "前端在线实验与分享平台", emoji: "🖍️", tag: "工具", group: "工具" },
  { name: "Node.js", url: "https://nodejs.org", desc: "JavaScript 运行时环境", emoji: "🟢", tag: "后端", group: "后端" },
  { name: "Vite", url: "https://vitejs.dev", desc: "极速 Web 构建工具", emoji: "⚡", tag: "工具", group: "工具" },
  { name: "掘金", url: "https://juejin.cn", desc: "程序员技术社区", emoji: "🚀", tag: "社区", group: "社区" },
]);

// 根据 group 分组
const groupedLinks = computed(() => {
  return links.value.reduce((acc, link) => {
    if (!acc[link.group]) acc[link.group] = [];
    acc[link.group].push(link);
    return acc;
  }, {});
});
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
  opacity: 0.95;
}

.wrapper {
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.15);
  padding: 25px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.85);
}

.title {
  text-align: center;
  margin: 30px auto 10px;
  color: #42b983;
  font-size: 28px;
  font-weight: bold;
}

.subtitle {
  margin-bottom: 20px;
  color: #666;
  font-size: 14px;
}

.group {
  margin-top: 30px;
}

.group-title {
  font-size: 20px;
  color: #ff6b6b;
  margin-bottom: 15px;
}

/* 友情链接卡片 */
.friend-link {
  text-decoration: none;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  background: linear-gradient(145deg, #ffffff, #f0f0f0);
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  border: 2px solid #e0e0e0;
}

.card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  border-color: #42b983;
}

.card-header h3 {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 12px;
  color: #42b983;
}

.card-header .emoji {
  margin-left: 6px;
  font-size: 20px;
}

.card-body {
  flex-grow: 1;
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  text-align: center;
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

.tag {
  background-color: #42b983;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .card-body {
    font-size: 13px;
  }
  .card-header h3 {
    font-size: 16px;
  }
}
</style>
