<template>
  <div style="height: 15vh"></div>
  <div class="container">
    <el-card class="wrapper animate__animated animate__fadeInUp">
      <h2 class="title">💾 软件 & SDK 工具下载中心</h2>

      <!-- 搜索框 -->
      <div class="search-box">
        <el-input
            placeholder="输入软件名搜索..."
            v-model="option.searchKey"
            @keyup.enter="getToolList"
            clearable
            prefix-icon="el-icon-search"
        />
      </div>

      <!-- 软件卡片 -->
      <el-row :gutter="24" v-loading="option.loading">
        <el-col
            v-for="(item, index) in option.data"
            :key="index"
            :md="8"
        >
          <div class="card animate__animated animate__fadeIn" @click="showVersion(item, 'win')">
            <el-image
                :src="item.icon"
                fit="cover"
                class="card-icon"
            />
            <h3>{{ item.name }}</h3>
            <p class="desc">{{ item.desc }}</p>
            <div class="card-footer">
              <div class="btn-group">
                <el-button size="small" type="primary" @click.stop="showVersion(item, 'win')">💌 Windows</el-button>
                <el-button size="small" type="success" @click.stop="showVersion(item, 'mac')">🍎 macOS</el-button>
                <el-button size="small" type="warning" @click.stop="showVersion(item, 'linux')">🐧 Linux</el-button>
              </div>
              <span class="status">📥 {{ item.downloadCount }} 次下载</span>
            </div>
          </div>
        </el-col>

        <!-- 无数据 -->
        <el-col v-if="!option.loading && option.data.length === 0" :span="24">
          <div class="empty-box">
            <el-empty description="暂无可下载的软件"></el-empty>
          </div>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <el-pagination
          background
          layout="prev, pager, next"
          :total="option.pages.total"
          :page-size="option.pages.pageSize"
          v-model:current-page="option.pages.currentPage"
          class="pagination"
          @change="getToolList"
      />
    </el-card>

    <!-- 版本弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="480px">
      <p class="version-tip">请选择要下载的版本：</p>
      <el-timeline>
        <el-timeline-item
            v-for="(ver, i) in dialog.versions"
            :key="i"
            :timestamp="ver.version"
        >
          <div class="version-item">
            <div class="version-info">
              <strong>{{ ver.name }}</strong>
              <p class="version-desc">{{ ver.desc }}</p>
              <p class="version-meta">📦 {{ ver.size }} ｜ 🕒 {{ ver.updateTime }}</p>
            </div>
            <div class="version-btns">
              <el-button type="primary" size="small" @click="downloadVersion(ver, dialog.software)">下载</el-button>
              <el-button type="info" size="small" @click="copyUrl(ver.url)">复制链接</el-button>
            </div>
          </div>
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
    <FriendLinkComment linkId="10001"></FriendLinkComment>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import FriendLinkComment from "@/components/FriendLinkComment.vue";

// 列表配置
const option = ref({
  searchKey: '',
  loading: false,
  data: [],
  pages: {
    pageSize: 8,
    currentPage: 1,
    total: 0,
  },
})
// 软件工具数据
const allTools = [
  {
    name: 'JetBrains IDEA',
    desc: '强大的 Java IDE，支持 Maven / Spring / Kotlin。',
    icon: 'https://img.icons8.com/color/96/intellij-idea.png',
    downloadCount: 1523,
    versions: {
      win: [
        { name: '官方版', version: '2024.2', desc: 'JetBrains 官方版本', size: '1.2 GB', updateTime: '2025-09-12', url: 'https://download.jetbrains.com/idea/ideaIU-2024.2.exe' },
        { name: '社区版', version: '2024.2', desc: '免费开源版本', size: '0.9 GB', updateTime: '2025-08-10', url: 'https://download.jetbrains.com/idea/ideaIC-2024.2.exe' },
        { name: '草莓编译版', version: '2024.2', desc: '第三方优化构建，适合低配机器', size: '0.95 GB', updateTime: '2025-09-20', url: 'https://mirror.example.com/ideaIU-2024.2-strawberry.exe' },
      ],
      mac: [
        { name: '官方版', version: '2024.2', desc: 'macOS Intel/ARM 通用', size: '1.3 GB', updateTime: '2025-09-12', url: 'https://download.jetbrains.com/idea/ideaIU-2024.2.dmg' },
        { name: '草莓编译版', version: '2024.2', desc: '第三方优化构建', size: '1.1 GB', updateTime: '2025-09-20', url: 'https://mirror.example.com/ideaIU-2024.2-mac-strawberry.dmg' },
      ],
      linux: [
        { name: '官方版', version: '2024.2', desc: 'Linux 平台压缩包', size: '1.4 GB', updateTime: '2025-09-12', url: 'https://download.jetbrains.com/idea/ideaIU-2024.2.tar.gz' },
        { name: '草莓编译版', version: '2024.2', desc: '轻量版 IDEA 优化构建', size: '1.0 GB', updateTime: '2025-09-22', url: 'https://mirror.example.com/ideaIU-2024.2-linux-strawberry.tar.gz' },
      ],
    },
  },
  {
    name: 'MySQL 8.0',
    desc: '主流关系型数据库系统。',
    icon: 'https://img.icons8.com/color/96/mysql-logo.png',
    downloadCount: 2380,
    versions: {
      win: [
        { name: '官方安装器', version: '8.0.37', desc: '推荐安装版', size: '500 MB', updateTime: '2025-08-15', url: 'https://dev.mysql.com/get/mysql-installer-web-community-8.0.37.0.msi' },
        { name: '草莓编译版', version: '8.0.37', desc: '内置免安装版', size: '420 MB', updateTime: '2025-09-01', url: 'https://mirror.example.com/mysql-8.0.37-strawberry.zip' },
      ],
      mac: [
        { name: 'DMG 安装包', version: '8.0.37', desc: 'macOS ARM/Intel', size: '480 MB', updateTime: '2025-08-15', url: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.37-macos13-arm64.dmg' },
      ],
      linux: [
        { name: '通用包', version: '8.0.37', desc: 'Linux 通用安装包', size: '460 MB', updateTime: '2025-08-15', url: 'https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.37-linux-glibc2.17-x86_64-minimal.tar.xz' },
      ],
    },
  },
  {
    name: 'Redis',
    desc: '高性能的 Key-Value 缓存数据库。',
    icon: 'https://img.icons8.com/color/96/redis.png',
    downloadCount: 1750,
    versions: {
      win: [
        { name: '微软编译版', version: '3.2.100', desc: 'Windows 官方移植', size: '12 MB', updateTime: '2025-07-28', url: 'https://github.com/microsoftarchive/redis/releases/download/win-3.2.100/redis-3.2.100.zip' },
        { name: '草莓编译版', version: '3.2.100', desc: '优化运行性能版', size: '10 MB', updateTime: '2025-09-02', url: 'https://mirror.example.com/redis-3.2.100-strawberry.zip' },
      ],
      mac: [
        { name: '源码包', version: '7.2.5', desc: 'mac/Linux 通用', size: '5 MB', updateTime: '2025-08-01', url: 'https://github.com/redis/redis/archive/7.2.5.tar.gz' },
      ],
      linux: [
        { name: '源码编译版', version: '7.2.5', desc: '推荐自行编译', size: '5 MB', updateTime: '2025-08-01', url: 'https://github.com/redis/redis/archive/7.2.5.tar.gz' },
      ],
    },
  },
  // 新增 SDK 工具
  {
    name: 'Node.js',
    desc: 'JavaScript 运行时，支持后端开发。',
    icon: 'https://img.icons8.com/color/96/nodejs.png',
    downloadCount: 2200,
    versions: {
      win: [
        { name: '官方 LTS', version: '20.1.0', desc: '长期支持版本', size: '35 MB', updateTime: '2025-08-10', url: 'https://nodejs.org/dist/v20.1.0/node-v20.1.0-x64.msi' },
        { name: '草莓编译版', version: '20.1.0', desc: '优化构建，快速启动', size: '33 MB', updateTime: '2025-09-05', url: 'https://mirror.example.com/node-v20.1.0-win-strawberry.msi' },
      ],
      mac: [
        { name: '官方 pkg', version: '20.1.0', desc: 'macOS 官方安装', size: '36 MB', updateTime: '2025-08-10', url: 'https://nodejs.org/dist/v20.1.0/node-v20.1.0.pkg' },
        { name: '草莓编译版', version: '20.1.0', desc: '优化版', size: '34 MB', updateTime: '2025-09-05', url: 'https://mirror.example.com/node-v20.1.0-mac-strawberry.pkg' },
      ],
      linux: [
        { name: '官方 tar.gz', version: '20.1.0', desc: 'Linux 官方二进制', size: '32 MB', updateTime: '2025-08-10', url: 'https://nodejs.org/dist/v20.1.0/node-v20.1.0-linux-x64.tar.gz' },
        { name: '草莓编译版', version: '20.1.0', desc: '轻量版', size: '30 MB', updateTime: '2025-09-05', url: 'https://mirror.example.com/node-v20.1.0-linux-strawberry.tar.gz' },
      ],
    },
  },
  {
    name: 'Java JDK',
    desc: 'Java 开发工具包，支持 Java 应用开发。',
    icon: 'https://img.icons8.com/color/96/java-coffee-cup-logo.png',
    downloadCount: 1800,
    versions: {
      win: [
        { name: '官方版', version: '21', desc: 'Oracle 官方版', size: '190 MB', updateTime: '2025-09-01', url: 'https://download.oracle.com/java/21/latest/jdk-21_windows-x64_bin.exe' },
        { name: '草莓编译版', version: '21', desc: '轻量优化版', size: '180 MB', updateTime: '2025-09-15', url: 'https://mirror.example.com/jdk-21-win-strawberry.exe' },
      ],
      mac: [
        { name: '官方 dmg', version: '21', desc: 'macOS 官方安装', size: '200 MB', updateTime: '2025-09-01', url: 'https://download.oracle.com/java/21/latest/jdk-21_macos-x64_bin.dmg' },
        { name: '草莓编译版', version: '21', desc: '轻量优化版', size: '190 MB', updateTime: '2025-09-15', url: 'https://mirror.example.com/jdk-21-mac-strawberry.dmg' },
      ],
      linux: [
        { name: '官方 tar.gz', version: '21', desc: 'Linux 官方二进制', size: '185 MB', updateTime: '2025-09-01', url: 'https://download.oracle.com/java/21/latest/jdk-21_linux-x64_bin.tar.gz' },
        { name: '草莓编译版', version: '21', desc: '轻量优化版', size: '175 MB', updateTime: '2025-09-15', url: 'https://mirror.example.com/jdk-21-linux-strawberry.tar.gz' },
      ],
    },
  },
  {
    name: 'Python 3.12',
    desc: '高级编程语言，适合快速开发。',
    icon: 'https://img.icons8.com/color/96/python.png',
    downloadCount: 2100,
    versions: {
      win: [
        { name: '官方版', version: '3.12.0', desc: 'Windows 官方安装包', size: '30 MB', updateTime: '2025-08-20', url: 'https://www.python.org/ftp/python/3.12.0/python-3.12.0-amd64.exe' },
        { name: '草莓编译版', version: '3.12.0', desc: '优化版', size: '28 MB', updateTime: '2025-09-10', url: 'https://mirror.example.com/python-3.12.0-win-strawberry.exe' },
      ],
      mac: [
        { name: '官方 pkg', version: '3.12.0', desc: 'macOS 官方安装', size: '32 MB', updateTime: '2025-08-20', url: 'https://www.python.org/ftp/python/3.12.0/python-3.12.0-macosx10.9.pkg' },
      ],
      linux: [
        { name: '源码包', version: '3.12.0', desc: 'Linux 自行编译', size: '30 MB', updateTime: '2025-08-20', url: 'https://www.python.org/ftp/python/3.12.0/Python-3.12.0.tgz' },
      ],
    },
  },
  {
    name: 'Android SDK',
    desc: 'Android 开发工具包。',
    icon: 'https://img.icons8.com/color/96/android-studio.png',
    downloadCount: 1400,
    versions: {
      win: [
        { name: '官方版', version: '2025.1', desc: 'Android Studio 官方版', size: '1.1 GB', updateTime: '2025-07-15', url: 'https://dl.google.com/android/studio/install/2025.1.0/windows/android-studio-2025.1.0.exe' },
        { name: '草莓编译版', version: '2025.1', desc: '优化轻量版', size: '1.0 GB', updateTime: '2025-09-05', url: 'https://mirror.example.com/android-studio-2025.1-win-strawberry.exe' },
      ],
      mac: [
        { name: '官方 dmg', version: '2025.1', desc: 'macOS 官方安装', size: '1.2 GB', updateTime: '2025-07-15', url: 'https://dl.google.com/android/studio/install/2025.1.0/macos/android-studio-2025.1.0.dmg' },
      ],
      linux: [
        { name: '官方 tar.gz', version: '2025.1', desc: 'Linux 官方压缩包', size: '1.1 GB', updateTime: '2025-07-15', url: 'https://dl.google.com/android/studio/install/2025.1.0/linux/android-studio-2025.1.0.tar.gz' },
      ],
    },
  },
  {
    name: 'Git',
    desc: '分布式版本控制工具。',
    icon: 'https://img.icons8.com/color/96/git.png',
    downloadCount: 2000,
    versions: {
      win: [
        { name: '官方安装器', version: '2.42.0', desc: 'Windows 官方版', size: '45 MB', updateTime: '2025-08-10', url: 'https://github.com/git-for-windows/git/releases/download/v2.42.0.windows.1/Git-2.42.0-64-bit.exe' },
        { name: '草莓编译版', version: '2.42.0', desc: '轻量优化版', size: '42 MB', updateTime: '2025-09-05', url: 'https://mirror.example.com/git-2.42.0-win-strawberry.exe' },
      ],
      mac: [
        { name: '官方 dmg', version: '2.42.0', desc: 'macOS 官方版', size: '47 MB', updateTime: '2025-08-10', url: 'https://sourceforge.net/projects/git-osx-installer/files/git-2.42.0-intel-universal-mavericks.dmg/download' },
      ],
      linux: [
        { name: '源码包', version: '2.42.0', desc: 'Linux 自行编译', size: '40 MB', updateTime: '2025-08-10', url: 'https://mirrors.edge.kernel.org/pub/software/scm/git/git-2.42.0.tar.gz' },
      ],
    },
  },
]


const dialog = ref({
  visible: false,
  title: '',
  software: null,
  versions: [],
})

// 弹窗
const showVersion = (item, platform) => {
  dialog.value.title = `${item.name} (${platform.toUpperCase()})`
  dialog.value.software = item
  dialog.value.versions = item.versions[platform] || []
  dialog.value.visible = true
}

// 复制下载链接
const copyUrl = async (url) => {
  await navigator.clipboard.writeText(url)
  ElMessage.success('✅ 下载链接已复制')
}

// 下载文件并统计次数
const downloadVersion = (ver, item) => {
  item.downloadCount++
  window.open(ver.url, '_blank')
  ElMessage.success(`正在下载：${ver.name}`)
  dialog.value.visible = false
}

// 搜索过滤 + 分页
const getToolList = () => {
  option.value.loading = true
  setTimeout(() => {
    const search = option.value.searchKey.trim().toLowerCase()
    let filtered = allTools.filter((tool) =>
        tool.name.toLowerCase().includes(search)
    )
    option.value.pages.total = filtered.length
    const start = (option.value.pages.currentPage - 1) * option.value.pages.pageSize
    option.value.data = filtered.slice(start, start + option.value.pages.pageSize)
    option.value.loading = false
  }, 400)
}

onMounted(() => {
  getToolList()
})
</script>

<style scoped>
.container { max-width: 1400px; margin: 0 auto; opacity: 0.95; }
.wrapper { margin-bottom: 20px; border-radius: 15px; padding: 20px; backdrop-filter: blur(10px); box-shadow: 0 5px 20px rgba(0,0,0,0.1); }
.title { text-align: center; margin: 30px auto; font-size: 26px; font-weight: bold; color: #ff6b6b; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
.search-box { width: 50%; margin: 20px auto; }
.card { display: flex; flex-direction: column; align-items: center; padding: 20px; background: linear-gradient(135deg, #ffffff, #f9f9f9); border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); cursor: pointer; border: 2px solid #e0e0e0; transition: all 0.3s ease; text-align: center; }
.card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); border-color: #ff6b6b; }
.card-icon { width: 60px; height: 60px; border-radius: 12px; margin-bottom: 10px; }
.desc { margin: 8px 0; color: #666; font-size: 14px; }
.card-footer { margin-top: 10px; width: 100%; display: flex; flex-direction: column; align-items: center; }
.btn-group { display: flex; justify-content: center; gap: 8px; margin-bottom: 8px; }
.status { font-size: 12px; color: #999; }
.empty-box { text-align: center; padding: 40px; color: #999; }
.pagination { margin: 20px 0; text-align: center; }
.version-tip { margin-bottom: 10px; color: #666; }
.version-item { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
.version-info { flex: 1; }
.version-desc, .version-meta { font-size: 12px; color: #999; margin: 2px 0; }
.version-btns { display: flex; flex-direction: column; gap: 6px; }
</style>