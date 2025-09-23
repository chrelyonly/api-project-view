<template>
  <el-dialog
      v-model="visible"
      title="🎉 用户登录"
      append-to-body
      width="400px"
      :close-on-click-modal="false"
      custom-class="login-dialog"
  >
    <el-form :model="loginForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input
            v-model="loginForm.user_name"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- 第三方登录 -->
    <div class="social-login">
      <p>快速登录:</p>
      <el-button type="primary" circle icon="el-icon-github" @click="socialLogin('github')"></el-button>
      <el-button type="success" circle icon="el-icon-gitee" @click="socialLogin('gitee')"></el-button>
      <el-button type="info" circle icon="el-icon-google" @click="socialLogin('google')"></el-button>
    </div>
    <div style="text-align: center">
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="login">登录</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ElNotification } from 'element-plus';

const props = defineProps({
  modelValue: { type: Boolean, default: false }
});
const emit = defineEmits(['update:modelValue', 'login-success']);
const visible = ref(props.modelValue);

watch(() => props.modelValue, val => {
  visible.value = val;
});

// 表单
const loginForm = ref({
  user_name: '',
  password: ''
});

// 关闭弹窗
const close = () => {
  visible.value = false;
  emit('update:modelValue', false);
};

// 登录方法
const login = async () => {
  if (!loginForm.value.user_name || !loginForm.value.password) {
    ElNotification({ type: 'warning', message: '请输入用户名和密码' });
    return;
  }

  // 调用接口登录
  const res = await $https('/api/login', 'post', loginForm.value);

  if (res.data.success) {
    ElNotification({ type: 'success', message: '登录成功' });
    emit('login-success', res.data.user); // 返回用户信息
    close();
  } else {
    ElNotification({ type: 'error', message: res.data.message || '登录失败' });
  }
};

// 第三方登录
const socialLogin = (type) => {
  ElNotification({ type: 'info', message: `触发 ${type} 登录` });
};
</script>

<style scoped>
.login-dialog .el-dialog__header {
  background: linear-gradient(90deg, #42b983, #67c23a);
  color: white;
  font-weight: bold;
  text-align: center;
}

.login-dialog .el-dialog__body {
  padding: 20px 30px;
}

.social-login {
  text-align: center;
  margin: 20px 0;
}

.social-login p {
  margin-bottom: 10px;
  color: #666;
}

.social-login .el-button {
  margin: 0 10px;
}
</style>
