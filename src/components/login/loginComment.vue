<template>
  <el-dialog
      top="30vh"
      v-model="visible"
      title="🎉 用户登录 / 注册"
      append-to-body
      width="600px"
      @close="close"
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
        <el-input v-model="loginForm.userAccount" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="loginForm.code" placeholder="请输入验证码" prefix-icon="el-icon-sunny">
          <template #append>
            <el-image :src="captchaInfo.image"  @click="getCode" style="height: 30px"></el-image>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <!-- 注册表单 -->
    <el-form v-if="activeTab==='register'" :model="registerForm" label-width="80px">
      <el-form-item label="用户名">
        <el-input v-model="registerForm.userAccount" placeholder="请输入用户名" prefix-icon="el-icon-user"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input type="password" v-model="registerForm.password" placeholder="请输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input type="password" v-model="registerForm.confirmPassword" placeholder="请再次输入密码" prefix-icon="el-icon-lock"></el-input>
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="registerForm.code" placeholder="请输入验证码" prefix-icon="el-icon-sunny">
          <template #append>
            <el-image :src="captchaInfo.image" @click="getCode" style="height: 30px"></el-image>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <!-- 第三方登录 -->
    <div class="social-login">
      <p>快速登录:</p>
      <el-button type="success" circle  @click="socialLogin('strawberry')">
        莓
      </el-button>
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
        <el-button type="primary" v-if="activeTab==='login'" @click="login" :disabled="btnLock">{{ btnLock?'登录中...':'登录' }}</el-button>
        <el-button type="primary" v-if="activeTab==='register'" @click="register" :disabled="btnLock">{{ btnLock?'注册中...':'注册' }}</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script setup>
import {ref, watch, defineProps, defineEmits, onMounted} from 'vue';
import {ElMessageBox, ElNotification} from 'element-plus';

const visible = ref(false);
const activeTab = ref('login');


onMounted(()=>{
})

const init = () => {
  visible.value = true;
  getCode();
}
defineExpose({
  init:init
})


// 验证码信息
const captchaInfo = ref({
  key: "",
  image: "",
})
// 获取验证码
const getCode = ()=>{
  let params = {

  }
  $https("/strawberry-user-api/getCode","get",params,1,{}).then(res => {
    captchaInfo.value.image = res.data.data.image
    captchaInfo.value.key = res.data.data.key
  })
}

// 按钮锁
const btnLock = ref(false);
// 登录表单
const loginForm = ref({
  userAccount:'',
  password:'',
  // 验证码的值
  code: "",
});
// 登录方法
const login = async () => {
  if (!loginForm.value.userAccount || !loginForm.value.password) {
    ElNotification({ type: 'warning', message: '请输入用户名和密码' });
    return;
  }
  if (!loginForm.value.code){
    ElNotification.warning("请输入验证码")
    return;
  }
  btnLock.value = true;
  let params = {
    userAccount: loginForm.value.userAccount,
    password: loginForm.value.password,
  }
  let headers = {
    "Captcha-Key": captchaInfo.value.key,
    "Captcha-Code": loginForm.value.code,
  }
  $https('/strawberry-user-api/login', 'post',params,2,headers).then( res=> {
    ElNotification.success(res.data?.msg)
    $setStore({
      name: "userInfo",
      content: res.data.data
    })
    $setStore({
      name: "accessToken",
      content: res.data.data.accessToken
    })
    $setStore({
      name: "refreshToken",
      content: res.data.data.refreshToken
    })
  //   登陆成功刷新当前页面
    window.location.reload();
  }).catch((e)=>{
    console.log(e)
    getCode()
  }).finally(()=>{
    btnLock.value = false;
    visible.value = false;
  })
};



// 注册表单
const registerForm = ref({
  userAccount:'',
  password:'',
  // 确认密码
  confirmPassword: "",
  // 验证码的值
  code: "",
});
// 注册方法
const register = async () => {
  const { userAccount, password, confirmPassword, code } = registerForm.value;
  if (!userAccount || !password || !confirmPassword ) {
    ElNotification({ type: 'warning', message: '请填写完整注册信息' });
    return;
  }
  if (!code){
    ElNotification.warning("请输入验证码")
    return;
  }
  btnLock.value = true;
  let params = {
    userAccount: userAccount,
    password: password,
    confirmPassword: confirmPassword,
  }
  let headers = {
    "Captcha-Key": captchaInfo.value.key,
    "Captcha-Code": code,
  }
  $https('/strawberry-user-api/register', 'post',params,2,headers).then( res=> {
    console.log(res)
    ElNotification.success(res.data?.msg)
  }).catch((e)=>{
    console.log(e)
    getCode()
  }).finally(()=>{
    btnLock.value = false;
  })
};

// 第三方登录
const socialLogin = (type) => {
  ElMessageBox.confirm(
      `
    <div style="line-height: 1.6; text-align: left;">
      <p>✨ 使用 <b>${type}</b> 快捷登录，将会：</p>
      <ul style="margin-left: 18px;">
        <li>创建 <b>莓莓通行证</b>（全平台通用账号）</li>
        <li>创建当前平台的用户账号</li>
        <li>并自动建立两者之间的关联</li>
      </ul>
    </div>
    `,
      "⚠️ 登录提示",
      {
        confirmButtonText: "立即登录",
        cancelButtonText: "再想想",
        type: "warning",
        dangerouslyUseHTMLString: true,
        customClass: "social-login-box",
      }
  )
      .then(() => {
        if (type === "strawberry"){
          ElNotification({
            title: "莓莓通行证等待开放中...",
            message: `敬请期待`,
            type: "error",
            duration: 3000,
          });
        }else{
          ElNotification({
            title: "登录中...",
            message: `正在跳转至 ${type} 登录，请稍候`,
            type: "success",
            duration: 3000,
          });

          let params = {
            type: type,
            redirectUri: window.location.href,
            origin: window.location.origin,
          }
          $https("/oauth2-api/authorize/oauth2","post",params,2,{}).then( res => {
            window.location.href = res.data.data;
          })
        }
      })
      .catch(() => {
        ElNotification({
          title: "已取消",
          message: "您已取消快捷登录",
          type: "info",
          duration: 2000,
        });
      });
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

.social-login { text-align: center; margin: 20px 0; }
.social-login p { margin-bottom: 10px; color: #666; }
.social-login .el-button { margin: 0 10px; }


:deep(.el-input-group__append){
  padding: 0 !important;
}
</style>
