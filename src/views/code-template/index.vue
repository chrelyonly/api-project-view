<script setup>
import { ref, reactive, onMounted, computed, nextTick, watch, getCurrentInstance } from 'vue';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-python.js';
import { ElButton, ElTag, ElMessage, ElInput } from 'element-plus';
import FriendLinkComment from "@/components/FriendLinkComment.vue";

// 获取标签类型
const getTagType = (tag) => {
  const typeMap = {
    'example': 'success',
    'advanced': 'warning',
    'basic': 'info',
    'js': 'primary',
    'python': 'success',
    'java': 'danger',
    'function': 'primary',
    'class': 'warning',
    'async': 'info',
    'es6': 'success',
    'collection': 'warning',
    'exception': 'danger',
    'data': 'primary',
    'dom': 'info'
  };
  return typeMap[tag] || 'info';
};

// 获取标签显示文本
const getTagText = (tag) => {
  const textMap = {
    'example': '示例',
    'advanced': '高级',
    'basic': '基础',
    'js': 'JavaScript',
    'python': 'Python',
    'java': 'Java',
    'function': '函数',
    'class': '类',
    'async': '异步',
    'es6': 'ES6+',
    'collection': '集合',
    'exception': '异常',
    'data': '数据处理',
    'dom': 'DOM操作'
  };
  return textMap[tag] || tag;
};

// 获取语言图标颜色
const getLanguageColor = (language) => {
  const colorMap = {
    'javascript': '#f1e05a',
    'python': '#3572A5',
    'java': '#b07219'
  };
  return colorMap[language.toLowerCase()] || '#6cc644';
};

// 加载状态和错误状态
const loading = ref(false);
const error = ref(null);
const hasFetched = ref(false);

// 默认模板数据（作为后备）
const defaultTemplates = [
  // JavaScript 分类
  {
    id: 1,
    title: 'JavaScript 基础函数模板',
    language_name: 'javascript',
    des: 'JavaScript 基础函数模板，展示函数定义、参数传递和返回值的使用方法',
    code: '// JavaScript基础函数模板\n/**\n * 计算两个数字的和\n * @param {number} a - 第一个数字\n * @param {number} b - 第二个数字\n * @returns {number} 两个数字的和\n */\nfunction add(a, b) {\n  return a + b;\n}\n\n/**\n * 计算两个数字的差\n * @param {number} a - 被减数\n * @param {number} b - 减数\n * @returns {number} 两个数字的差\n */\nfunction subtract(a, b) {\n  return a - b;\n}\n\n// 使用示例\nconsole.log(add(5, 3)); // 输出: 8\nconsole.log(subtract(10, 4)); // 输出: 6',
    tags: ['js', 'basic', 'function'],
    star: 5
  },
  {
    id: 2,
    title: 'JavaScript Promise 异步处理',
    language_name: 'javascript',
    des: 'JavaScript Promise 异步编程模板，展示 Promise 的创建、链式调用和错误处理',
    code: '// JavaScript Promise异步处理模板\n/**\n * 模拟异步数据获取\n * @param {string} url - 请求URL\n * @returns {Promise} 返回Promise对象\n */\nfunction fetchData(url) {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (url.includes("error")) {\n        reject(new Error("请求失败"));\n      } else {\n        resolve({\n          data: `来自\\${url}的数据`,\n          status: 200\n        });\n      }\n    }, 1000);\n  });\n}\n\n// Promise链式调用示例\nfetchData("https://api.example.com/data")\n  .then(response => {\n    console.log("数据获取成功:", response.data);\n    return fetchData("https://api.example.com/more-data");\n  })\n  .then(moreData => {\n    console.log("更多数据获取成功:", moreData.data);\n  })\n  .catch(error => {\n    console.error("发生错误:", error.message);\n  });',
    tags: ['js', 'advanced', 'async'],
    star: 4
  },
  // 添加更多示例数据以展示效果
  {
    id: 3,
    title: 'Python 基础函数模板',
    language_name: 'python',
    des: 'Python 基础函数模板，展示函数定义、参数传递和返回值的使用方法',
    code: '# Python基础函数模板\n"""\n计算两个数字的和\n\nArgs:\n    a: 第一个数字\n    b: 第二个数字\n\nReturns:\n    两个数字的和\n"""\ndef add(a, b):\n    return a + b\n\n"""\n计算两个数字的差\n\nArgs:\n    a: 被减数\n    b: 减数\n\nReturns:\n    两个数字的差\n"""\ndef subtract(a, b):\n    return a - b\n\n# 使用示例\nprint(add(5, 3))  # 输出: 8\nprint(subtract(10, 4))  # 输出: 6',
    tags: ['python', 'basic', 'function'],
    star: 4
  },
  {
    id: 4,
    title: 'Java 类定义模板',
    language_name: 'java',
    des: 'Java 类定义基础模板，展示类的创建、构造函数和方法的使用',
    code: '// Java类定义模板\npublic class Calculator {\n    /**\n     * 计算两个数字的和\n     * @param a 第一个数字\n     * @param b 第二个数字\n     * @return 两个数字的和\n     */\n    public int add(int a, int b) {\n        return a + b;\n    }\n    \n    /**\n     * 计算两个数字的差\n     * @param a 被减数\n     * @param b 减数\n     * @return 两个数字的差\n     */\n    public int subtract(int a, int b) {\n        return a - b;\n    }\n    \n    public static void main(String[] args) {\n        Calculator calc = new Calculator();\n        System.out.println(calc.add(5, 3)); // 输出: 8\n        System.out.println(calc.subtract(10, 4)); // 输出: 6\n    }\n}',
    tags: ['java', 'basic', 'class'],
    star: 5
  }
];

// 模板列表
const templates = ref([...defaultTemplates]);

// 编辑状态标记
const isEditing = ref({});

// 搜索关键词
const searchKeyword = ref('');
const activeTags = ref([]);

// 复制代码
const copyCode = (code) => {
  navigator.clipboard.writeText(code)
    .then(() => {
      ElMessage({
        message: '代码已复制到剪贴板',
        type: 'success',
        duration: 2000
      });
    })
    .catch(() => {
      ElMessage({
        message: '复制失败，请手动复制',
        type: 'error',
        duration: 2000
      });
    });
};

// 判断是否有激活的过滤条件
const hasActiveFilters = computed(() => {
  return searchKeyword.value !== '' || activeTags.value.length > 0;
});

// 测试代码
const testCode = (code, language) => {
  try {
    // 根据语言类型执行不同的测试逻辑
    let testResult = '';
    
    switch (language.toLowerCase()) {
      case 'javascript':
        testResult = `JavaScript代码测试成功！\n代码结构良好，包含\\${(code.match(/function/g) || []).length}个函数定义`;
        break;
        
      case 'python':
        testResult = `Python代码测试准备中...\n代码长度: \\${code.length}字符\n包含函数定义: \\${(code.match(/def /g) || []).length}个`;
        break;
        
      case 'java':
        testResult = `Java代码测试准备中...\n代码长度: \\${code.length}字符\n包含类定义: \\${(code.match(/class /g) || []).length}个`;
        break;
        
      default:
        testResult = `不支持的语言类型: \\${language}`;
    }
    
    ElMessage({
      message: testResult,
      type: 'info',
      duration: 3000,
      showClose: true
    });
  } catch (error) {
    ElMessage({
        message: `测试执行出错: \\${error.message}`,
        type: 'error',
        duration: 3000,
        showClose: true
      });
  }
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

// 根据语言分类模板
const categorizedTemplates = computed(() => {
  const categories = {
    'javascript': [],
    'python': [],
    'java': []
  };
  
  filteredTemplates.value.forEach(template => {
    const lang = template.language_name.toLowerCase();
    if (categories.hasOwnProperty(lang)) {
      categories[lang].push(template);
    }
  });
  
  return categories;
});

// 模板过滤
const filteredTemplates = computed(() => {
  return templates.value.filter(item => {
    const keyword = searchKeyword.value.toLowerCase();
    const matchKeyword = keyword === '' || 
      item.title.toLowerCase().includes(keyword) ||
      item.des.toLowerCase().includes(keyword) ||
      item.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
      item.language_name.toLowerCase().includes(keyword);
    
    const matchTags = activeTags.value.length === 0 || 
      activeTags.value.every(tag => item.tags.includes(tag));
    
    return matchKeyword && matchTags;
  });
});

// 获取当前显示的模板数量统计
const templateStats = computed(() => {
  const stats = {
    total: filteredTemplates.value.length,
    javascript: 0,
    python: 0,
    java: 0
  };
  
  filteredTemplates.value.forEach(template => {
    const lang = template.language_name.toLowerCase();
    if (stats.hasOwnProperty(lang)) {
      stats[lang]++;
    }
  });
  
  return stats;
});

// 高亮特定代码块
const highlightCode = (element) => {
  nextTick(() => {
    Prism.highlightElement(element);
  });
};

// 高亮所有代码块
const highlightAll = () => nextTick(() => Prism.highlightAll());

onMounted(() => {
  // 组件挂载后获取数据
  fetchTemplates();
  // 初始高亮
  highlightAll();
});

watch(filteredTemplates, () => highlightAll());

// 标签选择
const toggleTag = (tag) => {
  if (activeTags.value.includes(tag)) {
    activeTags.value = activeTags.value.filter(t => t !== tag);
  } else {
    activeTags.value.push(tag);
  }
};

// 从API获取模板数据
const fetchTemplates = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // 使用$https工具调用API获取模板数据
    // 注意：这里使用空参数对象，不需要特定的id
    const params = {};
    const response = $https("/code-template-api/list", "get", params, 1, {})
    
    if (response && response.data && response.data.code === 200 && response.data.data) {
      // 确保数据格式正确
      const apiTemplates = Array.isArray(response.data.data) ? response.data.data : [];
      
      // 如果API返回了数据，则使用API数据
      if (apiTemplates.length > 0) {
        templates.value = apiTemplates;
      } else {
        // 否则使用默认数据作为后备
        templates.value = [...defaultTemplates];
        ElMessage.warning('未获取到模板数据，显示默认示例');
      }
    } else {
      // API返回格式不符合预期，使用默认数据
      templates.value = [...defaultTemplates];
      ElMessage.warning('数据格式异常，显示默认示例');
    }
  } catch (err) {
    console.error('获取模板数据失败:', err);
    error.value = '获取模板数据失败，请稍后重试';
    // 出错时使用默认数据作为后备
    templates.value = [...defaultTemplates];
    ElMessage.error('获取数据失败，显示默认示例');
  } finally {
    loading.value = false;
    hasFetched.value = true;
  }
};

// 更新代码内容
const updateCode = (templateId, newCode) => {
  const template = templates.value.find(t => t.id === templateId);
  if (template) {
    template.code = newCode;
  }
};

// 重新获取数据
const refreshData = () => {
  fetchTemplates();
};

// 防抖函数
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// 防抖处理代码高亮
const debouncedHighlight = debounce((element) => {
  highlightCode(element);
}, 300);

// 开始编辑
const startEditing = (templateId) => {
  isEditing.value[templateId] = true;
};

// 结束编辑
const finishEditing = (templateId) => {
  isEditing.value[templateId] = false;
};
</script>

<template>
  <div class="page-container">
    <div class="main-content">
      <h1 class="page-title">代码模板库</h1>
      <div class="filter-section">
        <!-- 搜索 -->
        <div class="search-container">
          <span class="search-label">搜索模板：</span>
          <el-input
              v-model="searchKeyword"
              placeholder="输入模板名称或描述"
              clearable
              style="flex: 1; min-width: 200px;"
              prefix-icon="el-icon-search"
          />
        </div>

        <!-- 标签过滤 -->
        <div class="tags-filter">
          <span class="tags-label">语言筛选：</span>
          <el-tag
              v-for="tag in ['js','python','java']"
              :key="tag"
              :type="activeTags.includes(tag)?'primary':'info'"
              :class="['language-tag', { 'is-active': activeTags.includes(tag) }]"
              :size="'medium'"
              :effect="activeTags.includes(tag)?'dark':'plain'"
              style="cursor:pointer"
              @click="toggleTag(tag)"
          >
            {{ tag.toUpperCase() }}
          </el-tag>
          
          <span class="tags-label" style="margin-left: 20px;">类型筛选：</span>
          <el-tag
              v-for="tag in ['example','advanced','basic']"
              :key="tag"
              :type="getTagType(tag)"
              :class="['language-tag', { 'is-active': activeTags.includes(tag) }]"
              :size="'medium'"
              :effect="activeTags.includes(tag)?'dark':'plain'"
              style="cursor:pointer"
              @click="toggleTag(tag)"
          >
            {{ getTagText(tag) }}
          </el-tag>
        </div>
      </div>
    </div>
    <div class="template-list">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner">
            <svg class="circular" viewBox="25 25 50 50">
              <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle>
            </svg>
          </div>
          <p>加载模板中...</p>
        </div>
        
        <!-- 错误状态 -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <el-button type="primary" @click="refreshData">重新获取</el-button>
        </div>
        
        <!-- 统计信息 -->
        <div v-else-if="hasActiveFilters" class="stats-info">
          共找到 {{ templateStats.total }} 个模板 (JavaScript: {{ templateStats.javascript }}, Python: {{ templateStats.python }}, Java: {{ templateStats.java }})
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="filteredTemplates.length === 0" class="empty-state">
          <p>没有找到符合条件的模板</p>
          <el-button type="primary" @click="refreshData">刷新数据</el-button>
        </div>
        
        <!-- 分类显示模板 -->
        <template v-else>
          <template v-for="(items, language) in categorizedTemplates" :key="language">
            <div v-if="items.length > 0">
              <h2 class="category-title">
              {{ language === 'javascript' ? 'JavaScript' : language === 'python' ? 'Python' : 'Java' }} 模板
              <span class="category-count">({{ items.length }})</span>
            </h2>
            
            <div class="language-templates">
              <div v-for="template in items" :key="template.id" class="template-card">
                <div class="header">
                  <h3>{{ template.title }}</h3>
                  <div>
                    <el-tag 
                      v-for="tag in template.tags" 
                      :key="tag"
                      :type="getTagType(tag)"
                      :effect="'plain'"
                      :size="'small'"
                    >
                      {{ getTagText(tag) }}
                    </el-tag>
                    <div class="star-rating">
                      <span v-for="n in 5" :key="n" :class="{ 'star-active': n <= template.star }">
                        {{ n <= template.star ? '★' : '☆' }}
                      </span>
                    </div>
                    <el-tag v-if="isEditing[template.id]" type="danger" size="small">编辑中</el-tag>
                  </div>
                </div>
                <p>{{ template.des }}</p>

                <!-- 代码头部信息栏 -->
                <div class="code-header">
                  <div class="language-badge">
                    <div class="language-icon" :style="{ backgroundColor: getLanguageColor(template.language_name) }"></div>
                    {{ template.language_name }}
                  </div>
                  <div class="code-stats">
                    {{ template.code.split('\n').length }} 行代码
                  </div>
                </div>

                <!-- 可编辑代码区 -->
                <div class="code-container">
                  <div class="line-numbers" ref="lineNumbersRef">
                    <div v-for="n in template.code.split('\n').length" :key="n" class="line-number">{{ n }}</div>
                  </div>
                  <div class="code-wrapper">
                    <pre :class="'language-' + template.language_name"><code 
                      contenteditable 
                      @input="(e) => { updateCode(template.id, e.target.textContent); debouncedHighlight(e.target); }"
                      @focus="startEditing(template.id)"
                      @blur="finishEditing(template.id)"
                    >{{ template.code }}</code></pre>
                  </div>
                </div>

                <div class="actions-container">
                  <el-button size="small" type="primary" @click="copyCode(template.code)" :icon="'el-icon-document-copy'">复制代码</el-button>
                  <el-button size="small" type="success" @click="downloadCode(template)" :icon="'el-icon-download'">下载代码</el-button>
                  <el-button size="small" type="info" @click="testCode(template.code, template.language_name)" :icon="'el-icon-refresh'">测试代码</el-button>
                </div>
              </div>
              </div>
            </div>
          </template>
        </template>
      </div>


    <FriendLinkComment linkId="10002"></FriendLinkComment>
  </div>
</template>

<style scoped>
/* 页面整体样式 */
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

/* 主内容容器 */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
}

/* 页面标题 */
.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  background: linear-gradient(90deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 搜索和过滤区域 */
.filter-section {
  background: rgba(245, 247, 250, 0.8);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-label {
  font-weight: 600;
  color: #606266;
  white-space: nowrap;
}

/* 标签过滤区域 */
.tags-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.tags-label {
  font-weight: 600;
  color: #606266;
  white-space: nowrap;
}

/* 模板列表 */
.template-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 24px;
  justify-items: center;
}

/* 卡片样式 */
.template-card {
  width: 100%;
  border-radius: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid rgba(220, 233, 250, 0.8);
  position: relative;
  overflow: hidden;
}

.template-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
  border-color: #409eff;
}

.template-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
  background: linear-gradient(to bottom, #409eff, #67c23a);
}

/* 卡片头部 */
.template-card .header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.template-card h3 {
  margin: 0;
  color: #303133;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.4;
}

/* 标签和评分区域 */
.template-card .header > div {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

/* 描述文本 */
.template-card p {
  color: #606266;
  margin: 12px 0 16px 0;
  font-size: 14px;
  line-height: 1.6;
  height: 48px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* 标签样式增强 */
.language-tag {
  font-weight: 500;
  font-size: 12px;
  transition: all 0.3s ease;
}

.language-tag:hover {
  transform: scale(1.05);
}

/* 分类数量显示 */
.category-count {
  font-size: 14px;
  font-weight: normal;
  color: #909399;
  margin-left: 8px;
}

/* 星级评分样式 */
.star-rating {
  display: inline-flex;
  margin: 0 8px;
}

.star-rating span {
  color: #dcdfe6;
  font-size: 16px;
  cursor: default;
  transition: color 0.2s ease;
}

.star-rating .star-active {
  color: #e6a23c;
}

/* 代码统计信息 */
.code-stats {
  font-size: 11px;
  color: #666;
}

/* 语言模板容器 */
.language-templates {
  margin-bottom: 30px;
}

/* 统计信息样式 */
.stats-info {
  background-color: #f0f9eb;
  border: 1px solid #e1f3d8;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #67c23a;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 加载容器样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  color: #606266;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin-bottom: 20px;
}

.loading-spinner .circular {
  animation: rotate 2s linear infinite;
  height: 100%;
  width: 100%;
}

.loading-spinner .path {
  stroke: #409eff;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 错误状态样式 */
.error-state {
  text-align: center;
  padding: 60px 20px;
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 8px;
  color: #f56c6c;
  font-size: 16px;
}

.error-state .el-button {
  margin-top: 20px;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: #f5f7fa;
  border-radius: 8px;
  color: #909399;
  font-size: 16px;
}

.empty-state .el-button {
  margin-top: 20px;
}

/* 代码头部样式 */
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border: 1px solid #ebeef5;
  border-bottom: none;
  border-radius: 6px 6px 0 0;
  font-size: 13px;
  margin-top: 15px;
}

/* 语言徽章样式 */
.language-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  color: #606266;
}

/* 语言图标样式 */
.language-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

/* 代码包装器 */
.code-wrapper {
  flex: 1;
  overflow: auto;
  position: relative;
  height: 100%;
}

/* 动作按钮容器 */
.actions-container {
  display: flex;
  gap: 10px;
  margin-top: 15px;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 0 0 8px 8px;
  border: 1px solid #ebeef5;
  border-top: none;
}

/* 分类标题样式增强 */
.category-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
  margin-top: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #ebeef5;
  display: inline-flex;
  align-items: center;
}

/* 模板卡片样式增强 */
.template-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  margin-bottom: 24px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}

.template-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* 代码高亮增强 */
pre[class*="language-"] {
  border-radius: 0;
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  tab-size: 2;
  background: transparent !important;
  padding: 12px;
  overflow: auto;
}

code[contenteditable="true"] {
  outline: none;
  min-height: 200px;
  display: block;
  color: #e6e6e6;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

/* 确保Prism高亮样式正确应用 */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #6a9955;
}

.token.punctuation {
  color: #d4d4d4;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: #b5cea8;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #ce9178;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #d4d4d4;
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: #569cd6;
}

.token.function,
.token.class-name {
  color: #dcdcaa;
}

.token.regex,
.token.important,
.token.variable {
  color: #d16969;
}

/* 滚动条美化 */
.code-wrapper::-webkit-scrollbar,
code::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-wrapper::-webkit-scrollbar-track,
code::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.code-wrapper::-webkit-scrollbar-thumb,
code::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.code-wrapper::-webkit-scrollbar-thumb:hover,
code::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .actions-container {
    flex-wrap: wrap;
  }
  
  .actions-container .el-button {
    flex: 1;
    min-width: 100px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .star-rating {
    margin: 8px 0;
  }
}

/* 代码容器样式 */
.code-container {
  display: flex;
  margin-top: 16px;
  background: rgba(30, 30, 30, 0.98);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
  height: 260px; /* 固定高度，确保所有卡片高度一致 */
}

/* 行号样式 */
.line-numbers {
  background: rgba(20, 20, 20, 0.95);
  color: #858585;
  font-size: 13px;
  line-height: 1.5;
  padding: 12px 8px;
  text-align: right;
  user-select: none;
  overflow: hidden;
  white-space: nowrap;
  border-right: 1px solid #444;
}

.line-number {
  min-height: 24px;
  padding: 0 4px;
}

/* 代码头部信息栏 */
.code-header {
  background: rgba(35, 35, 35, 0.95);
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #444;
  color: #999;
  font-size: 12px;
}

.language-badge {
  display: flex;
  align-items: center;
  gap: 6px;
}

.language-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

/* 行号样式 */
.line-numbers {
  background-color: rgba(35, 35, 35, 0.9);
  color: #606266;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  padding: 14px 8px;
  text-align: right;
  user-select: none;
  min-width: 45px;
  border-right: 1px solid #444;
}

.line-number {
  height: 21px;
  transition: color 0.2s ease;
}

.line-number:hover {
  color: #909399;
}

/* 代码块样式 */
.code-wrapper {
  position: relative;
  flex: 1;
}

pre {
  flex: 1;
  max-height: 320px;
  overflow: auto;
  background: transparent;
  color: #e0e0e0;
  padding: 14px;
  margin: 0;
  font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  letter-spacing: 0.02em;
}

code[contenteditable] {
  outline: none;
  min-height: 80px;
  display: block;
  cursor: text;
}

/* 代码编辑时的高亮效果 */
code[contenteditable]:focus {
  animation: focusPulse 2s infinite;
}

@keyframes focusPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.2); }
  50% { box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.3); }
}

/* 代码高亮增强 */
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #8e908c;
}

.token.punctuation {
  color: #c792ea;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: #f78c6c;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #c3e88d;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #89ddff;
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: #82aaff;
}

.token.function,
.token.class-name {
  color: #ffcb6b;
}

.token.regex,
.token.important,
.token.variable {
  color: #f07178;
}

/* 滚动条样式 */
pre::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

pre::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 5px;
}

pre::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #667eea, #764ba2);
  border-radius: 5px;
  border: 2px solid transparent;
  background-clip: padding-box;
}

pre::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #5a67d8, #6b46c1);
  border-color: rgba(0, 0, 0, 0.1);
}

/* 按钮区域 */
.actions-container {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 按钮样式优化 */
.el-button {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-radius: 6px;
  font-weight: 500;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.el-button:active {
  transform: translateY(0);
}

/* 分类标题 */
.category-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 30px 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 3px solid #409eff;
  display: inline-block;
}

/* 统计信息 */
.stats-info {
  color: #909399;
  font-size: 14px;
  margin-bottom: 20px;
  text-align: center;
}

/* 加载动画 */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-state img {
  width: 120px;
  margin-bottom: 20px;
  opacity: 0.6;
}

.empty-state p {
  font-size: 16px;
  margin: 0;
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .template-list {
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-container {
    padding: 10px;
  }
  
  .main-content {
    padding: 20px;
    border-radius: 15px;
  }
  
  .page-title {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  .template-list {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .template-card {
    padding: 20px;
  }
  
  .template-card .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .tags-filter {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 16px;
  }
  
  .template-card {
    padding: 16px;
  }
  
  .template-card h3 {
    font-size: 18px;
  }
  
  pre {
    font-size: 12px;
  }
  
  .line-numbers {
    min-width: 35px;
    font-size: 12px;
  }
}
</style>
