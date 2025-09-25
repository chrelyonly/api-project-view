  <template>
    <div class="profile-container">
      <el-card class="profile-card animate__animated animate__fadeInUp">
        <h2 class="title">👤 个人信息</h2>
        <!-- 用户头像 -->
        <div class="avatar-section">
          <div >
                <el-avatar style="border: #ff9400 1px solid;height: 100px;width: 100px;" size="large" :src="userInfo.avatar || 'https://i.imgs.ovh/2025/07/29/2AO1n.png'"></el-avatar>
          </div>
          <div >
            <el-button type="primary" size="small" @click="changeAvatar">修改头像</el-button>
            <!-- 隐藏文件选择框 -->
            <input
                type="file"
                ref="fileInput"
                accept="image/*"
                style="display: none"
                @change="handleFileChange"
            />
          </div>
        </div>

        <el-form :model="userInfo" label-width="120px" class="info-form" label-position="left">
          <!-- 用户名 -->
          <el-form-item label="用户名">
            <el-input
                v-model="userInfo.userAccount"
                disabled
                placeholder="不可修改用户名"
                prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>

          <!-- 邮箱 -->
          <el-form-item label="邮箱">
            <el-input
                v-model="userInfo.email"
                placeholder="请输入邮箱"
                clearable
                prefix-icon="el-icon-message"
            ></el-input>
          </el-form-item>

          <!-- 昵称 -->
          <el-form-item label="昵称">
            <el-input
                v-model="userInfo.name"
                placeholder="请输入昵称"
                clearable
                prefix-icon="el-icon-edit"
                suffix-icon="el-icon-check"
            ></el-input>
          </el-form-item>

          <!-- 个性签名 -->
          <el-form-item label="个性签名">
            <el-input
                v-model="userInfo.sign"
                placeholder="请输入个性签名"
                clearable
                prefix-icon="el-icon-document"
            ></el-input>
          </el-form-item>

          <!-- 描述 -->
          <el-form-item label="描述">
            <el-input
                type="textarea"
                v-model="userInfo.des"
                :rows="3"
                placeholder="请输入个人描述"
                prefix-icon="el-icon-notebook-2"
            ></el-input>
          </el-form-item>

          <!-- 个人网站 -->
          <el-form-item label="个人网站">
            <el-input
                v-model="userInfo.webSite"
                placeholder="https://example.com"
                clearable
                prefix-icon="el-icon-link"
            ></el-input>
          </el-form-item>

          <!-- 注册时间 -->
          <el-form-item label="注册时间">
            <el-input
                v-model="userInfo.createTime"
                disabled
                prefix-icon="el-icon-time"
            ></el-input>
          </el-form-item>

          <!-- 状态 -->
          <el-form-item label="状态">
            <el-tag :type="userInfo.status === 1 ? 'success' : 'danger'">
              {{ userInfo.status === 1 ? '活跃' : '禁用' }}
            </el-tag>
          </el-form-item>
        </el-form>


        <!-- 操作按钮 -->
        <div class="actions">
          <el-button type="primary" @click="updateProfile" :disabled="btnLock">{{ btnLock?'修改中...':'保存修改' }}</el-button>
          <el-button type="danger" @click="logout" :disabled="btnLock">退出登录</el-button>
        </div>
      </el-card>
    </div>
  </template>

  <script setup>
  import { ref, onMounted } from "vue";
  import { ElMessage, ElMessageBox } from "element-plus";
  import {getUserLoginStore} from "@/stores/counter.js";

  const userInfo = ref({});

  // 获取用户信息
  onMounted(() => {
    userInfo.value = getUserLoginStore().getUserInfo();
  });

  const fileInput = ref(null);
  // 选择图片
  const changeAvatar = () => {
    fileInput.value.click();
  }
  // 文件上传
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isImage) {
      ElMessage.error('请选择图片文件！');
      return;
    }
    if (!isLt2M) {
      ElMessage.error('图片大小不能超过 2MB！');
      return;
    }

    // 生成预览
    const reader = new FileReader();
    reader.onload = (e) => {
      userInfo.value.avatar = e.target.result;
    };
    reader.readAsDataURL(file);

    // 后续可以上传 file 到后端
    // uploadAvatar(file);
  };

  // 按钮状态
  const btnLock = ref(false)
  // 保存修改
  const updateProfile = async () => {
    btnLock.value = true;

    let params = {
      email: userInfo.value.email,
      name: userInfo.value.name,
      sign: userInfo.value.sign || '',       // 个性签名
      des: userInfo.value.des || '',         // 描述
      avatarBase64: userInfo.value.avatar,         // 头像
      webSite: userInfo.value.webSite || '', // 个人网站
    }
    $https("/strawberry-user/updateProfile","post",params,2,{}).then( res=> {
      ElMessage({ type: "success", message: res.data.msg});
    //   将返回的新用户信息保存
      $setStore({
        name: "userInfo",
        content: res.data.data
      })
    }).finally( () => {
      btnLock.value = false;
    })
  };

  // 退出登录
  const logout = () => {
    ElMessageBox.confirm("确定要退出登录吗？", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }).then(() => {
        $clearStore();
        // 跳转到首页或登录页
        window.location.href = "/";
    });
  };
  </script>

  <style scoped>
  .profile-container {
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
    padding-top: 100px;
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
