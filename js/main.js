// 页面加载完成后执行
document.addEventListener("DOMContentLoaded", function () {
  // 导入组件（注：在实际使用时，应使用构建工具如webpack来处理模块导入）
  // import PlaylistManager from './playlist.js';
  // import MusicPlayer from './player.js';

  // 由于直接导入在普通HTML中无法工作，这里使用模拟方式
  initApp();

  function initApp() {
    // 播放器相关变量
    const playButton = document.querySelector(
      ".player-controls .control-btn:nth-child(2)"
    );
    const prevButton = document.querySelector(
      ".player-controls .control-btn:nth-child(1)"
    );
    const nextButton = document.querySelector(
      ".player-controls .control-btn:nth-child(3)"
    );
    const progress = document.querySelector(".progress");
    const currentTimeEl = document.querySelector(".time-info span:first-child");
    const totalTimeEl = document.querySelector(".time-info span:last-child");

    // 播放状态
    let isPlaying = false;

    // 播放按钮点击事件
    playButton &&
      playButton.addEventListener("click", function () {
        if (isPlaying) {
          // 暂停音乐
          playButton.textContent = "▶";
          isPlaying = false;
        } else {
          // 播放音乐
          playButton.textContent = "⏸";
          isPlaying = true;
        }
      });

    // 歌单列表项点击事件
    const playlistItems = document.querySelectorAll(".playlist-list li");
    playlistItems.forEach((item) => {
      item.addEventListener("click", function () {
        // 移除其他项的active类
        playlistItems.forEach((i) => i.classList.remove("active"));
        // 给当前点击项添加active类
        this.classList.add("active");

        // 更新歌单标题
        const songHeader = document.querySelector(".song-header h3");
        if (songHeader) {
          songHeader.textContent = this.textContent;
        }
      });
    });

    // 进度条点击事件
    const progressBar = document.querySelector(".progress-bar");
    if (progressBar) {
      progressBar.addEventListener("click", function (e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const progressPercent = (clickX / width) * 100;

        // 更新进度条
        if (progress) {
          progress.style.width = `${progressPercent}%`;
        }

        // 更新实际音频位置（实际项目中需要与音频API结合）
      });
    }

    // 添加歌曲按钮点击事件
    document
      .querySelector(".song-actions button:first-child")
      .addEventListener("click", function () {
        alert("请选择要添加的音乐文件");
        // 这里可以添加文件选择逻辑
      });

    // 智能推荐按钮点击事件
    const recommendBtn = document.getElementById("recommend-btn");
    if (recommendBtn) {
      recommendBtn.addEventListener("click", function () {
        // 检查是否已经从module脚本中设置了处理函数
        if (typeof window.handleRecommendClick === "function") {
          window.handleRecommendClick();
          return;
        }

        // 默认处理
        alert("正在为您生成智能推荐列表...");
        // 实际项目中可以调用推荐算法API
      });
    }

    // 上传音乐按钮点击事件
    document.querySelector(".cta-btn").addEventListener("click", function (e) {
      e.preventDefault();
      alert("请选择要上传的音乐文件");
      // 这里可以添加文件上传逻辑
    });

    // 模拟歌曲表格行点击事件
    const songRows = document.querySelectorAll(".song-table tbody tr");
    songRows.forEach((row) => {
      row.addEventListener("click", function () {
        // 更新当前播放歌曲信息
        const songName = this.querySelector("td:nth-child(2)").textContent;
        const artistName = this.querySelector("td:nth-child(3)").textContent;
        const albumName = this.querySelector("td:nth-child(4)").textContent;
        const duration = this.querySelector("td:nth-child(5)").textContent;

        const trackInfoH4 = document.querySelector(".track-info h4");
        const trackInfoP = document.querySelector(".track-info p");

        if (trackInfoH4) {
          trackInfoH4.textContent = songName;
        }

        if (trackInfoP) {
          trackInfoP.textContent = `${artistName} - ${albumName}`;
        }

        if (totalTimeEl) {
          totalTimeEl.textContent = duration;
        }

        // 开始播放
        if (playButton) {
          playButton.textContent = "⏸";
          isPlaying = true;
        }

        // 重置进度条
        if (progress) {
          progress.style.width = "0%";
        }

        if (currentTimeEl) {
          currentTimeEl.textContent = "0:00";
        }
      });
    });

    // 在实际项目中，这里可以使用模块导入，例如：
    /*
    const playlistManager = new PlaylistManager();
    const player = new MusicPlayer();
    
    // 设置歌曲选择回调
    window.onSongSelected = (song) => {
      player.loadSong(song);
    };
    */
  }
});
