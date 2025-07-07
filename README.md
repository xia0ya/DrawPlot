# 晓雅的可视化小窝

> 用心呈现每一份数据之美

---

## 项目简介

**晓雅的可视化小窝** 是一个基于 React + Vite 构建的静态网站，专注于展示各类数据可视化图表，并为每个图表配备了支持 Markdown 和数学公式的详细文字说明。项目界面简洁现代，交互流畅，适合个人作品集、学术展示、数据分析成果分享等多种场景。

---

## 功能亮点

- **图片可视化**：支持上传和展示多种格式的可视化图片，首页以卡片形式美观排列。
- **Markdown 描述**：每张图片配有独立的 Markdown 文件，支持富文本、列表、引用、代码块等格式。
- **数学公式渲染**：内置 KaTeX，完美支持 LaTeX 数学公式，适合学术和科研场景。
- **代码高亮**：代码块自动高亮，支持多语言，便于技术分享。
- **图片与描述联动**：点击图片可跳转至对应的详细描述页面，支持一键返回总览。
- **响应式设计**：适配多种屏幕，移动端浏览体验同样优秀。
- **一键部署**：集成 GitHub Actions 工作流，自动构建并部署到 GitHub Pages。

---

## 快速开始

1. **克隆项目**
   ```bash
   git clone https://github.com/xia0ya/DrawPlot.git
   cd DrawPlot
   ```
2. **安装依赖**
   ```bash
   npm install
   ```
3. **本地预览**
   ```bash
   npm run dev
   ```
   访问 [http://localhost:5173](http://localhost:5173) 查看效果。

4. **添加图片与描述**
   - 将图片放入 `public/images/` 目录。
   - 在 `src/data/charts.js` 中添加图片信息，描述文件名指向 `src/markdowns/` 下的 Markdown 文件。
   - 每个描述文件支持 Markdown、数学公式、图片、代码块等。

---

## 部署到 GitHub Pages

1. **确认 `vite.config.js` 的 `base` 字段为仓库名**：
   ```js
   export default defineConfig({
     base: '/DrawPlot/', // 仓库名
     plugins: [react()],
   })
   ```
2. **推送代码到 master 分支**
3. **在 GitHub 仓库设置 Pages，选择 GitHub Actions 部署**
4. **自动发布，访问 `https://你的用户名.github.io/DrawPlot/` 即可浏览**

---

## 技术栈
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [KaTeX](https://katex.org/)（数学公式）
- [PrismJS](https://prismjs.com/)（代码高亮）
- [GitHub Actions](https://github.com/features/actions)（自动部署）

---

## 贡献指南

欢迎任何形式的建议与贡献！你可以：
- 提交 Issue 反馈 bug 或建议
- Fork 并提交 Pull Request
- 优化样式、增加新功能、完善文档

---

## 鸣谢

感谢所有开源社区的优秀工具与灵感支持。

---

> 数据可视化，让洞察更有温度。
