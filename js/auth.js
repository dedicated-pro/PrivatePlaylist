// 认证管理类
class AuthManager {
  constructor() {
    this.currentUser = null;
    this.users = [];

    // 绑定UI元素
    this.loginBtn = document.querySelector(".login-btn");

    // 初始化
    this.init();
  }

  // 初始化
  init() {
    // 从本地存储加载用户数据
    this.loadUsers();

    // 检查是否已登录
    this.checkLoggedIn();

    // 绑定事件
    this.bindEvents();
  }

  // 绑定事件
  bindEvents() {
    // 登录按钮点击事件
    if (this.loginBtn) {
      this.loginBtn.addEventListener("click", (e) => {
        e.preventDefault();

        if (this.currentUser) {
          // 已登录，显示用户菜单
          this.showUserMenu(e);
        } else {
          // 未登录，显示登录模态框
          this.showLoginModal();
        }
      });
    }

    // 监听登录表单提交
    document.addEventListener("submit", (e) => {
      if (e.target.id === "login-form") {
        e.preventDefault();
        this.handleLogin();
      } else if (e.target.id === "register-form") {
        e.preventDefault();
        this.handleRegister();
      }
    });

    // 切换注册/登录表单
    document.addEventListener("click", (e) => {
      if (e.target.id === "switch-to-register") {
        e.preventDefault();
        this.switchToRegister();
      } else if (e.target.id === "switch-to-login") {
        e.preventDefault();
        this.switchToLogin();
      } else if (e.target.id === "logout-btn") {
        e.preventDefault();
        this.logout();
      } else if (e.target.id === "close-modal") {
        e.preventDefault();
        this.closeAuthModal();
      }
    });
  }

  // 显示登录模态框
  showLoginModal() {
    // 创建模态框
    const modal = document.createElement("div");
    modal.className = "auth-modal";
    modal.id = "auth-modal";

    modal.innerHTML = `
      <div class="auth-container">
        <button id="close-modal" class="close-modal">&times;</button>
        
        <!-- 登录表单 -->
        <div id="login-container" class="auth-form-container active">
          <h2>用户登录</h2>
          <form id="login-form">
            <div class="form-group">
              <label for="login-username">用户名</label>
              <input type="text" id="login-username" name="username" required>
            </div>
            <div class="form-group">
              <label for="login-password">密码</label>
              <input type="password" id="login-password" name="password" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="auth-btn">登录</button>
            </div>
            <div class="form-footer">
              <p>还没有账号？<a href="#" id="switch-to-register">立即注册</a></p>
            </div>
          </form>
        </div>
        
        <!-- 注册表单 -->
        <div id="register-container" class="auth-form-container">
          <h2>用户注册</h2>
          <form id="register-form">
            <div class="form-group">
              <label for="register-username">用户名</label>
              <input type="text" id="register-username" name="username" required>
            </div>
            <div class="form-group">
              <label for="register-email">电子邮箱</label>
              <input type="email" id="register-email" name="email" required>
            </div>
            <div class="form-group">
              <label for="register-password">密码</label>
              <input type="password" id="register-password" name="password" required>
              <small>密码长度至少为8位，包含字母和数字</small>
            </div>
            <div class="form-group">
              <label for="register-confirm-password">确认密码</label>
              <input type="password" id="register-confirm-password" name="confirmPassword" required>
            </div>
            <div class="form-actions">
              <button type="submit" class="auth-btn">注册</button>
            </div>
            <div class="form-footer">
              <p>已有账号？<a href="#" id="switch-to-login">立即登录</a></p>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // 添加模态框动画效果
    setTimeout(() => {
      modal.classList.add("show");
    }, 50);
  }

  // 关闭认证模态框
  closeAuthModal() {
    const modal = document.getElementById("auth-modal");
    if (modal) {
      modal.classList.remove("show");

      // 动画结束后移除模态框
      setTimeout(() => {
        document.body.removeChild(modal);
      }, 300);
    }
  }

  // 切换到注册表单
  switchToRegister() {
    document.getElementById("login-container").classList.remove("active");
    document.getElementById("register-container").classList.add("active");
  }

  // 切换到登录表单
  switchToLogin() {
    document.getElementById("register-container").classList.remove("active");
    document.getElementById("login-container").classList.add("active");
  }

  // 处理登录
  handleLogin() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    // 验证用户
    const user = this.authenticateUser(username, password);

    if (user) {
      // 登录成功
      this.loginSuccess(user);
    } else {
      // 登录失败
      alert("用户名或密码错误！");
    }
  }

  // 处理注册
  handleRegister() {
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    const confirmPassword = document.getElementById(
      "register-confirm-password"
    ).value;

    // 基本验证
    if (password !== confirmPassword) {
      alert("两次输入的密码不一致！");
      return;
    }

    if (password.length < 8) {
      alert("密码长度至少为8位！");
      return;
    }

    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      alert("密码必须包含字母和数字！");
      return;
    }

    // 检查用户名是否已存在
    if (this.users.some((user) => user.username === username)) {
      alert("该用户名已被注册！");
      return;
    }

    // 检查邮箱是否已存在
    if (this.users.some((user) => user.email === email)) {
      alert("该邮箱已被注册！");
      return;
    }

    // 创建新用户
    const newUser = {
      id: Date.now(),
      username,
      email,
      password, // 注意：实际应用中应该对密码进行加密处理
      createdAt: new Date().toISOString(),
      playlists: [], // 用户歌单ID列表
    };

    // 添加到用户列表
    this.users.push(newUser);

    // 保存到本地存储
    this.saveUsers();

    // 自动登录
    this.loginSuccess(newUser);

    // 显示成功消息
    alert("注册成功！");
  }

  // 用户验证
  authenticateUser(username, password) {
    return this.users.find(
      (user) => user.username === username && user.password === password
    );
  }

  // 登录成功处理
  loginSuccess(user) {
    // 设置当前用户
    this.currentUser = user;

    // 保存到本地存储
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email,
      })
    );

    // 更新UI
    this.updateLoginUI();

    // 关闭模态框
    this.closeAuthModal();
  }

  // 退出登录
  logout() {
    // 清除当前用户
    this.currentUser = null;

    // 从本地存储中移除
    localStorage.removeItem("currentUser");

    // 更新UI
    this.updateLoginUI();

    // 关闭用户菜单（如果有的话）
    const userMenu = document.getElementById("user-menu");
    if (userMenu) {
      document.body.removeChild(userMenu);
    }
  }

  // 更新登录按钮UI
  updateLoginUI() {
    if (!this.loginBtn) return;

    if (this.currentUser) {
      // 已登录，显示用户名
      this.loginBtn.textContent = this.currentUser.username;
      this.loginBtn.classList.add("user-logged-in");
    } else {
      // 未登录，显示"登录"
      this.loginBtn.textContent = "登录";
      this.loginBtn.classList.remove("user-logged-in");
    }
  }

  // 显示用户菜单
  showUserMenu(event) {
    // 删除可能已存在的菜单
    const existingMenu = document.getElementById("user-menu");
    if (existingMenu) {
      document.body.removeChild(existingMenu);
      return;
    }

    // 创建用户菜单
    const menu = document.createElement("div");
    menu.id = "user-menu";
    menu.className = "user-menu";

    // 设置菜单位置
    const rect = event.target.getBoundingClientRect();
    menu.style.top = rect.bottom + "px";
    menu.style.right = window.innerWidth - rect.right + "px";

    // 菜单内容
    menu.innerHTML = `
      <ul>
        <li>欢迎，${this.currentUser.username}</li>
        <li><a href="#" id="my-account">我的账户</a></li>
        <li><a href="#" id="my-playlists">我的歌单</a></li>
        <li><a href="#" id="my-settings">设置</a></li>
        <li><a href="#" id="logout-btn">退出登录</a></li>
      </ul>
    `;

    document.body.appendChild(menu);

    // 添加点击外部关闭菜单
    setTimeout(() => {
      document.addEventListener("click", this.closeUserMenu);
    }, 100);
  }

  // 关闭用户菜单
  closeUserMenu = (event) => {
    const menu = document.getElementById("user-menu");
    if (!menu) return;

    // 如果点击事件不是发生在菜单内部，关闭菜单
    if (!menu.contains(event.target) && event.target.id !== "user-menu") {
      document.body.removeChild(menu);
      document.removeEventListener("click", this.closeUserMenu);
    }
  };

  // 检查是否已登录
  checkLoggedIn() {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      try {
        const userInfo = JSON.parse(savedUser);
        // 根据ID查找完整用户信息
        const user = this.users.find((u) => u.id === userInfo.id);
        if (user) {
          this.currentUser = user;
          this.updateLoginUI();
        }
      } catch (e) {
        console.error("解析用户信息失败", e);
        localStorage.removeItem("currentUser");
      }
    }
  }

  // 从本地存储加载用户数据
  loadUsers() {
    try {
      const savedUsers = localStorage.getItem("users");
      if (savedUsers) {
        this.users = JSON.parse(savedUsers);
      }
    } catch (e) {
      console.error("加载用户数据失败", e);
      this.users = [];
    }

    // 如果没有用户数据，添加一些测试用户
    if (this.users.length === 0) {
      this.users = [
        {
          id: 1,
          username: "demo",
          email: "demo@example.com",
          password: "password123", // 实际项目中应该加密
          createdAt: new Date().toISOString(),
          playlists: [],
        },
      ];
      this.saveUsers();
    }
  }

  // 保存用户数据到本地存储
  saveUsers() {
    try {
      localStorage.setItem("users", JSON.stringify(this.users));
    } catch (e) {
      console.error("保存用户数据失败", e);
    }
  }

  // 获取当前用户
  getCurrentUser() {
    return this.currentUser;
  }

  // 判断是否已登录
  isLoggedIn() {
    return !!this.currentUser;
  }
}

// 导出认证管理类
export default AuthManager;
