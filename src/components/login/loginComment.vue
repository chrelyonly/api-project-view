<template>
  <el-dialog v-model="visible" title="用户登录" append-to-body>
    <el-form :model="loginForm">
      <el-form-item label="用户名">
        <el-input v-model="loginForm.user_name"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginForm.password"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="login">登录</el-button>
    </span>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';
import { ElNotification } from 'element-plus';

const props = defineProps({
  modelValue: { type: Boolean, default: false }
});

const emit = defineEmits(['update:modelValue', 'login-success']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, val => {
  visible.value = val;
});

// 登录表单
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
</script>
