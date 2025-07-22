# 🚀 八大排序算法学习平台 - 部署指南

## 📋 部署状态

✅ **前端构建成功完成**
- 构建文件位于: `client/dist/`
- 总大小: ~673KB (压缩后 ~190KB)
- 构建时间: 2.10秒

## 🎯 推荐部署方案

### 方案一：Vercel + Render (推荐)

#### 前端部署到 Vercel

1. **准备代码仓库**
   ```bash
   # 确保代码已推送到 GitHub
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vercel 部署步骤**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 配置设置：
     - Framework Preset: `Vite`
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **环境变量配置**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

#### 后端部署到 Render

1. **Render 部署步骤**
   - 访问 [render.com](https://render.com)
   - 使用 GitHub 账号登录
   - 点击 "New Web Service"
   - 选择你的 GitHub 仓库
   - 配置设置：
     - Name: `sorting-algorithms-backend`
     - Root Directory: `server`
     - Runtime: `Node`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

2. **环境变量配置**
   ```
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   DATABASE_URL=./database.sqlite
   NODE_ENV=production
   ```

### 方案二：Netlify + Railway

#### 前端部署到 Netlify

1. **Netlify 部署步骤**
   - 访问 [netlify.com](https://netlify.com)
   - 使用 GitHub 账号登录
   - 点击 "New site from Git"
   - 选择你的 GitHub 仓库
   - 配置设置：
     - Base directory: `client`
     - Build command: `npm run build`
     - Publish directory: `dist`

2. **环境变量配置**
   ```
   VITE_API_URL=https://your-backend-url.railway.app
   ```

#### 后端部署到 Railway

1. **Railway 部署步骤**
   - 访问 [railway.app](https://railway.app)
   - 使用 GitHub 账号登录
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择你的仓库
   - 配置设置：
     - Root Directory: `server`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`

### 方案三：本地服务器部署

#### 完整本地部署

1. **安装依赖**
   ```bash
   # 根目录
   npm install
   
   # 客户端
   cd client
   npm install
   
   # 服务端
   cd ../server
   npm install
   ```

2. **构建前端**
   ```bash
   cd client
   npm run build
   ```

3. **启动服务**
   ```bash
   # 启动后端 (端口 5000)
   cd server
   npm start
   
   # 新终端窗口 - 启动前端开发服务器 (端口 3000)
   cd client
   npm run dev
   ```

4. **生产环境部署**
   ```bash
   # 使用 PM2 管理进程
   npm install -g pm2
   
   # 启动后端
   cd server
   pm2 start npm --name "backend" -- start
   
   # 启动前端 (使用 serve)
   cd client
   npm install -g serve
   serve -s dist -l 3000
   ```

### 方案四：自定义 VPS 部署

#### 服务器准备

1. **服务器要求**
   - Ubuntu 20.04+ / CentOS 8+
   - Node.js 18+
   - Nginx
   - PM2 (进程管理)

2. **安装依赖**
   ```bash
   # 更新系统
   sudo apt update && sudo apt upgrade -y
   
   # 安装 Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # 安装 Nginx
   sudo apt install nginx -y
   
   # 安装 PM2
   sudo npm install -g pm2
   ```

3. **部署代码**
   ```bash
   # 克隆代码
   git clone https://github.com/your-username/sorting-algorithms.git
   cd sorting-algorithms
   
   # 安装依赖
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   
   # 构建前端
   cd client
   npm run build
   cd ..
   ```

4. **配置 Nginx**
   ```bash
   sudo nano /etc/nginx/sites-available/sorting-algorithms
   ```

   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # 前端静态文件
       location / {
           root /path/to/sorting-algorithms/client/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # 后端 API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **启动服务**
   ```bash
   # 启用站点
   sudo ln -s /etc/nginx/sites-available/sorting-algorithms /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   
   # 启动后端
   cd server
   pm2 start npm --name "backend" -- start
   
   # 设置开机自启
   pm2 startup
   pm2 save
   ```

## 🔧 环境变量配置

### 前端环境变量 (.env)
```env
VITE_API_URL=http://localhost:5000
```

### 后端环境变量 (.env)
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
DATABASE_URL=./database.sqlite
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
```

## 📊 部署检查清单

### 前端检查
- [ ] 构建成功 (`npm run build`)
- [ ] 静态文件生成 (`client/dist/`)
- [ ] 环境变量配置
- [ ] API 地址正确
- [ ] 路由正常工作

### 后端检查
- [ ] 依赖安装完成
- [ ] 数据库初始化
- [ ] 环境变量配置
- [ ] API 端点可访问
- [ ] 邮件服务配置
- [ ] CORS 配置正确

### 功能测试
- [ ] 用户注册
- [ ] 邮箱验证
- [ ] 用户登录
- [ ] 算法可视化
- [ ] 题目练习
- [ ] 错题本功能

## 🚨 常见问题解决

### 1. 构建错误
```bash
# 清理缓存
rm -rf node_modules package-lock.json
npm install
```

### 2. 端口冲突
```bash
# 检查端口占用
lsof -i :3000
lsof -i :5000

# 杀死进程
kill -9 <PID>
```

### 3. 数据库错误
```bash
# 重新初始化数据库
cd server
rm database.sqlite
npm run init-db
```

### 4. 邮件服务问题
- 确保 Gmail 应用密码正确
- 检查邮箱设置中的 SMTP 配置
- 验证防火墙设置

## 📈 性能优化

### 前端优化
- 启用 Gzip 压缩
- 配置 CDN
- 启用浏览器缓存
- 代码分割优化

### 后端优化
- 启用 PM2 集群模式
- 配置 Redis 缓存
- 数据库索引优化
- 启用压缩中间件

## 🔒 安全配置

### SSL 证书
```bash
# 使用 Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 防火墙配置
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

## 📞 技术支持

如果遇到部署问题，请检查：
1. 控制台错误日志
2. 网络连接状态
3. 环境变量配置
4. 依赖版本兼容性

---

**🎉 恭喜！你的八大排序算法学习平台已经准备就绪！** 