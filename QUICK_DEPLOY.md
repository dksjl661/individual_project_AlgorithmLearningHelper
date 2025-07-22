# 🚀 快速部署指南

## ✅ 当前状态

**前端构建成功！** ✅
- 构建文件: `client/dist/`
- 大小: ~673KB (压缩后 ~190KB)
- 状态: 准备部署

**后端状态:** ⚠️
- TypeScript编译有警告，但不影响运行
- 核心功能完整
- 数据库初始化正常

## 🎯 推荐部署方案

### 方案一：本地开发环境 (立即可用)

```bash
# 1. 启动后端 (端口 5000)
cd server
npm start

# 2. 新终端 - 启动前端 (端口 3000)
cd client
npm run dev
```

访问: http://localhost:3000

### 方案二：Vercel + Render (推荐生产部署)

#### 前端部署到 Vercel

1. **准备代码**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 连接 GitHub 仓库
   - 配置:
     - Framework: `Vite`
     - Root Directory: `client`
     - Build Command: `npm run build`
     - Output Directory: `dist`

3. **环境变量**
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   ```

#### 后端部署到 Render

1. **Render 部署**
   - 访问 [render.com](https://render.com)
   - 创建 Web Service
   - 配置:
     - Root Directory: `server`
     - Build Command: `npm install`
     - Start Command: `npm start`

2. **环境变量**
   ```
   PORT=5000
   JWT_SECRET=your-secret-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   NODE_ENV=production
   ```

### 方案三：Netlify + Railway

#### 前端 (Netlify)
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`

#### 后端 (Railway)
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`

## 🔧 环境变量配置

### 前端 (.env)
```env
VITE_API_URL=http://localhost:5000
```

### 后端 (.env)
```env
PORT=5000
JWT_SECRET=your-super-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
NODE_ENV=development
```

## 📋 功能测试清单

### 基础功能
- [x] 用户注册
- [x] 邮箱验证
- [x] 用户登录
- [x] 算法列表
- [x] 算法详情
- [x] 算法可视化

### 高级功能
- [x] 题目练习
- [x] 错题本
- [x] 用户进度
- [x] 多语言支持

## 🚨 快速故障排除

### 1. 端口冲突
```bash
# 检查端口
lsof -i :3000
lsof -i :5000

# 杀死进程
kill -9 <PID>
```

### 2. 数据库问题
```bash
cd server
rm database.sqlite
npm run init-db
```

### 3. 依赖问题
```bash
# 清理重装
rm -rf node_modules package-lock.json
npm install
```

## 🎉 部署成功标志

1. **前端访问正常**: http://localhost:3000
2. **后端API正常**: http://localhost:5000/api/algorithms
3. **数据库连接正常**: 无错误日志
4. **邮件服务正常**: 注册时能收到验证码

## 📞 技术支持

如果遇到问题：
1. 检查控制台错误
2. 验证环境变量
3. 确认端口未被占用
4. 检查网络连接

---

**🎯 现在就开始部署吧！选择方案一可以立即体验完整功能。** 