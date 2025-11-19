<template>
  <el-card class="wrapper animate__animated animate__fadeInUp">
    <h2 class="title">💬 评论区</h2>

    <div style="display: flex" v-show="userInfo?.userAccount">
      <!-- 当前用户头像 -->
      <div style="text-align: center;margin: 0 20px 0 auto;">
        <div>
          <el-avatar
              :src="userInfo?.avatar"
              size="large">
          </el-avatar>
        </div>
        <div>
          {{ userInfo?.userAccount ? userInfo?.userAccount : "未登录" }}
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
            @blur="getCode"
        ></el-input>
    </div>
    <div class="captcha-row"  v-show="userInfo?.userAccount">
      <el-input
          v-model="captchaInfo.code"
          placeholder="请输入验证码"
          size="small"
          style="width: 150px;"
      />
      <el-image
          :src="captchaInfo.image"
          @click="getCode"
          style="height: 32px; width: 90px; cursor: pointer; margin: 0 8px;"
      />
      <el-button type="primary" size="small" @click="submitComment">
        发布评论
      </el-button>
    </div>


    <!-- 评论列表 -->
    <el-row :gutter="20" style="margin-top: 20px" v-loading="commentLoading">
      <!-- 排序选项 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 class="title">💬 评论区</h2>
        <el-tag>共计: {{commentPage.total}}</el-tag>
        <div>
          <el-button size="small" :type="sortInfo.column==='create_time' && sortInfo.type==='ascs'?'primary':'default'" @click="setSortInfo('create_time','ascs')">时间倒序</el-button>
          <el-button size="small" :type="sortInfo.column==='create_time' && sortInfo.type==='descs'?'primary':'default'" @click="setSortInfo('create_time','descs')">时间正序</el-button>
          <el-button size="small" :type="sortInfo.column==='star' && sortInfo.type==='descs'?'primary':'default'" @click="setSortInfo('star','descs')">按点赞</el-button>
        </div>
      </div>

      <el-col :span="24" v-for="comment in pagedComments" :key="comment.id">
        <div class="comment-card animate__animated animate__fadeIn">
          <div class="comment-header">
            <el-avatar :src="comment.userInfo.avatar" size="medium"></el-avatar>
            <span class="comment-name">{{ comment.userInfo.userAccount }}</span>
            <span class="comment-time">{{ comment.createTime }}</span>
            <span class="comment-time">{{ parseUA(comment.userAgent) }}</span>
          </div>
          <div class="comment-body">
            <p>{{ comment.content }}</p>
          </div>
          <div class="comment-footer">
            <el-button type="text"  v-if="comment.linkId !== linkId" @click="goLinkIdPage(comment.linkId)">🥟
              来源: {{
                comment.linkId === "10000"?"友情链接":
                comment.linkId === "10001"?"下载中心":
                comment.linkId === "10002"?"代码模板":
                comment.linkId === ""?"网站首页":"网站接口详情"
              }}
            </el-button>
            <el-button type="text" @click="likeComment(comment)">👍 {{ comment.star }}</el-button>
            <el-button type="text" @click="reply(comment)">💬 回复</el-button>
          </div>

          <!-- 回复列表 -->
          <div v-if="comment.children && comment.children.length" class="replies">
            <div class="reply-card" v-for="reply in comment.children" :key="reply.id">

              <!-- 顶部信息行：头像 + 用户名 + 时间 + 设备信息 -->
              <div class="reply-header">
                <el-avatar :src="reply.userInfo.avatar" size="24"></el-avatar>
                <span class="reply-name">{{ reply.userInfo.userAccount }}</span>
                <span class="reply-time">{{ reply.createTime }}</span>
                <span class="reply-device">{{ parseUA(reply.userAgent) }}</span>
              </div>

              <!-- 评论内容 -->
              <div class="reply-content">
                {{ reply.content }}
              </div>
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
                @blur="getCode"
            ></el-input>
            <div class="captcha-row">
              <el-input
                  v-model="captchaInfo.code"
                  placeholder="请输入验证码"
                  size="small"
                  style="width: 150px;"
              />
              <el-image
                  :src="captchaInfo.image"
                  @click="getCode"
                  style="height: 32px; width: 90px; cursor: pointer; margin: 0 8px;"
              />
              <el-button type="primary" size="small" @click="submitReply(comment)">
                评论回复
              </el-button>
            </div>
            <div>
            </div>
          </div>
        </div>
      </el-col>
      <div style="text-align: center;margin: 0 auto">
        <el-button type="primary" @click="loadMore" >加载更多</el-button>
      </div>
      <!-- 🔽 没有数据时显示 -->
      <el-col v-if="pagedComments.length === 0" :span="24">
        <div class="comment-card animate__animated animate__fadeIn">
          <el-empty description="暂无数据"></el-empty>
        </div>
      </el-col>
    </el-row>

  </el-card>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import {getUserLoginStore} from "@/stores/counter.js";
import {ElMessage, ElNotification} from "element-plus";
import {useRouter} from "vue-router";
import {MessageBox} from "@element-plus/icons-vue";
const router = useRouter();
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
  userInfo.value = getUserLoginStore()?.getUserInfo();
  getCode();
})

// 评论内容
const comments = ref([]);
// 评论分页
const commentPage = ref({
  pageSize: 10,
  currentPage: 1,
  total: 0
});
// 排序字段以及方式
const sortInfo = ref({
  // 字段
  column: "create_time",
  // 排序方式 ascs descs
  type:"descs",
})
const setSortInfo = (column,type) => {
  //排序的时候重置分页和数据
  comments.value = []
  commentPage.value.currentPage = 1
  sortInfo.value.column = column;
  sortInfo.value.type = type;
  loadData()
}
// 计算出当前评论
const pagedComments = computed(() => {
  // const start = (commentPage.value.currentPage - 1) * commentPage.value.pageSize;
  // return comments.value.slice(start, start + commentPage.value.pageSize);
  return comments.value;
});
// 评论loading
const commentLoading = ref(false);
// 获取评论内容
const loadData = ()=>{
  let params = {
    linkId: props.linkId,
    current: commentPage.value.currentPage,
    size: commentPage.value.pageSize,
    // descs: "create_time",
  }
  // 如果排序字段类型存在的话则直接填充字段
  if (sortInfo.value.type && sortInfo.value.column){
    params[sortInfo.value.type] = sortInfo.value.column
  }
  commentLoading.value = true;
  $https("/comment-api/getComment","get",params,1,{}).then((res)=>{
    const data = res.data.data;
    commentPage.value.total = data.total;
    comments.value.push(...data.records);
  }).finally(() => {
    commentLoading.value = false;
  })
}
// 加载更多
const loadMore = () => {
  if (comments.value.length >= commentPage.value.total){
    ElNotification.warning("没有更多啦~")
    return;
  }
  commentPage.value.currentPage++
  loadData();
};



// 来访者信息格式化
const parseUA = (ua) => {
  let os = '未知系统'
  let browser = '未知浏览器'
  let device = 'PC'

  // 操作系统判断
  if (/windows nt 10/i.test(ua)) os = 'Windows 10'
  else if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1'
  else if (/windows nt 6\.2/i.test(ua)) os = 'Windows 8'
  else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7'
  else if (/mac os x/i.test(ua)) os = 'Mac OS X'
  else if (/android/i.test(ua)) os = 'Android'
  else if (/iphone/i.test(ua)) os = 'iPhone iOS'
  else if (/ipad/i.test(ua)) os = 'iPad iOS'
  else if (/linux/i.test(ua)) os = 'Linux'

  // 浏览器判断
  if (/chrome\/([\d.]+)/i.test(ua)) browser = 'Chrome ' + RegExp.$1
  else if (/firefox\/([\d.]+)/i.test(ua)) browser = 'Firefox ' + RegExp.$1
  else if (/safari\/([\d.]+)/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari ' + RegExp.$1
  else if (/edg\/([\d.]+)/i.test(ua)) browser = 'Edge ' + RegExp.$1
  else if (/msie\s([\d.]+)/i.test(ua)) browser = 'IE ' + RegExp.$1

  // 设备判断
  if (/mobile/i.test(ua)) device = 'Mobile'
  else if (/tablet/i.test(ua)) device = 'Tablet'

  // return { os, browser, device }
  // 拼接成一句话
  return `系统：${os}，浏览器：${browser}，设备：${device}`
}


// 回复内容
const replyContent = ref("");
// 回复谁
const replyingTo = ref(null);



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
//   将数据发送到后端
  let params = {
    content: newComment.value,
    linkId: props.linkId,
  }
  let headers = {
    "Captcha-Key": captchaInfo.value.key,
    "Captcha-Code": captchaInfo.value.code,
  }
  $https("/comment-api/addComment","post",params,2,headers).then((res)=>{
    comments.value.unshift({
      // 无用字段临时标识
      id: res.data.data.id,
      content: newComment.value,
      linkId: props.linkId,
      userInfo: userInfo.value,
      createTime: res.data.data.createTime,
      star: 0,
      children: [],
    });
    newComment.value = "";
  })
};


// 点赞的方法
const likeComment = (comment) => {
  comment.star++;

  let params = {
    id: comment.id,
  }
  $https("/comment-api/commentStar","post",params,1,{}).then(res => {

  })
};


// 前往对于接口详情的方法
const goLinkIdPage = (linkId) => {
debugger
// comment.linkId === "10000"?"友情链接":
// comment.linkId === "10001"?"下载中心":
// comment.linkId === "10002"?"代码模板":
// comment.linkId === ""?"网站首页":"网站接口详情"
  if (linkId === "10000"){
    router.push({ path: "/link/index"});
  }else if(linkId === "10001"){
    router.push({ path: "/downloadCenter/index"});
  }else if(linkId === "10002"){
    router.push({ path: "/code-template/index"});
  }else if(linkId === ""){
    router.push({ path: "/"});
  }else{
    router.push({ path: "/doc/api-detail", query: { id: linkId } });
  }
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
  $https("/comment-api/addComment","post",params,2,headers).then((res)=>{
    comment.children.push({
      id: res.data.data.id,
      content: replyContent.value,
      linkId: props.linkId,
      userInfo: userInfo.value,
      createTime: res.data.data.createTime,
      star: 0,
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
.captcha-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  flex-wrap: wrap; /* 小屏幕时自动换行 */
}

.captcha-row .el-input {
  margin-bottom: 5px;
}

.captcha-row .el-button {
  white-space: nowrap;
}

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

.reply-input {
  margin-top: 10px;
  padding-left: 40px;
}



.replies {
  margin-left: 30px; /* 子评论缩进 */
  margin-top: 10px;
}

.reply-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 8px;
  background-color: #fafafa;
  transition: all 0.3s;
}

.reply-card:hover {
  background-color: #f5f5f5;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #555;
  margin-bottom: 4px;
}

.reply-name {
  font-weight: 500;
  color: #409eff; /* Element Plus 蓝色 */
}

.reply-time {
  color: #999;
}

.reply-device {
  color: #999;
  font-style: italic;
}

.reply-content {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  padding-left: 32px; /* 对齐头像左侧 */
}
</style>
