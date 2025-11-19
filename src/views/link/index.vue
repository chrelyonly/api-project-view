<template>
  <div class="page-spacer"></div>
  <div class="container">
    <el-card class="wrapper animate__animated animate__fadeInUp">
      <h2 class="title">💗 友情链接</h2>
      <p class="subtitle">以下是一些友站推荐，按类别分组展示 💖</p>

      <!-- 友情链接列表 -->
      <div v-for="(group, groupName) in groupedLinks" :key="groupName" class="group">
        <h3 class="group-title">{{ groupName }}</h3>
        <div class="grid">
          <div
              v-for="(item, index) in group"
              :key="index"
              class="grid-item"
          >
            <a
                :href="item.url"
                target="_blank"
                rel="noopener noreferrer"
                class="friend-link"
            >
              <div class="card animate__animated animate__fadeIn">
                <div class="card-avatar">
                  <img :src="item.avatar || getFavicon(item.url)" alt="网站头像" />
                </div>
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
          </div>
        </div>
      </div>

      <!-- 申请友链示例 -->
      <div class="apply-sample">
        <h3 class="apply-title">📩 申请友链示例</h3>
        <p class="apply-subtitle">以下为示例信息，可参考填写：</p>
        <div class="apply-grid">
          <div class="apply-card">
            <div class="card-avatar">
              <img src="https://www.chrelyonly.cn/favicon.ico" alt="站点图标" />
            </div>
            <div class="card-header">
              <h4>小草莓</h4>
            </div>
            <div class="card-body">
              <p>站点描述: 爱这个世界所有人</p>
              <p>站点地址: <a href="https://www.chrelyonly.cn" target="_blank">https://www.chrelyonly.cn</a></p>
              <p>主人名字: 莓梨冻人</p>
              <p>主人邮箱: 1172576293@qq.com\</p>
            </div>
          </div>
        </div>
        <p class="apply-note">请确保填写完整信息，以便审核通过(将内容发送至评论区既可)。</p>
      </div>

    </el-card>

    <FriendLinkComment linkId="10000"></FriendLinkComment>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import FriendLinkComment from "@/components/FriendLinkComment.vue";

const links = ref([
  { name: "chrelyonly", url: "https://chrelyonly.cn", desc: "主页", emoji: "🏠", tag: "友链", group: "朋友圈" },
  { name: "chrelyonly-API站", url: "https://api-chrelyonly.cn", desc: "API站", emoji: "🏠", tag: "API站", group: "朋友圈" },
  { name: "大白萝卜_Official-博客", url: "https://blog.imbhj.com", desc: "萝卜的博客", emoji: "🏠", tag: "博客", group: "朋友圈" },
  { name: "大白萝卜_Official-论坛", url: "https://bbs.imbhj.com", desc: "萝卜的论坛", emoji: "🏠", tag: "论坛", group: "朋友圈" },
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

const groupedLinks = computed(() => {
  return links.value.reduce((acc, link) => {
    if (!acc[link.group]) acc[link.group] = [];
    acc[link.group].push(link);
    return acc;
  }, {});
});

const getFavicon = (url) => {
  try {
    const domain = new URL(url).origin;
    return `${domain}/favicon.ico`;
  } catch (e) {
    return "https://via.placeholder.com/48";
  }
};
</script>

<style scoped>
.page-spacer { height: 20vh; }
.container { width: 95%; margin: 0 auto; max-width: 1400px; }
.wrapper { margin-bottom: 40px; border-radius: 25px; box-shadow: 0 12px 50px rgba(0,0,0,0.08); padding: 40px; backdrop-filter: blur(20px); background: rgba(255, 255, 255, 0.95); }
.title { text-align: center; margin: 20px auto 10px; color: #42b983; font-size: 36px; font-weight: bold; }
.subtitle { text-align: center; margin-bottom: 30px; color: #666; font-size: 16px; }
.group { margin-top: 40px; }
.group-title { font-size: 24px; color: #ff6b6b; margin-bottom: 20px; border-left: 5px solid #42b983; padding-left: 12px; font-weight: bold; background: rgba(255,255,255,0.6); border-radius: 12px; padding: 6px 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); }

/* 网格 */
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.grid-item { width: 100%; }

/* 卡片 */
.card { display: flex; flex-direction: column; justify-content: flex-start; background: linear-gradient(145deg, #ffffff, #f7f7f7); border-radius: 20px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); padding: 24px; transition: all 0.4s ease; cursor: pointer; border: 2px solid transparent; }
.card:hover { transform: scale(1.05); box-shadow: 0 18px 50px rgba(0,0,0,0.2); border-image: linear-gradient(135deg, #42b983, #ff6b6b) 1; background: linear-gradient(145deg, #e0f7f1, #fff0f5); }

.card-avatar { display: flex; justify-content: center; margin-bottom: 12px; }
.card-avatar img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid #42b983; }

.card-header h3 { font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 14px; color: #42b983; display: flex; justify-content: center; align-items: center; gap: 8px; }
.card-body { flex-grow: 1; font-size: 15px; color: #444; text-align: left; margin-bottom: 14px; }
.card-footer { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #555; border-top: 1px solid #eee; padding-top: 10px; }
.tag { background: linear-gradient(90deg, #42b983, #ff6b6b); color: #fff; font-size: 12px; padding: 4px 10px; border-radius: 14px; font-weight: 600; }

/* 申请友链示例 */
.apply-sample { margin-top: 50px; text-align: center; }
.apply-title { font-size: 22px; color: #ff6b6b; margin-bottom: 10px; }
.apply-subtitle { font-size: 14px; color: #666; margin-bottom: 20px; }
.apply-grid { display: flex; flex-wrap: wrap; justify-content: center; gap: 20px; }
.apply-card { width: 260px; padding: 20px; border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.08); background: #fff; transition: all 0.3s ease; text-align: left; }
.apply-card:hover { transform: scale(1.05); box-shadow: 0 18px 50px rgba(0,0,0,0.2); }
.apply-card .card-avatar img { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; margin-bottom: 12px; }
.apply-card .card-header h4 { font-size: 16px; color: #42b983; margin-bottom: 8px; }
.apply-card .card-body p { font-size: 14px; color: #444; margin: 2px 0; }
.apply-note { margin-top: 15px; font-size: 13px; color: #999; }
</style>
