<template>
  <el-card class="wrapper animate__animated animate__fadeInUp">
    <h2 class="title">💬 评论区</h2>

    <!-- 评论输入框 -->
    <el-input
        type="textarea"
        v-model="newComment"
        placeholder="说点什么吧..."
        :rows="3"
        show-word-limit
        @keyup.enter.native="submitComment"
    ></el-input>
    <el-button type="primary" size="small" @click="submitComment" style="margin-top: 10px;">
      发布评论
    </el-button>

    <!-- 评论列表 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24" v-for="comment in pagedComments" :key="comment.id">
        <div class="comment-card animate__animated animate__fadeIn">
          <div class="comment-header">
            <el-avatar :src="comment.avatar" size="medium">{{ comment.user_name[0] }}</el-avatar>
            <span class="comment-name">{{ comment.user_name }}</span>
            <span class="comment-time">{{ comment.created_at }}</span>
          </div>
          <div class="comment-body">
            <p>{{ comment.content }}</p>
          </div>
          <div class="comment-footer">
            <el-button type="text" @click="likeComment(comment)">👍 {{ comment.likes }}</el-button>
            <el-button type="text" @click="reply(comment)">💬 回复</el-button>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.replies && comment.replies.length" class="replies">
            <div class="reply-card" v-for="reply in comment.replies" :key="reply.id">
              <span class="reply-name">{{ reply.user_name }}:</span>
              <span class="reply-content">{{ reply.content }}</span>
            </div>
          </div>

          <!-- 回复输入框 -->
          <div v-if="replyingTo === comment.id" class="reply-input">
            <el-input
                type="textarea"
                v-model="replyContent"
                placeholder="回复 @{{ comment.user_name }}"
                :rows="2"
                show-word-limit
                @keyup.enter.native="submitReply(comment)"
            ></el-input>
            <el-button type="primary" size="small" @click="submitReply(comment)" style="margin-top: 5px;">
              发布回复
            </el-button>
          </div>
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
    <!-- 登录组件 -->
    <loginComment
        v-model="loginDialogVisible"
        @login-success="handleLoginSuccess"
    ></loginComment>
  </el-card>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import LoginComment from "@/components/login/loginComment.vue";
// 定义 props
const props = defineProps({
  linkId: {
    type: Number,
    required: true
  }
});
onMounted(()=>{
  loadData();
})
// 登录弹出
const loginDialogVisible = ref(false);
// 登录成功回调
const handleLoginSuccess = (user) => {

};
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

const newComment = ref("");
const replyContent = ref("");
const replyingTo = ref(null);

// 分页
const pageSize = 5;
const currentPage = ref(1);
const pagedComments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return comments.value.slice(start, start + pageSize);
});

const submitComment = () => {
  if (!newComment.value.trim()) return;
  comments.value.unshift({
    id: Date.now(),
    user_name: "游客",
    avatar: "",
    content: newComment.value,
    likes: 0,
    created_at: new Date().toLocaleString(),
    replies: []
  });
  newComment.value = "";
};

const likeComment = (comment) => {
  comment.likes++;
};

const reply = (comment) => {
  replyingTo.value = comment.id;
  replyContent.value = "";
};

/**
 * 发布评论
 */
const submitReply = (comment) => {
  if (!replyContent.value.trim()) return;
  comment.replies.push({
    id: Date.now(),
    user_name: "游客",
    content: replyContent.value
  });
  replyContent.value = "";
  replyingTo.value = null;
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
