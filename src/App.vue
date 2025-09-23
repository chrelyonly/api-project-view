<script setup>
import { RouterView } from 'vue-router'
import {ref,nextTick} from "vue";
import LoginComment from "@/components/login/loginComment.vue";
import router from "@/router/index.js";
// 在 Vue 实例挂载后隐藏 loading
nextTick (() => {
  const loadingElement = document.getElementById('loading')
  if (loadingElement) {
    loadingElement.style.opacity = '0'
    loadingElement.style.visibility = 'hidden'
  }
})


const loginDialogVisible = ref(false);
const handleLoginSuccess = (user) => {

}

/**
 * 前往用户信息
 *
 */
const goUserInfo = () => {
  router.push({ path: "/userInfo/index" });
}
/**
 * 用户点击登录事件
 */
const userLogin = () => {
  loginDialogVisible.value = true
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
          <a href="/"><span>🏠</span> 首页</a>
          <a href="/link/index"><span>💗</span> 友情链接</a>
<!--          <a href="/about"><span>ℹ️</span> 关于我们</a>-->
<!--          <a href="/contact"><span>📞</span> 联系我们</a>-->
          <div style="float: right;" @click="goUserInfo">
            <div style="float: left;margin-left: 20px;margin-top: 10px;border-radius: 50%;overflow:hidden;height: 40px;width: 40px;border: #ff9400 1px solid">
              <el-image src="https://i.imgs.ovh/2025/07/29/2AO1n.png"  style="height: 40px"></el-image>
            </div>
            <div style="float: left;height: 60px;color: #117000">
              <div>管理员</div>
            </div>
          </div>
          <div style="float: right;margin-left: 20px">
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


    <!-- 登录组件 -->
    <loginComment
        v-model="loginDialogVisible"
        @login-success="handleLoginSuccess"
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
</style>
