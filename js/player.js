// 播放器类，封装音频播放功能
class MusicPlayer {
  constructor(config = {}) {
    // 初始化播放器状态
    this.isPlaying = false;
    this.currentSong = null;
    this.volume = 0.7; // 默认音量
    this.audio = new Audio();

    // 保存配置和回调
    this.config = config;

    // 设置音频事件监听
    this.setupAudioEvents();

    // 初始化播放器UI控制（不要在此绑定播放、上一首、下一首按钮，由外部控制）
    this.initPlayerControls();
  }

  // 设置音频事件监听
  setupAudioEvents() {
    this.audio.addEventListener("timeupdate", this.updateProgress.bind(this));
    this.audio.addEventListener("ended", () => {
      this.songEnded();
      // 调用onSongEnd回调
      if (
        this.config.onSongEnd &&
        typeof this.config.onSongEnd === "function"
      ) {
        this.config.onSongEnd();
      }
    });
    this.audio.addEventListener("canplay", () => {
      document.querySelector(".track-info h4").classList.remove("loading");
    });

    // 监听播放状态变化
    this.audio.addEventListener("play", () => {
      this.isPlaying = true;
      document.querySelector(
        ".player-controls .control-btn:nth-child(2)"
      ).textContent = "⏸";
    });

    this.audio.addEventListener("pause", () => {
      this.isPlaying = false;
      document.querySelector(
        ".player-controls .control-btn:nth-child(2)"
      ).textContent = "▶";
    });

    // 设置音量
    this.audio.volume = this.volume;
  }

  // 初始化播放器UI控制
  initPlayerControls() {
    const progressBar = document.querySelector(".progress-bar");

    // 进度条点击
    progressBar.addEventListener("click", (e) => {
      if (this.currentSong) {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        this.audio.currentTime = (clickX / width) * duration;
      }
    });
  }

  // 加载歌曲
  loadSong(songData) {
    this.currentSong = songData;
    this.audio.src = songData.url || "#"; // 实际项目中使用真实URL

    // 更新UI
    document.querySelector(".track-info h4").textContent = songData.title;
    document.querySelector(".track-info h4").classList.add("loading");
    document.querySelector(
      ".track-info p"
    ).textContent = `${songData.artist} - ${songData.album}`;

    // 如果有封面图片，则更新封面
    if (songData.cover) {
      document.querySelector(
        ".album-art"
      ).style.backgroundImage = `url(${songData.cover})`;
    }

    // 重置进度条
    document.querySelector(".progress").style.width = "0%";
    document.querySelector(".time-info span:first-child").textContent = "0:00";
    document.querySelector(".time-info span:last-child").textContent =
      this.formatTime(songData.duration || 0);

    // 自动播放
    this.play();
  }

  // 播放
  play() {
    if (this.currentSong) {
      try {
        // 为防止浏览器策略阻止自动播放，使用Promise捕获可能的错误
        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              this.isPlaying = true;
              document.querySelector(
                ".player-controls .control-btn:nth-child(2)"
              ).textContent = "⏸";
            })
            .catch((error) => {
              console.error("播放失败:", error);
              this.isPlaying = false;
              document.querySelector(
                ".player-controls .control-btn:nth-child(2)"
              ).textContent = "▶";
            });
        }
      } catch (error) {
        console.error("播放出错:", error);
      }
    }
  }

  // 暂停
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    document.querySelector(
      ".player-controls .control-btn:nth-child(2)"
    ).textContent = "▶";
  }

  // 切换播放/暂停
  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  // 更新进度条
  updateProgress() {
    const currentTime = this.audio.currentTime;
    const duration = this.audio.duration;

    if (duration) {
      // 更新进度条宽度
      const progressPercent = (currentTime / duration) * 100;
      document.querySelector(".progress").style.width = `${progressPercent}%`;

      // 更新当前时间显示
      document.querySelector(".time-info span:first-child").textContent =
        this.formatTime(currentTime);
    }
  }

  // 歌曲播放结束处理
  songEnded() {
    document.querySelector(".progress").style.width = "0%";
    document.querySelector(".time-info span:first-child").textContent = "0:00";
    this.isPlaying = false;
    document.querySelector(
      ".player-controls .control-btn:nth-child(2)"
    ).textContent = "▶";
  }

  // 格式化时间（秒转换为 mm:ss 格式）
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
}

// 导出播放器类
export default MusicPlayer;
