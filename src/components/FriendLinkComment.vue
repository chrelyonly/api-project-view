<template>
  <el-card class="wrapper animate__animated animate__fadeInUp">
    <h2 class="title">💬 评论区</h2>

    <div style="display: flex">
      <!-- 当前用户头像 -->
      <div style="text-align: center;margin: 0 20px 0 auto;">
        <div>
          <el-avatar
              :src="userInfo.avatar"
              size="large">
          </el-avatar>
        </div>
        <div>
          {{ userInfo.userAccount ? userInfo.userAccount : "游" }}
        </div>
      </div>
        <!-- 评论输入框 -->
        <el-input
            type="textarea"
            v-model="newComment"
            placeholder="说点什么吧..."
            :rows="3"
            show-word-limit
            @keyup.enter.native="submitComment"
        ></el-input>
    </div>
    <div style="text-align: center">
      <div>
        <el-image :src="captchaInfo.image" @click="getCode" style="height: 30px"></el-image>
      </div>
      <div>
        <el-input style="width: 150px" v-model="captchaInfo.code" placeholder="请输入验证码">
        </el-input>
      </div>
      <div>
        <el-button type="primary" size="small" @click="submitComment" style="margin-top: 10px;">
          发布评论
        </el-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24" v-for="comment in pagedComments" :key="comment.id">
        <div class="comment-card animate__animated animate__fadeIn">
          <div class="comment-header">
            <el-avatar :src="comment.userInfo.avatar" size="medium"></el-avatar>
            <span class="comment-name">{{ comment.userInfo.userAccount }}</span>
            <span class="comment-time">{{ comment.createTime }}</span>
          </div>
          <div class="comment-body">
            <p>{{ comment.content }}</p>
          </div>
          <div class="comment-footer">
            <el-button type="text" @click="likeComment(comment)">👍 {{ comment.likes }}</el-button>
            <el-button type="text" @click="reply(comment)">💬 回复</el-button>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.children && comment.children.length" class="replies">
            <div class="reply-card" v-for="reply in comment.children" :key="reply.id">
              <span class="reply-name">{{ reply.userInfo.userAccount }}:</span>
              <span class="reply-content">{{ reply.content }}</span>
            </div>
          </div>

          <!-- 回复输入框 -->
          <div v-if="replyingTo === comment.id" class="reply-input">
            <el-input
                type="textarea"
                v-model="replyContent"
                :placeholder="'回复 @' + comment.userInfo.userAccount"
                :rows="2"
                show-word-limit
                @keyup.enter.native="submitReply(comment)"
            ></el-input>
            <el-button type="primary" size="small" @click="submitReply(comment)" style="margin-top: 5px;">
              评论回复
            </el-button>
          </div>
        </div>
      </el-col>
      <!-- 🔽 没有数据时显示 -->
      <el-col v-if="pagedComments.length === 0" :span="24">
        <div class="comment-card animate__animated animate__fadeIn">
          <el-empty description="暂无数据"></el-empty>
        </div>
      </el-col>
    </el-row>

    <!-- 分页 -->
    <el-pagination
        v-if="comments.length > pageSize"
        background
        layout="prev, pager, next"
        :total="comments.length"
        :page-size="pageSize"
        v-model:current-page="currentPage"
        @current-change="handlePageChange"
        style="margin-top: 20px; text-align: center;"
    />
  </el-card>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import {getUserLoginStore} from "@/stores/counter.js";
import {ElNotification} from "element-plus";
// 定义 props
const props = defineProps({
  linkId: {
    type: Number,
    required: true
  }
});
// 用户信息
const userInfo = ref({});
onMounted(()=>{
  loadData();
  userInfo.value = getUserLoginStore().getUserInfo();
  getCode();
})


const comments = ref([]);
// 获取评论内容
const loadData = ()=>{
  let params = {
    linkId: props.linkId,
  }
  $https("","get",params,1,{}).then((res)=>{
    comments.value = res.data.data;
  })
}

const replyContent = ref("");
const replyingTo = ref(null);

// 分页
const pageSize = 5;
const currentPage = ref(1);
const pagedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return comments.value.slice(start, start + pageSize);
});



// 验证码信息
const captchaInfo = ref({
  // 标识
  key: "",
  // 图片
  image: "",
  // 值
  code: "",
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


const newComment = ref("");
// 提交评论
const submitComment = () => {
  if (!newComment.value.trim()) {
    ElNotification.warning("输入评论内容.")
    return;
  }
  if (!captchaInfo.value.code) {
    ElNotification.warning("输入正确的验证码")
    return;
  }
  newComment.value = "";
//   将数据发送到后端
  let params = {
    content: "",
    parentId: "",
    linkId: "",
  }
  let headers = {
    "Captcha-Key": captchaInfo.value.key,
    "Captcha-Code": captchaInfo.value.code,
  }
  $https("/comment-api/addComment","post",params,1,headers).then((res)=>{
    comments.value.unshift({
      // 无用字段临时标识
      id: res.data.data.id,
      content: newComment.value,
      linkId: props.linkId,
      userInfo: userInfo.value,
      createTime: res.data.data.createTime,
      likes: 0,
      children: [],
    });
  })
};

// 点赞的方法
const likeComment = (comment) => {
  comment.likes++;
};

// 回复评论的 回复框开关
const reply = (comment) => {
  replyingTo.value = comment.id;
  replyContent.value = "";
};

/**
 * 评论回复
 */
const submitReply = (comment) => {
  if (!replyContent.value.trim()) {
    ElNotification.warning("输入评论内容.")
    return;
  }
  if (!captchaInfo.value.code) {
    ElNotification.warning("输入正确的验证码")
    return;
  }

  //   将数据发送到后端
  let params = {
    content: replyContent.value,
    parentId: comment.id,
    linkId: props.linkId,
  }
  let headers = {
    "Captcha-Key": captchaInfo.value.key,
    "Captcha-Code": captchaInfo.value.code,
  }
  $https("/comment-api/addComment","post",params,1,headers).then((res)=>{
    comment.children.push({
      id: res.data.data.id,
      content: replyContent.value,
      linkId: props.linkId,
      userInfo: userInfo.value,
      createTime: res.data.data.createTime,
      likes: 0,
    });
    replyContent.value = "";
    replyingTo.value = null;
  })
};

const handlePageChange = (page) => {
  currentPage.value = page;
};
</script>

<style scoped>
.wrapper {
  margin-bottom: 20px;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  backdrop-filter: blur(10px);
}

.title {
  text-align: center;
  margin: 20px auto;
  color: #ff6b6b;
  font-size: 22px;
  font-weight: bold;
}

.comment-card {
  margin-bottom: 15px;
  padding: 15px;
  border-radius: 10px;
  background: linear-gradient(135deg, #ffffff, #f9f9f9);
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.comment-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.comment-name {
  font-weight: bold;
  margin-left: 10px;
}

.comment-time {
  margin-left: auto;
  font-size: 12px;
  color: #888;
}

.comment-body p {
  margin: 0;
  font-size: 14px;
}

.comment-footer {
  margin-top: 10px;
  display: flex;
  gap: 15px;
}

.replies {
  margin-top: 10px;
  padding-left: 40px;
}

.reply-card {
  font-size: 13px;
  margin-bottom: 5px;
}

.reply-name {
  font-weight: bold;
}

.reply-input {
  margin-top: 10px;
  padding-left: 40px;
}
</style>
