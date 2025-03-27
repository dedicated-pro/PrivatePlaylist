// 音乐上传和解析模块
class MusicUploader {
  constructor() {
    this.uploadedFiles = [];
    this.supportedFormats = ["mp3", "flac", "wav", "ogg", "m4a"];

    // 创建文件选择器
    this.fileInput = document.createElement("input");
    this.fileInput.type = "file";
    this.fileInput.multiple = true;
    this.fileInput.accept = ".mp3,.flac,.wav,.ogg,.m4a";
    this.fileInput.style.display = "none";

    // 绑定事件
    this.fileInput.addEventListener("change", this.handleFileSelect.bind(this));

    // 添加到DOM
    document.body.appendChild(this.fileInput);
  }

  // 显示文件选择对话框
  showFileSelector(callback) {
    this.uploadCallback = callback;
    this.fileInput.click();
  }

  // 处理文件选择
  async handleFileSelect(event) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      alert("未选择任何文件");
      return;
    }

    // 检查文件格式
    const validFiles = Array.from(files).filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return this.supportedFormats.includes(extension);
    });

    if (validFiles.length === 0) {
      alert(
        "没有选择有效的音乐文件，支持的格式：" +
          this.supportedFormats.join(", ")
      );
      return;
    }

    if (validFiles.length !== files.length) {
      alert(`已过滤掉 ${files.length - validFiles.length} 个不支持的文件格式`);
    }

    // 显示上传进度
    this.showUploadProgress(validFiles);

    try {
      // 解析音乐文件元数据
      const processedFiles = await this.processFiles(validFiles);

      // 调用回调函数
      if (typeof this.uploadCallback === "function") {
        this.uploadCallback(processedFiles);
      }

      // 重置文件输入
      this.fileInput.value = "";
    } catch (error) {
      console.error("处理音乐文件时出错", error);
      alert("上传过程中发生错误: " + error.message);
      this.fileInput.value = "";
    }
  }

  // 处理音乐文件，提取元数据
  async processFiles(files) {
    const processedFiles = [];
    const totalFiles = files.length;

    // 更新进度条状态文本
    const progressStatus = document.getElementById("upload-progress-status");
    if (progressStatus) {
      progressStatus.textContent = "正在解析音乐文件...";
    }

    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];

      try {
        // 模拟文件解析（实际项目中应使用如jsmediatags、music-metadata等库）
        const metadata = await this.extractMetadata(file);

        // 创建歌曲对象
        const song = {
          id: Date.now() + i, // 临时ID
          title: metadata.title || this.cleanFileName(file.name),
          artist: metadata.artist || "未知艺术家",
          album: metadata.album || "未知专辑",
          duration: metadata.duration || 0,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file), // 创建临时URL
          file: file, // 保存文件引用
          added: new Date().toISOString(),
        };

        processedFiles.push(song);

        // 更新进度条
        this.updateProgress(((i + 1) / totalFiles) * 100);
      } catch (error) {
        console.error(`处理文件 ${file.name} 时出错:`, error);

        // 即使发生错误，也添加基本信息
        processedFiles.push({
          id: Date.now() + i,
          title: this.cleanFileName(file.name),
          artist: "未知艺术家",
          album: "未知专辑",
          duration: 0,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          file: file,
          added: new Date().toISOString(),
          error: error.message,
        });
      }
    }

    // 完成处理
    setTimeout(() => {
      this.hideUploadProgress();
    }, 500);

    return processedFiles;
  }

  // 提取音乐文件元数据（模拟实现）
  async extractMetadata(file) {
    return new Promise((resolve) => {
      // 模拟异步操作
      setTimeout(() => {
        // 在实际项目中，应使用jsmediatags或music-metadata库进行解析

        // 从文件名提取基本信息
        const fileName = file.name.replace(/\.[^/.]+$/, "");
        let title = fileName;
        let artist = "未知艺术家";

        // 尝试从文件名解析艺术家和标题
        const parts = fileName.split("-").map((part) => part.trim());
        if (parts.length >= 2) {
          // 假设格式是 "艺术家 - 标题" 或 "标题 - 艺术家"
          if (parts.length === 2) {
            artist = parts[0];
            title = parts[1];
          } else if (parts.length === 3) {
            // 假设格式是 "标题 - 艺术家 - 专辑" 或 "艺术家 - 标题 - 专辑"
            artist = parts[1]; // 通常艺术家在中间
            title = parts[0];
          }
        }

        // 模拟时长（实际项目应从音频文件中提取）
        const duration = Math.floor(Math.random() * 300) + 120; // 2-7分钟

        resolve({
          title,
          artist,
          album: "本地上传",
          duration: duration,
          year: new Date().getFullYear(),
        });
      }, 500); // 模拟处理时间
    });
  }

  // 从文件名中提取歌曲标题（去除扩展名）
  cleanFileName(fileName) {
    return fileName.replace(/\.[^/.]+$/, "");
  }

  // 显示上传进度
  showUploadProgress(files) {
    // 如果已存在进度条，先移除
    this.hideUploadProgress();

    // 创建进度条容器
    const progressContainer = document.createElement("div");
    progressContainer.id = "upload-progress-container";
    progressContainer.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      padding: 20px;
      z-index: 9999;
    `;

    // 标题
    const title = document.createElement("h3");
    title.textContent = `正在上传 ${files.length} 个音乐文件`;
    title.style.margin = "0 0 15px 0";

    // 状态文本
    const status = document.createElement("p");
    status.id = "upload-progress-status";
    status.textContent = "准备中...";
    status.style.margin = "5px 0";
    status.style.fontSize = "14px";
    status.style.color = "#666";

    // 进度条背景
    const progressBg = document.createElement("div");
    progressBg.style.cssText = `
      width: 100%;
      height: 10px;
      background-color: #f0f0f0;
      border-radius: 5px;
      overflow: hidden;
      margin: 10px 0;
    `;

    // 进度条
    const progressBar = document.createElement("div");
    progressBar.id = "upload-progress-bar";
    progressBar.style.cssText = `
      width: 0%;
      height: 100%;
      background-color: #8E44AD;
      border-radius: 5px;
      transition: width 0.3s ease;
    `;

    progressBg.appendChild(progressBar);

    // 组装
    progressContainer.appendChild(title);
    progressContainer.appendChild(status);
    progressContainer.appendChild(progressBg);

    // 添加到DOM
    document.body.appendChild(progressContainer);
  }

  // 更新进度条
  updateProgress(percent) {
    const progressBar = document.getElementById("upload-progress-bar");
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
    }
  }

  // 隐藏上传进度
  hideUploadProgress() {
    const container = document.getElementById("upload-progress-container");
    if (container) {
      document.body.removeChild(container);
    }
  }
}

// 导出上传器类
export default MusicUploader;
