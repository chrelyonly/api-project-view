<template>
  <el-dialog
      top="40vh"
      v-model="visible"
      title="🎉 用户登录 / 注册"
      append-to-body
      width="600px"
      :close-on-click-modal="false"
      custom-class="login-dialog"
  >
    <!-- 登录/注册切换 -->
    <el-tabs v-model="activeTab" type="card" style="margin-bottom: 20px;">
      <el-tab-pane label="登录" name="login"></el-tab-pane>
      <el-tab-pane label="注册" name="register"></el-tab-pane>
    </el-tabs>

    <!-- 登录表单 -->
    <el-form v-if="activeTab==='login'" :model="loginForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="loginForm.user_name" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
    </el-form>

    <!-- 注册表单 -->
    <el-form v-if="activeTab==='register'" :model="registerForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="registerForm.user_name" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="registerForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="registerForm.confirm" placeholder="请再次输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱" prefix-icon="el-icon-message"></el-input>
      </el-form-item>
    </el-form>

    <!-- 第三方登录 -->
    <div class="social-login">
      <p>快速登录:</p>
      <el-button type="success" circle  @click="socialLogin('草莓通行证')">莓</el-button>
      <el-button circle  @click="socialLogin('github')">
        <svg class="icon" aria-hidden="true" style="width: 30px;">
          <use xlink:href="#icon-github"></use>
        </svg>
      </el-button>
      <el-button circle   @click="socialLogin('gitee')">
        <svg class="icon" aria-hidden="true" style="width: 30px;">
          <use xlink:href="#icon-GITEE"></use>
        </svg>
      </el-button>
      <el-button circle   @click="socialLogin('google')">
        <svg class="icon" aria-hidden="true" style="width: 30px;">
          <use xlink:href="#icon-google"></use>
        </svg>
      </el-button>
    </div>

    <div style="text-align: center; margin-top: 10px;">
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" v-if="activeTab==='login'" @click="login">登录</el-button>
        <el-button type="primary" v-if="activeTab==='register'" @click="register">注册</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { ElNotification } from 'element-plus';

const props = defineProps({ modelValue: { type: Boolean, default: false } });
const emit = defineEmits(['update:modelValue', 'login-success']);
const visible = ref(props.modelValue);
const activeTab = ref('login'); // 登录/注册切换

watch(() => props.modelValue, val => { visible.value = val; });

// 登录表单
const loginForm = ref({ user_name:'', password:'' });
// 注册表单
const registerForm = ref({ user_name:'', password:'', confirm:'', email:'' });

// 关闭弹窗
const close = () => { visible.value = false; emit('update:modelValue', false); };

// 登录方法
const login = async () => {
  if (!loginForm.value.user_name || !loginForm.value.password) {
    ElNotification({ type: 'warning', message: '请输入用户名和密码' });
    return;
  }
  const res = await $https('/api/login', 'post', loginForm.value);
  if (res.data.success) { ElNotification({ type: 'success', message: '登录成功' }); emit('login-success', res.data.user); close(); }
  else ElNotification({ type: 'error', message: res.data.message || '登录失败' });
};

// 注册方法
const register = async () => {
  const { user_name, password, confirm, email } = registerForm.value;
  if (!user_name || !password || !confirm || !email) {
    ElNotification({ type: 'warning', message: '请填写完整注册信息' });
    return;
  }
  if (password !== confirm) { ElNotification({ type: 'warning', message: '两次密码输入不一致' }); return; }
  const res = await $https('/api/register', 'post', registerForm.value);
  if (res.data.success) { ElNotification({ type: 'success', message: '注册成功，请登录' }); activeTab.value='login'; }
  else ElNotification({ type: 'error', message: res.data.message || '注册失败' });
};

// 第三方登录
const socialLogin = (type) => { ElNotification({ type: 'info', message: `触发 ${type} 登录` }); };
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

.social-login { text-align: center; margin: 20px 0; }
.social-login p { margin-bottom: 10px; color: #666; }
.social-login .el-button { margin: 0 10px; }
</style>
