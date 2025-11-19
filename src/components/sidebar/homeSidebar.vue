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
      class="float-button"
      :style="{ right: buttonRight }"
      @click="drawerVisible = !drawerVisible"
  >
    {{ drawerIcon }}
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
.float-button {
  position: fixed;
  top: 50%;
  z-index: 9999;
  width: 45px;
  height: 45px;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  transition: right 0.3s ease, background 0.3s;
}

.float-button:hover {
  background: #66b1ff;
}
</style>
