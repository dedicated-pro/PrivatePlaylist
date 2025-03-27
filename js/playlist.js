// 歌单管理类
class PlaylistManager {
  constructor() {
    this.playlists = {};
    this.currentPlaylist = null;

    // 初始化dom元素引用
    this.playlistContainer = document.querySelector(".playlist-list");
    this.songContainer = document.querySelector(".song-container");
    this.songHeader = document.querySelector(".song-header h3");
    this.songTable = document.querySelector(".song-table tbody");

    // 绑定UI事件
    this.bindEvents();

    // 加载默认歌单
    this.loadDefaultPlaylists();
  }

  // 绑定UI事件
  bindEvents() {
    // 歌单点击事件
    this.playlistContainer.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        this.selectPlaylist(e.target.textContent);

        // 移除其他项的active类
        const items = this.playlistContainer.querySelectorAll("li");
        items.forEach((item) => item.classList.remove("active"));

        // 添加active类到当前点击项
        e.target.classList.add("active");
      }
    });

    // 添加歌曲按钮点击事件
    document
      .querySelector(".song-actions button:first-child")
      .addEventListener("click", () => {
        this.showAddSongDialog();
      });

    // 智能推荐按钮事件
    document
      .querySelector(".song-actions button:last-child")
      .addEventListener("click", () => {
        this.generateRecommendations();
      });
  }

  // 加载默认歌单数据
  loadDefaultPlaylists() {
    // 模拟数据，实际项目中应从本地存储或服务器获取
    this.playlists = {
      最爱收藏: [
        {
          id: 1,
          title: "春风十里",
          artist: "鹿先森乐队",
          album: "所有的酒，都不如你",
          duration: 328,
        },
        {
          id: 2,
          title: "莫斯科没有眼泪",
          artist: "李健",
          album: "似水流年",
          duration: 276,
        },
        {
          id: 3,
          title: "消愁",
          artist: "毛不易",
          album: "平凡的一天",
          duration: 249,
        },
        {
          id: 4,
          title: "芒种",
          artist: "音阙诗听/赵方婧",
          album: "芒种",
          duration: 216,
        },
        {
          id: 5,
          title: "起风了",
          artist: "买辣椒也用券",
          album: "起风了",
          duration: 311,
        },
      ],
      流行热歌: [
        {
          id: 6,
          title: "句号",
          artist: "邓紫棋",
          album: "句号",
          duration: 235,
        },
        {
          id: 7,
          title: "光年之外",
          artist: "邓紫棋",
          album: "光年之外",
          duration: 285,
        },
        {
          id: 8,
          title: "说爱你",
          artist: "蔡依林",
          album: "看我72变",
          duration: 257,
        },
      ],
      轻音乐: [
        {
          id: 9,
          title: "River Flows In You",
          artist: "Yiruma",
          album: "First Love",
          duration: 185,
        },
        {
          id: 10,
          title: "Kiss The Rain",
          artist: "Yiruma",
          album: "From The Yellow Room",
          duration: 311,
        },
      ],
      运动动力: [
        {
          id: 11,
          title: "Eye Of The Tiger",
          artist: "Survivor",
          album: "Eye Of The Tiger",
          duration: 246,
        },
        {
          id: 12,
          title: "倒数",
          artist: "邓紫棋",
          album: "倒数",
          duration: 209,
        },
      ],
      工作专注: [
        {
          id: 13,
          title: "Intro",
          artist: "The xx",
          album: "xx",
          duration: 127,
        },
        {
          id: 14,
          title: "Experience",
          artist: "Ludovico Einaudi",
          album: "In A Time Lapse",
          duration: 321,
        },
      ],
      睡前放松: [
        {
          id: 15,
          title: "童话镇",
          artist: "陈一发儿",
          album: "童话镇",
          duration: 242,
        },
        {
          id: 16,
          title: "晚安",
          artist: "颜人中",
          album: "晚安",
          duration: 265,
        },
      ],
    };

    // 默认选择第一个歌单
    this.selectPlaylist("最爱收藏");
  }

  // 选择并展示歌单
  selectPlaylist(playlistName) {
    if (this.playlists[playlistName]) {
      this.currentPlaylist = playlistName;
      this.songHeader.textContent = playlistName;
      this.renderSongs(this.playlists[playlistName]);
    }
  }

  // 在表格中渲染歌曲
  renderSongs(songs) {
    // 清空现有内容
    this.songTable.innerHTML = "";

    // 添加歌曲行
    songs.forEach((song, index) => {
      const row = document.createElement("tr");
      row.dataset.songId = song.id;

      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${song.title}</td>
        <td>${song.artist}</td>
        <td>${song.album}</td>
        <td>${this.formatTime(song.duration)}</td>
        <td>♡</td>
      `;

      // 添加行点击事件
      row.addEventListener("click", () => {
        // 触发歌曲播放事件，实际项目中可使用自定义事件或回调
        if (window.onSongSelected) {
          window.onSongSelected(song);
        }
      });

      this.songTable.appendChild(row);
    });
  }

  // 添加歌曲到当前歌单
  addSong(song) {
    if (this.currentPlaylist) {
      // 生成新ID
      const newId =
        Math.max(...this.playlists[this.currentPlaylist].map((s) => s.id), 0) +
        1;
      song.id = newId;

      // 添加到当前歌单
      this.playlists[this.currentPlaylist].push(song);

      // 重新渲染
      this.renderSongs(this.playlists[this.currentPlaylist]);

      // 实际项目中应保存到本地存储或服务器
      this.saveToLocalStorage();
    }
  }

  // 从当前歌单移除歌曲
  removeSong(songId) {
    if (this.currentPlaylist) {
      this.playlists[this.currentPlaylist] = this.playlists[
        this.currentPlaylist
      ].filter((song) => song.id !== songId);

      // 重新渲染
      this.renderSongs(this.playlists[this.currentPlaylist]);

      // 实际项目中应保存到本地存储或服务器
      this.saveToLocalStorage();
    }
  }

  // 创建新歌单
  createPlaylist(name) {
    if (!this.playlists[name]) {
      this.playlists[name] = [];

      // 添加到UI
      const item = document.createElement("li");
      item.textContent = name;
      this.playlistContainer.appendChild(item);

      // 保存
      this.saveToLocalStorage();

      return true;
    }
    return false; // 歌单已存在
  }

  // 保存到本地存储
  saveToLocalStorage() {
    // 实际项目中实现持久化存储
    console.log("保存歌单数据", this.playlists);
    try {
      localStorage.setItem("playlists", JSON.stringify(this.playlists));
    } catch (e) {
      console.error("保存歌单失败", e);
    }
  }

  // 显示添加歌曲对话框
  showAddSongDialog() {
    // 实际项目中实现文件选择与元数据提取
    alert("请选择要添加的音乐文件");

    // 模拟添加歌曲
    const mockSong = {
      title: "新添加的歌曲",
      artist: "未知艺术家",
      album: "未知专辑",
      duration: 240,
    };

    if (confirm("是否添加示例歌曲?")) {
      this.addSong(mockSong);
    }
  }

  // 生成智能推荐
  generateRecommendations() {
    alert("正在基于您的听歌喜好生成推荐...");
    // 实际项目中实现智能推荐算法
  }

  // 格式化时间（秒转换为 mm:ss 格式）
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }
}

// 导出歌单管理类
export default PlaylistManager;
