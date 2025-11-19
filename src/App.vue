<script setup>
import { RouterView } from 'vue-router'
import {ref, nextTick, onMounted} from "vue";
import LoginComment from "@/components/login/loginComment.vue";
import router from "@/router/index.js";
import {getUserLoginStore} from "@/stores/counter.js";
// 在 Vue 实例挂载后隐藏 loading
nextTick (() => {
  const loadingElement = document.getElementById('loading')
  if (loadingElement) {
    loadingElement.style.opacity = '0'
    loadingElement.style.visibility = 'hidden'
  }
})

const visible = ref(false);
const menuStyle = ref({});

const menuWidth = 210;   // 你的菜单宽度
const menuHeight = 200;  // 大概高度，多一些没关系

const openMenu = (e) => {
  e.preventDefault();

  let x = e.clientX;
  let y = e.clientY;

  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;

  // 如果右边放不下 → 往左挪
  if (x + menuWidth > winWidth) {
    x = winWidth - menuWidth - 10; // 距离右边 10 像素
  }

  // 如果下边放不下 → 往上挪
  if (y + menuHeight > winHeight) {
    y = winHeight - menuHeight - 10; // 距离底部 10 像素
  }

  menuStyle.value = {
    top: y + "px",
    left: x + "px",
  };

  visible.value = true;
};

function closeMenu() {
  visible.value = false;
}
// ====== 菜单功能 ======
function openDevTools() {
  ElNotification({
    title: "提示",
    message: "无法直接打开 DevTools，请按 F12 或 Ctrl + Shift + I",
    type: "info"
  });
  closeMenu();
}

function refreshPage() {
  location.reload();
}

function goBack() {
  history.back();
}

function goForward() {
  history.forward();
}

function copyURL() {
  navigator.clipboard.writeText(location.href);
  ElMessage.success("已复制当前 URL ✨");
}

function openNewTab() {
  window.open(location.href, "_blank");
}

function viewSource() {
  window.open("view-source:" + location.href, "_blank");
}
onMounted(()=>{
  // 检查用户登录状态
  getUserLogin()

  // 全局右键自定义
  // window.addEventListener("contextmenu", openMenu);

  // 任意左键点击关闭
  // window.addEventListener("mousedown", (e) => {
  //   if (!e.target.closest(".cute-menu")) {
  //     closeMenu();
  //   }
  // });
})
/**
 * 前往用户信息
 *
 */
const goUserInfo = () => {
  router.push({ path: "/userInfo/index" });
}

// 登录组件实例
const loginCommentRef = ref({})
/**
 * 用户点击登录事件
 */
const userLogin = () => {
  loginCommentRef?.value?.init();
}

// 用户登录状态
const userLoginStatus = ref(false)
const userInfo = ref({})
// 获取用户登录状态
const getUserLogin = () => {
  userInfo.value = $getStore({
    name: "userInfo",
  });
  if (userInfo.value?.id) {
  //   保存全局状态
  //   getUserLoginStore().setUserInfo(userInfo)
    getUserLoginStore().setUserInfo(userInfo.value);
  }
  userLoginStatus.value = getUserLoginStore().getUserLoginStatus()
}
</script>

<template>
  <div class="background-main">
    <div class="topHeader">
      <el-row align="middle">
        <!-- 左边 LOGO -->
        <el-col :span="12" class="logo">
          🍓 我的站点
        </el-col>

        <!-- 右边导航 -->
        <el-col :span="12" class="nav">
          <router-link to="/">
            <span>🏠</span> 首页
          </router-link>
          <router-link to="/downloadCenter/index">
            <span>💾</span> 软件工具下载中心(测试中)
          </router-link>
          <router-link to="/code-template/index">
            <span>🍪</span> 代码模板库
          </router-link>
          <router-link to="/message/index">
            <span>💗</span> 留言
          </router-link>
          <router-link to="/link/index">
            <span>💗</span> 友情链接
          </router-link>
          <router-link to="/draggableCard/index">
            <span>🧱</span> 背景墙
          </router-link>
<!--          <a href="/"><span>🏠</span> 首页</a>-->
<!--          <a href="/downloadCenter/index"><span>💾</span> 软件工具下载中心(测试中)</a>-->
<!--          <a href="/link/index"><span>💗</span> 友情链接</a>-->
<!--          <a href="/draggableCard/index"><span>💗</span> 友情链接</a>-->
<!--          <a href="/about"><span>ℹ️</span> 关于我们</a>-->
<!--          <a href="/contact"><span>📞</span> 联系我们</a>-->
          <div style="float: right;" @click="goUserInfo" v-if="userLoginStatus">
            <div style="float: left;margin-left: 20px;margin-top: 10px;border-radius: 50%;overflow:hidden;height: 40px;width: 40px;border: #ff9400 1px solid">
              <el-image :src="userInfo.avatar || 'https://i.imgs.ovh/2025/07/29/2AO1n.png'"  style="height: 40px"></el-image>
            </div>
            <div style="float: left;height: 60px;color: #117000">
              <div>{{ userInfo.userAccount }}</div>
            </div>
          </div>
          <div style="float: right;margin-left: 20px" v-else>
            <el-button type="primary" @click="userLogin">登录/注册</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
<!--    <div class="page-frame animate-frame">-->
<!--      <el-image class="frame-overlay" :src="borderImage" />-->
<!--    </div>-->
    <transition name="fade-slide" mode="out-in">
      <RouterView />
    </transition>




    <!-- 全局右键菜单 -->
    <transition name="menu-ani">
      <div
          v-show="visible"
          class="cute-menu"
          :style="menuStyle"
      >
        <div class="cute-title">🌸 常用操作</div>

        <div class="cute-item" @click="openDevTools">🛠 打开开发者工具</div>
        <div class="cute-item" @click="refreshPage">🔄 刷新页面</div>

        <div class="cute-item" @click="goBack">⬅ 返回</div>
        <div class="cute-item" @click="goForward">➡ 前进</div>

        <div class="cute-divider"></div>

        <div class="cute-item" @click="copyURL">🔗 复制当前链接</div>
        <div class="cute-item" @click="openNewTab">🆕 在新标签页打开</div>
        <div class="cute-item" @click="viewSource">📄 查看网页源代码</div>
      </div>
    </transition>



    <!-- 登录组件 -->
    <loginComment
        ref="loginCommentRef"
    ></loginComment>
  </div>
</template>
<!--//background-image:linear-gradient(-225deg,#E3FDF5 ,#FFE6FA 100%)-->
<style scoped>
.topHeader {
  height: 60px;
  line-height: 60px;
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1); /* 阴影 */
  position: fixed;
  background-color: rgb(255,255,255,0.7);
  width: 94%;
  padding: 0 3%;
  z-index: 9;
}

/* LOGO 部分 */
.logo {
  font-size: 18px;
  font-weight: bold;
  color: #000000;
}

/* 导航链接部分 */
.nav {
  text-align: right;
  position: relative;
}

.nav a {
  margin-left: 20px;
  color: #000000;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s, transform 0.2s;
}

.nav a:hover {
  color: #8481AE;
  transform: scale(1.55); /* 鼠标移上去轻微放大 */
}
/* 动画定义：进入和离开都带淡入淡出 + 平移动作 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.background-main {
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background-image: url(@/static/img/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
@keyframes frameIn {
  0% {
    transform: scale(1.3);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.page-frame {
  position: fixed;
  pointer-events: none; /* 避免遮挡点击 */
  z-index: 100;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
}

.frame-overlay {
  width: 100%;
  height: 100%;
}

.animate-frame {
  animation: frameIn 0.5s ease-out forwards;
}

/* 渐变光晕 */
@keyframes glow {
  0% { box-shadow: 0 0 12px rgba(255, 130, 180, 0.3); }
  50% { box-shadow: 0 0 22px rgba(255, 130, 200, 0.5); }
  100% { box-shadow: 0 0 12px rgba(255, 130, 180, 0.3); }
}

/* 弹出动画更丝滑 */
.menu-fade-enter-active {
  animation: pop 0.18s cubic-bezier(0.22, 1, 0.36, 1);
}
.menu-fade-leave-active {
  animation: fadeOut 0.15s ease forwards;
}

@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes fadeOut {
  0% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.9); opacity: 0; }
}

/* 轻量玻璃拟态（减少性能负担） */
.cute-menu {
  position: fixed;
  width: 210px;
  padding: 10px 0;
  border-radius: 16px;
  background: rgba(255, 245, 250, 0.72);
  backdrop-filter: blur(8px); /* 降低模糊强度，更流畅 */
  border: 1px solid rgba(255, 180, 220, 0.45);
  box-shadow: 0 6px 18px rgba(255, 150, 200, 0.25);
  z-index: 999999;

  /* 弹出动画 — 小巧精致不卡顿 */
  animation: menuPop 0.15s ease;
}

/* 优化弹出动画（减少缩放幅度） */
@keyframes menuPop {
  0% {
    transform: scale(0.92);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 菜单标题 */
.cute-title {
  padding: 6px 16px 10px;
  font-size: 13px;
  font-weight: bold;
  color: #d14fa2;
}

/* 项目 */
.cute-item {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #c93a8a;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
}

/* 悬停效果优化 — 不卡顿 */
.cute-item:hover {
  background: rgba(255, 220, 235, 0.85);
  padding-left: 22px;
  border-radius: 10px;
}

/* 分割线 */
.cute-divider {
  height: 1px;
  margin: 8px 0;
  background: rgba(255, 160, 220, 0.4);
}

/* ---------------------------
    ① 右键菜单本体（无动画）
---------------------------- */
.cute-menu {
  position: fixed;
  width: 210px;
  padding: 10px 0;
  border-radius: 16px;
  background: rgba(255, 245, 250, 0.72);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 180, 220, 0.45);
  box-shadow: 0 6px 18px rgba(255, 150, 200, 0.25);
  z-index: 999999;
}

/* ---------------------------
    ② 出现动画（Vue 进入）
---------------------------- */
.menu-ani-enter-from {
  opacity: 0;
  transform: scale(0.87);
}
.menu-ani-enter-active {
  transition: all 0.15s ease-out;
}
.menu-ani-enter-to {
  opacity: 1;
  transform: scale(1);
}

/* ---------------------------
    ③ 消失动画（Vue 离开）
---------------------------- */
.menu-ani-leave-from {
  opacity: 1;
  transform: scale(1);
}
.menu-ani-leave-active {
  transition: all 0.13s ease-in;
}
.menu-ani-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* ---------------------------
    菜单项 hover 动画
---------------------------- */
.cute-item {
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #c93a8a;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.15s ease;
}

.cute-item:hover {
  background: rgba(255, 220, 235, 0.85);
  padding-left: 22px;
  border-radius: 10px;
}

</style>
