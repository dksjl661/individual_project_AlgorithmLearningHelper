#!/bin/bash

echo "🔧 修复部署问题..."

# 1. 确保构建目录存在
echo "📁 创建构建目录..."
mkdir -p server/dist

# 2. 构建后端
echo "🔨 构建后端..."
cd server
npm install
npm run build
cd ..

# 3. 构建前端
echo "🎨 构建前端..."
cd client
npm install
npm run build
cd ..

# 4. 检查构建结果
echo "✅ 检查构建结果..."
if [ -f "server/dist/index.js" ]; then
    echo "✅ 后端构建成功: server/dist/index.js"
else
    echo "❌ 后端构建失败"
    exit 1
fi

if [ -d "client/dist" ]; then
    echo "✅ 前端构建成功: client/dist/"
else
    echo "❌ 前端构建失败"
    exit 1
fi

echo "🎉 构建完成！现在可以部署了。"

echo ""
echo "📋 部署步骤："
echo "1. 推送代码到 GitHub:"
echo "   git add ."
echo "   git commit -m 'Fix deployment configuration'"
echo "   git push origin main"
echo ""
echo "2. 在 Render 中重新部署："
echo "   - 进入你的 Render 项目"
echo "   - 点击 'Manual Deploy'"
echo "   - 选择 'Deploy latest commit'"
echo ""
echo "3. 或者使用 render.yaml 自动部署："
echo "   - 确保 render.yaml 文件在根目录"
echo "   - Render 会自动检测并部署" 