<template>
  <div class="profile-container">
    <el-card class="profile-card animate__animated animate__fadeInUp">
      <h2 class="title">👤 个人信息</h2>
      <!-- 用户头像 -->
      <div class="avatar-section">
        <el-avatar :src="user.avatar" size="large">{{ user.user_name[0] }}</el-avatar>
        <el-button type="primary" size="small" @click="changeAvatar">修改头像</el-button>
      </div>

      <!-- 用户信息表单 -->
      <el-form :model="user" label-width="100px" class="info-form">
        <el-form-item label="用户名">
          <el-input v-model="user.user_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="user.nickname"></el-input>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-input v-model="user.created_at" disabled></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-tag :type="user.status === 1 ? 'success' : 'danger'">
            {{ user.status === 1 ? '活跃' : '禁用' }}
          </el-tag>
        </el-form-item>
      </el-form>

      <!-- 操作按钮 -->
      <div class="actions">
        <el-button type="primary" @click="updateProfile">保存修改</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

const user = ref({
  avatar: "https://i.imgs.ovh/2025/07/29/2AO1n.png",
  user_name: "chrelyonly",
  email: "chrelyonly@example.com",
  nickname: "喜怒哀乐",
  created_at: "2025-01-01",
  status: 1
});

// 模拟获取用户信息
onMounted(async () => {
  const res = await $https("/api/user/info", "get");
  if (res.data.success) {
    Object.assign(user.value, res.data.user);
  }
});

// 修改头像
const changeAvatar = () => {
  ElMessage({ type: "info", message: "触发修改头像功能" });
};

// 保存修改
const updateProfile = async () => {
  const res = await $https("/api/user/update", "post", user.value);
  if (res.data.success) {
    ElMessage({ type: "success", message: "更新成功" });
  } else {
    ElMessage({ type: "error", message: res.data.message || "更新失败" });
  }
};

// 退出登录
const logout = () => {
  ElMessageBox.confirm("确定要退出登录吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    $https("/api/logout", "post").then(() => {
      ElMessage({ type: "success", message: "已退出登录" });
      // 跳转到首页或登录页
      window.location.href = "/";
    });
  });
};
</script>

<style scoped>
.profile-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  padding-top: 25vh;
}

.profile-card {
  border-radius: 15px;
  padding: 30px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.title {
  text-align: center;
  color: #42b983;
  font-size: 26px;
  margin-bottom: 20px;
}

.avatar-section {
  text-align: center;
  margin-bottom: 30px;
}

.avatar-section .el-avatar {
  margin-bottom: 10px;
}

.info-form .el-form-item {
  margin-bottom: 15px;
}

.actions {
  text-align: center;
  margin-top: 20px;
}

.actions .el-button {
  margin: 0 10px;
}
</style>
