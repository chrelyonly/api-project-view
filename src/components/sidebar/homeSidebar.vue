<script setup>
import { ref, computed } from "vue";
import FriendLinkComment from "@/components/FriendLinkComment.vue";

const drawerVisible = ref(false);

// 图标跟随 Drawer 状态
const drawerIcon = computed(() => (drawerVisible.value ? "✖" : "☰"));

// 按钮位置动态计算（跟随 Drawer）
const drawerWidth = 1200; // Drawer 宽度，自己改
const buttonRight = computed(() => {
  return drawerVisible.value ? `${drawerWidth + 20}px` : "20px";
});
</script>

<template>
  <!-- 右侧悬浮按钮（随 Drawer 移动） -->
  <div
      class="float-button fancy-btn"
      :class="{ open: drawerVisible }"
      :style="{ right: buttonRight }"
      @click="drawerVisible = !drawerVisible"
  >
    <span>{{ drawerIcon }}</span>
  </div>
  <!-- Drawer 侧边栏 -->
  <el-drawer
      v-model="drawerVisible"
      title="侧边栏菜单"
      direction="rtl"
      :size="drawerWidth + 'px'"
      :lock-scroll="false"
  >
    <el-card>
<!--   侧边栏组件 默认获取最新-->
      <FriendLinkComment linkId=""></FriendLinkComment>
    </el-card>
  </el-drawer>
</template>

<style scoped>
.fancy-btn {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9999;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4a90e2, #7b61ff);
  color: #fff;
  font-size: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  /* 动画 */
  transition:
      right 0.35s cubic-bezier(0.2, 0.8, 0.3, 1),
      transform 0.25s ease,
      box-shadow 0.3s ease,
      background 0.3s ease;

  box-shadow: 0 6px 16px rgba(0,0,0,0.25);
}

/* 悬停上浮 */
.fancy-btn:hover {
  transform: translateY(-50%) scale(1.07);
  box-shadow: 0 12px 26px rgba(0,0,0,0.3);
}

/* 点击反馈 */
.fancy-btn:active {
  transform: translateY(-50%) scale(0.93);
}

/* 按钮内部图标旋转 */
.fancy-btn span {
  display: inline-block;
  transition: transform 0.3s ease;
}

/* Drawer 打开时图标旋转 90°（☰ → ✖ 更自然） */
.fancy-btn.open span {
  transform: rotate(90deg);
}

/* Drawer 打开时背景色变换 */
.fancy-btn.open {
  background: linear-gradient(135deg, #ff5f6d, #ffc371);
  box-shadow: 0 8px 22px rgba(255, 95, 109, 0.4);
}
</style>
