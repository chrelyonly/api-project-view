<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-python.js';
import { ElButton, ElTag, ElMessage, ElInput } from 'element-plus';

// 模板列表
const templates = ref([
  {
    id: 1,
    title: 'JS 示例模板',
    language_name: 'javascript',
    des: '打印 Hello World',
    code: 'console.log("Hello World");',
    tags: ['js','example'],
    star: 5
  },
  {
    id: 2,
    title: 'Python 示例',
    language_name: 'python',
    des: '打印 Hello World',
    code: 'print("Hello World")',
    tags: ['python','example'],
    star: 4
  },
  {
    id: 3,
    title: 'Java 示例',
    language_name: 'java',
    des: '打印 Hello World',
    code: 'public class Hello {\n public static void main(String[] args) {\n System.out.println("Hello World");\n }\n}',
    tags: ['java','example'],
    star: 3
  }
]);

// 搜索关键词
const searchKeyword = ref('');
const activeTags = ref([]);

// 复制代码
const copyCode = (code) => {
  navigator.clipboard.writeText(code).then(() => {
    ElMessage.success('代码已复制');
  }).catch(() => ElMessage.error('复制失败'));
};

// 下载代码
const downloadCode = (template) => {
  const blob = new Blob([template.code], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  let ext = template.language_name === 'javascript' ? 'js' : template.language_name;
  link.download = template.title + '.' + ext;
  link.href = URL.createObjectURL(blob);
  link.click();
  URL.revokeObjectURL(link.href);
  ElMessage.success('下载成功');
};

// 模板过滤
const filteredTemplates = computed(() => {
  return templates.value.filter(item => {
    const matchKeyword = searchKeyword.value
        ? item.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
        : true;
    const matchTags = activeTags.value.length > 0
        ? activeTags.value.every(tag => item.tags.includes(tag))
        : true;
    return matchKeyword && matchTags;
  });
});

// 高亮
const highlightAll = () => nextTick(() => Prism.highlightAll());
onMounted(() => highlightAll());
watch(filteredTemplates, () => highlightAll());

// 标签选择
const toggleTag = (tag) => {
  if (activeTags.value.includes(tag)) {
    activeTags.value = activeTags.value.filter(t => t !== tag);
  } else {
    activeTags.value.push(tag);
  }
};
</script>

<template>
  <div style="padding:20px;margin-top: 100px">
    <el-card>
      <!-- 搜索 -->
      <el-input
          v-model="searchKeyword"
          placeholder="搜索模板或标签"
          clearable
          style="width:300px; margin-bottom: 20px"
      />

      <!-- 标签过滤 -->
      <div style="margin-bottom: 20px;">
        <el-tag
            v-for="tag in ['js','python','java','example']"
            :key="tag"
            :type="activeTags.includes(tag)?'success':'info'"
            style="margin-right: 5px; cursor:pointer"
            @click="toggleTag(tag)"
        >
          {{ tag }}
        </el-tag>
      </div>

      <div class="template-list">
        <div v-for="template in filteredTemplates" :key="template.id" class="template-card">
          <div class="header">
            <h3>{{ template.title }}</h3>
            <div>
              <el-tag type="warning" v-for="tag in template.tags" :key="tag">{{ tag }}</el-tag>
              ⭐ {{ template.star }}
            </div>
          </div>
          <p>{{ template.des }}</p>

          <!-- 可编辑代码区 -->
          <pre class="language-{{ template.language_name }}"><code contenteditable @input="highlightAll">{{ template.code }}</code></pre>

          <div style="margin-top:10px">
            <el-button size="small" type="primary" @click="copyCode(template.code)">复制代码</el-button>
            <el-button size="small" type="success" @click="downloadCode(template)">下载代码</el-button>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.template-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

/* 卡片柔和渐变背景 */
.template-card {
  width: 400px;
  border-radius: 15px;
  padding: 20px;
  background: linear-gradient(135deg, rgba(240,240,245,0.8), rgba(220,230,240,0.8));
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  color: #333; /* 深色文字，更易读 */
  transition: all 0.3s ease;
}

.template-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.template-card h3 {
  margin: 0;
  color: #409eff; /* 保留主题色，但不刺眼 */
}

.template-card p {
  color: #555;
}

.template-card .el-tag {
  background-color: rgba(64,158,255,0.1); /* 标签淡色背景 */
  color: #409eff;
  margin-right: 5px;
}

pre {
  max-height: 300px;
  overflow: auto;
  background: rgba(245,245,245,0.9); /* 代码区柔和背景 */
  color: #333;
  padding: 12px;
  border-radius: 8px;
  font-family: "Courier New", monospace;
  margin-top: 10px;
}
</style>
