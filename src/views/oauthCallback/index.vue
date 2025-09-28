<template>
  <div class="oauth-callback">
    <el-card class="callback-card">
      <!-- 加载中 -->
      <div v-if="loading" class="loading">
        <el-progress :percentage="50" type="circle" status="active" />
        正在处理授权...
      </div>

      <!-- 错误提示 -->
      <div v-else-if="error">
        <el-alert
            title="授权失败"
            type="error"
            :description="error"
            show-icon
        />
      </div>

      <!-- 已绑定 -->
      <div v-else-if="success && exist">
        <el-alert
            title="授权成功"
            type="success"
            :description="message"
            show-icon
        />
      </div>

      <!-- 未绑定，显示绑定表单 -->
      <div v-else>
        <el-alert
            title="未绑定系统账号"
            type="warning"
            description="请绑定您的系统账号以完成授权"
            show-icon
            style="margin-bottom: 20px"
        />
        <el-form :model="form" label-width="80px">
          <el-form-item label="账号">
            <el-input v-model="form.username" placeholder="请输入系统账号" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入密码"
            />
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="form.code" placeholder="请输入验证码" prefix-icon="el-icon-sunny">
              <template #append>
                <el-image :src="captchaInfo.image" @click="getCode" style="height: 30px"></el-image>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button
            type="primary"
            :loading="binding"
            @click="bindAccount"
            style="width: 100%; margin-top: 20px"
        >
          确认绑定
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {ElMessage, ElNotification} from "element-plus";

const route = useRoute();

const loading = ref(true);
const error = ref("");
const message = ref("");
const success = ref(false);
const exist = ref(false); // 是否已有绑定用户

// 绑定表单
const form = ref({
  username: "",
  password: "",
  code: "",
});
const binding = ref(false);

// 临时的tokenId,用于绑定系统内用户信息
const tokenId = ref("");
// 最后的重定向url,回到授权前的页面
const redirectUri = ref("");

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




// 授权逻辑
onMounted(async () => {
  try {
    const code = route.query.code;
    const state = route.query.state;
    const type = route.query.type;

    if (code && state && type) {
      let params = { code, state, type };

      $https("/oauth2-api/authorize/getUserInfo", "post", params, 2, {}).then((res) => {
              success.value = true;
              exist.value = true;
              message.value = "授权成功，已绑定系统账号";
              redirectUri.value = res.data.data.redirectUri;
              let data = res.data.data.loginToken;
              $setStore({
                name: "userInfo",
                content: data
              })
              $setStore({
                name: "accessToken",
                content: data.accessToken
              })
              $setStore({
                name: "refreshToken",
                content: data.refreshToken
              })
              //   登陆成功刷新当前页面
              window.location.href = redirectUri.value;
          }, (error) => {
            // 201是未找到系统用户,让用户绑定系统用户
            exist.value = false;
            message.value = "未绑定系统账号，请先绑定";
            if (error.code === 201) {
              tokenId.value = error.data.tokenId
              redirectUri.value = error.data.redirectUri
            }
            getCode();
          })
          .catch((err) => {
            error.value = err.message || "授权异常";
          })
          .finally(() => {
            loading.value = false;
          });
    } else {
      error.value = "未获取到授权信息";
      loading.value = false;
    }
  } catch (err) {
    error.value = err.message || "授权异常";
    loading.value = false;
  }
});

// 绑定逻辑
const bindAccount = () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.error("账号和密码不能为空");
    return;
  }

  if (!form.value.code){
    ElNotification.warning("请输入验证码")
    return;
  }

  binding.value = true;
  let params = {
    userAccount: form.value.username,
    password: form.value.password,
    tokenId: tokenId.value,
  };

  let headers = {
    "Captcha-Key": captchaInfo.value.key,
    "Captcha-Code": form.value.code,
  }
  $https("/oauth2-api/authorize/bindUserInfo", "post", params, 2, headers)
      .then((res) => {
          ElMessage.success("绑定成功，授权完成");
          success.value = true;
          exist.value = true;
          message.value = "绑定成功，已完成授权";
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
          window.location.href = redirectUri.value;
      })
      .catch((err) => {
        ElMessage.error(err.message || "绑定异常");
      })
      .finally(() => {
        binding.value = false;
      });
};
</script>

<style scoped>
.oauth-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.callback-card {
  width: 400px;
  text-align: center;
  padding: 40px;
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
